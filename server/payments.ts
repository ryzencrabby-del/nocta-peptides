// NOCTA PEPTIDES — NOWPayments Integration
// Server-side only. API key NEVER exposed to frontend.

import type { Express } from "express";

const CURRENCY_MAP: Record<string, string> = {
  BTC: "btc",
  ETH: "eth",
  USDC: "usdcbase",
  LTC: "ltc",
};

// ─── In-memory order store ─────────────────────────────────────────────────
// Keyed by order number. Stores customer details so the webhook can retrieve
// them when NOWPayments fires the IPN callback.
interface OrderDetails {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: Array<{ name: string; dosage: string; qty: number; price: string }>;
}

const orderStore: Record<string, OrderDetails> = {};

export function registerPaymentRoutes(app: Express) {
  // ─── POST /api/create-payment ─────────────────────────────────────────────
  // Creates a NOWPayments hosted invoice and returns the invoice URL.
  // Also stores customer details in the in-memory order store for webhook use.
  app.post("/api/create-payment", async (req, res) => {
    try {
      const {
        orderTotal,
        orderNumber,
        selectedCrypto,
        customerName,
        customerEmail,
        shippingAddress,
        items,
      } = req.body as {
        orderTotal: number;
        orderNumber: string;
        selectedCrypto: string;
        customerName?: string;
        customerEmail?: string;
        shippingAddress?: string;
        items?: Array<{ name: string; dosage: string; qty: number; price: string }>;
      };

      if (!orderTotal || !orderNumber || !selectedCrypto) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const payCurrency = CURRENCY_MAP[selectedCrypto];
      if (!payCurrency) {
        res.status(400).json({ error: `Unsupported currency: ${selectedCrypto}` });
        return;
      }

      const apiKey = process.env.NOWPAYMENTS_API_KEY;
      if (!apiKey) {
        console.error("[NOWPayments] NOWPAYMENTS_API_KEY not set");
        res.status(500).json({ error: "Payment service not configured" });
        return;
      }

      // Store customer details for webhook lookup
      if (customerName && customerEmail) {
        orderStore[orderNumber] = {
          customerName,
          customerEmail,
          shippingAddress: shippingAddress || "",
          items: items || [],
        };
        console.log(`[OrderStore] Stored details for order ${orderNumber}`);
      }

      const siteUrl = process.env.SITE_URL || "https://noctapeptides.com";

      const response = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount: orderTotal,
          price_currency: "usd",
          pay_currency: payCurrency,
          order_id: orderNumber,
          order_description: `Nocta Peptides Order ${orderNumber}`,
          success_url: `${siteUrl}/order-confirmed?order=${orderNumber}`,
          cancel_url: `${siteUrl}/checkout`,
        }),
      });

      const invoice = await response.json() as { invoice_url?: string; message?: string };

      if (!invoice.invoice_url) {
        console.error("[NOWPayments] Failed to create invoice:", invoice);
        res.status(500).json({ error: "Failed to create invoice" });
        return;
      }

      res.json({ invoiceUrl: invoice.invoice_url, orderNumber });
    } catch (error) {
      console.error("[NOWPayments] create-payment error:", error);
      res.status(500).json({ error: "Payment creation failed" });
    }
  });

  // ─── POST /api/payment-webhook ────────────────────────────────────────────
  // Receives NOWPayments IPN callbacks.
  // On confirmed/finished: fires owner notification + customer confirmed email.
  app.post("/api/payment-webhook", async (req, res) => {
    try {
      const payment = req.body as {
        payment_status?: string;
        order_id?: string;
        actually_paid?: number;
        pay_currency?: string;
      };

      if (
        payment.payment_status === "finished" ||
        payment.payment_status === "confirmed"
      ) {
        // Retrieve customer details from order store
        const orderDetails = payment.order_id ? orderStore[payment.order_id] : undefined;
        const customerName = orderDetails?.customerName || "Customer";
        const customerEmail = orderDetails?.customerEmail;

        // Fire both emails in parallel
        const emailPromises: Promise<unknown>[] = [
          // 1) Owner notification
          fetch("https://formspree.io/f/mzdkdzbw", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              subject: `Payment Confirmed — Order ${payment.order_id}`,
              order_id: payment.order_id,
              payment_status: payment.payment_status,
              amount_paid: payment.actually_paid,
              currency: payment.pay_currency,
              customer_name: customerName,
              customer_email: customerEmail || "unknown",
              message: `Payment confirmed for order ${payment.order_id}. Amount received: ${payment.actually_paid} ${payment.pay_currency}. Customer: ${customerName} (${customerEmail || "unknown"}). Process and ship this order now.`,
            }),
          }),
        ];

        // 2) Customer confirmed email (only if we have their email)
        if (customerEmail) {
          emailPromises.push(
            fetch("https://formspree.io/f/mzdkdzbw", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                subject: `Payment Confirmed — Order ${payment.order_id} is Being Processed`,
                _replyto: customerEmail,
                name: customerName,
                email: customerEmail,
                message: `Hi ${customerName},\n\nGreat news! Your payment has been confirmed on the blockchain.\n\nOrder Number: ${payment.order_id}\nPayment Received: ${payment.actually_paid} ${payment.pay_currency}\n\nYour order is now being processed and will ship within 1-2 business days. You will receive a tracking number once shipped.\n\nQuestions? Email orders@noctapeptides.com\n\nThank you,\nNocta Peptides\nnoctapeptides.com`,
              }),
            })
          );
        }

        await Promise.all(emailPromises);
        console.log(`[NOWPayments] Webhook processed for order ${payment.order_id}, status: ${payment.payment_status}`);
      }

      res.status(200).json({ status: "ok" });
    } catch (error) {
      console.error("[NOWPayments] webhook error:", error);
      // Always return 200 to prevent NOWPayments from retrying
      res.status(200).json({ status: "ok" });
    }
  });
}
