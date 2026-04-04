// NOCTA PEPTIDES — Payment Routes (NOWPayments + Stripe)
// Server-side only. API keys NEVER exposed to frontend.

import type { Express, Request, Response } from "express";
import Stripe from "stripe";

const CURRENCY_MAP: Record<string, string> = {
  BTC: "btc",
  ETH: "eth",
  USDC: "usdcbase",
  LTC: "ltc",
};

// ─── In-memory order store ─────────────────────────────────────────────────
// Keyed by order number. Stores customer details so webhooks can retrieve
// them when NOWPayments or Stripe fires a callback.
interface OrderDetails {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: Array<{ name: string; dosage: string; qty: number; price: string }>;
  orderTotal?: number;
}

const orderStore: Record<string, OrderDetails> = {};

export function registerPaymentRoutes(app: Express) {
  // ─── POST /api/create-payment ─────────────────────────────────────────────
  // Creates a NOWPayments hosted invoice and returns the invoice URL.
  app.post("/api/create-payment", async (req: Request, res: Response) => {
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
          orderTotal,
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

      const invoice = (await response.json()) as {
        invoice_url?: string;
        message?: string;
      };

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
  app.post("/api/payment-webhook", async (req: Request, res: Response) => {
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
        const orderDetails = payment.order_id
          ? orderStore[payment.order_id]
          : undefined;
        const customerName = orderDetails?.customerName || "Customer";
        const customerEmail = orderDetails?.customerEmail;

        const emailPromises: Promise<unknown>[] = [
          fetch("https://formspree.io/f/mzdkdzbw", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
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

        if (customerEmail) {
          emailPromises.push(
            fetch("https://formspree.io/f/mzdkdzbw", {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
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
        console.log(
          `[NOWPayments] Webhook processed for order ${payment.order_id}, status: ${payment.payment_status}`
        );
      }

      res.status(200).json({ status: "ok" });
    } catch (error) {
      console.error("[NOWPayments] webhook error:", error);
      res.status(200).json({ status: "ok" });
    }
  });

  // ─── POST /api/create-payment-intent ─────────────────────────────────────
  // Creates a Stripe PaymentIntent and returns the client secret.
  // STRIPE_SECRET_KEY is server-side only — never sent to the browser.
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecretKey) {
        console.error("[Stripe] STRIPE_SECRET_KEY not set");
        res.status(500).json({ error: "Payment service not configured" });
        return;
      }

      const stripe = new Stripe(stripeSecretKey);

      const {
        orderTotal,
        orderNumber,
        customerEmail,
        customerName,
        shippingAddress,
        items,
      } = req.body as {
        orderTotal: number;
        orderNumber: string;
        customerEmail?: string;
        customerName?: string;
        shippingAddress?: string;
        items?: Array<{ name: string; dosage: string; qty: number; price: string }>;
      };

      if (!orderTotal || !orderNumber) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      // Store customer details for webhook lookup
      if (customerName && customerEmail) {
        orderStore[orderNumber] = {
          customerName,
          customerEmail,
          shippingAddress: shippingAddress || "",
          items: items || [],
          orderTotal,
        };
        console.log(`[OrderStore] Stored Stripe order details for ${orderNumber}`);
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(orderTotal) * 100), // cents
        currency: "usd",
        receipt_email: customerEmail || undefined,
        metadata: {
          order_id: orderNumber,
          customer_name: customerName || "",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log(`[Stripe] Created intent ${paymentIntent.id} for order ${orderNumber}`);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("[Stripe] create-payment-intent error:", error);
      res.status(500).json({ 
        error: "Payment setup failed", 
        details: error.message,
        type: error.type 
      });
    }
  });

  // ─── POST /api/stripe/webhook ─────────────────────────────────────────────
  // Receives Stripe webhook events. Must be registered with raw body parser
  // (handled in _core/index.ts before express.json()).
  app.post("/api/stripe/webhook", async (req: Request, res: Response) => {
    try {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!stripeSecretKey) {
        res.status(500).json({ error: "Stripe not configured" });
        return;
      }

      const stripe = new Stripe(stripeSecretKey);
      let event: Stripe.Event;

      // Test event detection (required per Stripe integration spec)
      const rawBody = req.body as Buffer | string;
      const sig = req.headers["stripe-signature"] as string;

      if (webhookSecret && sig) {
        try {
          event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
        } catch (err) {
          console.error("[Stripe Webhook] Signature verification failed:", err);
          res.status(400).json({ error: "Webhook signature verification failed" });
          return;
        }
      } else {
        // No webhook secret configured — parse body directly (dev/test mode)
        event = (typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody) as Stripe.Event;
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        res.json({ verified: true });
        return;
      }

      if (event.type === "payment_intent.succeeded") {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.order_id;
        const orderDetails = orderId ? orderStore[orderId] : undefined;
        const customerName = orderDetails?.customerName || pi.metadata?.customer_name || "Customer";
        const customerEmail = orderDetails?.customerEmail || pi.receipt_email || undefined;
        const amountPaid = (pi.amount_received / 100).toFixed(2);

        console.log(`[Stripe Webhook] payment_intent.succeeded for order ${orderId}`);

        const emailPromises: Promise<unknown>[] = [
          // Owner notification
          fetch("https://formspree.io/f/mzdkdzbw", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              subject: `Card Payment Confirmed — Order ${orderId} — $${amountPaid}`,
              order_id: orderId,
              payment_method: "stripe-card",
              amount_paid: amountPaid,
              customer_name: customerName,
              customer_email: customerEmail || "unknown",
              message: `Card payment confirmed via Stripe. SHIP THIS ORDER NOW.\n\nOrder: ${orderId}\nAmount: $${amountPaid} USD\nCustomer: ${customerName} (${customerEmail || "unknown"})\nStripe PaymentIntent: ${pi.id}`,
            }),
          }),
        ];

        if (customerEmail) {
          emailPromises.push(
            fetch("https://formspree.io/f/mzdkdzbw", {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({
                subject: `Payment Confirmed — Order ${orderId} is Being Processed`,
                _replyto: customerEmail,
                name: customerName,
                email: customerEmail,
                message: `Hi ${customerName},\n\nGreat news! Your card payment has been confirmed.\n\nOrder Number: ${orderId}\nAmount Charged: $${amountPaid} USD\n\nYour order is now being processed and will ship within 1-2 business days. You will receive a tracking number once shipped.\n\nQuestions? Email orders@noctapeptides.com\n\nThank you,\nNocta Peptides\nnoctapeptides.com`,
              }),
            })
          );
        }

        await Promise.all(emailPromises);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("[Stripe Webhook] error:", error);
      res.status(200).json({ received: true });
    }
  });
}
