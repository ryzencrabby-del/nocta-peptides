// NOCTA PEPTIDES — NOWPayments Integration
// Server-side only. API key NEVER exposed to frontend.

import type { Express } from "express";

const CURRENCY_MAP: Record<string, string> = {
  BTC: "btc",
  ETH: "eth",
  USDC: "usdcbase",
  LTC: "ltc",
};

export function registerPaymentRoutes(app: Express) {
  // ─── POST /api/create-payment ─────────────────────────────────────────────
  // Creates a NOWPayments hosted invoice and returns the invoice URL.
  app.post("/api/create-payment", async (req, res) => {
    try {
      const { orderTotal, orderNumber, selectedCrypto } = req.body as {
        orderTotal: number;
        orderNumber: string;
        selectedCrypto: string;
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
  // Receives NOWPayments IPN callbacks and fires Formspree notification on
  // confirmed/finished payments.
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
        await fetch("https://formspree.io/f/mzdkdzbw", {
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
            message: `Payment confirmed for order ${payment.order_id}. Amount received: ${payment.actually_paid} ${payment.pay_currency}. Process and ship this order now.`,
          }),
        });
      }

      res.status(200).json({ status: "ok" });
    } catch (error) {
      console.error("[NOWPayments] webhook error:", error);
      // Always return 200 to prevent NOWPayments from retrying
      res.status(200).json({ status: "ok" });
    }
  });
}
