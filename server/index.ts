import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory order store for webhook callbacks
const orderStore: Record<string, {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: any[];
}> = {};

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ─── Stripe Webhook (must be before express.json()) ──────────────────
  app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    
    try {
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
      
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as any;
        const orderNumber = paymentIntent.metadata?.order_id;
        const customerEmail = paymentIntent.receipt_email;
        const amount = (paymentIntent.amount / 100).toFixed(2);

        await fetch('https://formspree.io/f/mzdkdzbw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            subject: `✅ Card Payment Confirmed — Order ${orderNumber} — $${amount}`,
            order_id: orderNumber,
            amount_paid: `$${amount}`,
            customer_email: customerEmail,
            payment_method: 'Stripe card payment',
            message: `Card payment confirmed via Stripe for order ${orderNumber}. Amount: $${amount}. SHIP THIS ORDER NOW.`
          })
        });
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error('Webhook error:', err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // ─── Body parsers ─────────────────────────────────────────────────────
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ─── Apple Pay domain verification ───────────────────────────────────
  app.get('/.well-known/apple-developer-merchantid-domain-association', (_req, res) => {
    const filePath = path.join(__dirname, '../public/.well-known/apple-developer-merchantid-domain-association');
    res.sendFile(filePath, (err) => {
      if (err) res.status(404).send('Not found');
    });
  });

  // ─── Stripe Payment Intent ────────────────────────────────────────────
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
      const { orderTotal, orderNumber, customerEmail, customerName, shippingAddress, items } = req.body;

      // Store order for webhook
      if (orderNumber) {
        orderStore[orderNumber] = {
          customerName: customerName || '',
          customerEmail: customerEmail || '',
          shippingAddress: shippingAddress || '',
          items: items || []
        };
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(orderTotal * 100),
        currency: 'usd',
        receipt_email: customerEmail,
        metadata: {
          order_id: orderNumber,
          customer_name: customerName || ''
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: 'Payment setup failed' });
    }
  });

  // ─── NOWPayments Invoice ──────────────────────────────────────────────
  app.post('/api/create-payment', async (req, res) => {
    try {
      const { orderTotal, orderNumber, selectedCrypto } = req.body;

      const currencyMap: Record<string, string> = {
        'BTC': 'btc',
        'ETH': 'eth',
        'USDC': 'usdcbase',
        'LTC': 'ltc'
      };

      const response = await fetch('https://api.nowpayments.io/v1/invoice', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NOWPAYMENTS_API_KEY as string,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          price_amount: orderTotal,
          price_currency: 'usd',
          pay_currency: currencyMap[selectedCrypto] || 'btc',
          order_id: orderNumber,
          order_description: `Nocta Peptides Order ${orderNumber}`,
          success_url: `${process.env.SITE_URL}/order-confirmed?order=${orderNumber}`,
          cancel_url: `${process.env.SITE_URL}/checkout`
        })
      });

      const invoice = await response.json() as any;

      if (!invoice.invoice_url) {
        throw new Error('Failed to create invoice');
      }

      res.json({ invoiceUrl: invoice.invoice_url, orderNumber });
    } catch (error: any) {
      console.error('NOWPayments error:', error);
      res.status(500).json({ error: 'Payment creation failed' });
    }
  });

  // ─── NOWPayments Webhook ──────────────────────────────────────────────
  app.post('/api/payment-webhook', async (req, res) => {
    try {
      const payment = req.body;

      if (payment.payment_status === 'finished' || payment.payment_status === 'confirmed') {
        const orderDetails = orderStore[payment.order_id];

        await fetch('https://formspree.io/f/mzdkdzbw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            subject: `✅ Crypto Payment Confirmed — Order ${payment.order_id}`,
            order_id: payment.order_id,
            payment_status: payment.payment_status,
            amount_paid: payment.actually_paid,
            currency: payment.pay_currency,
            customer_email: orderDetails?.customerEmail || 'unknown',
            customer_name: orderDetails?.customerName || 'unknown',
            message: `Crypto payment confirmed for order ${payment.order_id}. Amount: ${payment.actually_paid} ${payment.pay_currency}. SHIP THIS ORDER NOW.`
          })
        });
      }

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(200).json({ status: 'ok' });
    }
  });

  // ─── Static files ─────────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // ─── Client-side routing ──────────────────────────────────────────────
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);