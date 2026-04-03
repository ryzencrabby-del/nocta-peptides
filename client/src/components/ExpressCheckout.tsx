// NOCTA PEPTIDES — Express Checkout (Apple Pay / Google Pay)
import { useState, useEffect } from 'react';
import {
  Elements,
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, PaymentRequest } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

export interface ExpressCheckoutProps {
  orderTotal: number;
  orderNumber: string;
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: string;
  items?: Array<{ name: string; dosage: string; qty: number; price: string }>;
  onSuccess: (payerEmail?: string, payerName?: string) => void;
  onError?: (msg: string) => void;
  showDivider?: boolean;
}

export function InnerExpressCheckout({
  orderTotal,
  orderNumber,
  customerEmail,
  customerName,
  shippingAddress,
  items,
  onSuccess,
  onError,
  showDivider = true,
}: ExpressCheckoutProps) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: `Nocta Peptides — Order ${orderNumber}`,
        amount: Math.round(orderTotal * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then(result => {
      if (result) setPaymentRequest(pr);
    });

    pr.on('paymentmethod', async (ev) => {
      const resolvedEmail = customerEmail || ev.payerEmail || '';
      const resolvedName = customerName || ev.payerName || '';

      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderTotal,
            orderNumber,
            customerEmail: resolvedEmail,
            customerName: resolvedName,
            shippingAddress: shippingAddress || '',
            items: items || [],
          }),
        });

        const { clientSecret, error: serverError } = await response.json() as {
          clientSecret?: string;
          error?: string;
        };

        if (serverError || !clientSecret) {
          ev.complete('fail');
          onError?.(serverError || 'Payment setup failed. Please try again.');
          return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (error) {
          ev.complete('fail');
          onError?.(error.message || 'Payment failed. Please try again.');
          return;
        }

        ev.complete('success');

        if (paymentIntent.status === 'requires_action') {
          const { error: actionError } = await stripe.confirmCardPayment(clientSecret);
          if (actionError) {
            onError?.(actionError.message || 'Payment authentication failed.');
            return;
          }
        }

        try {
          await fetch('https://formspree.io/f/mzdkdzbw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              subject: `Express Payment Confirmed — Order ${orderNumber} — $${orderTotal.toFixed(2)}`,
              _replyto: resolvedEmail,
              name: resolvedName,
              email: resolvedEmail,
              message: `Express checkout (Apple Pay / Google Pay) confirmed.\n\nOrder: ${orderNumber}\nAmount: $${orderTotal.toFixed(2)} USD\nCustomer: ${resolvedName} (${resolvedEmail})\n\nSHIP THIS ORDER NOW.`,
            }),
          });
        } catch (e) {
          console.error('[Formspree] express checkout notification failed:', e);
        }

        onSuccess(resolvedEmail, resolvedName);
      } catch {
        ev.complete('fail');
        onError?.('Payment failed. Please try again or contact orders@noctapeptides.com');
      }
    });
  }, [stripe, orderTotal, orderNumber]);

  if (!paymentRequest) return null;

  return (
    <div>
      <PaymentRequestButtonElement
        options={{
          paymentRequest,
          style: {
            paymentRequestButton: {
              type: 'buy',
              theme: 'dark',
              height: '48px',
            },
          },
        }}
      />
      {showDivider && (
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      )}
    </div>
  );
}

export default function ExpressCheckout(props: ExpressCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <InnerExpressCheckout {...props} />
    </Elements>
  );
}