import { useState, useEffect } from 'react';
import {
  Elements,
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, PaymentRequest } from '@stripe/stripe-js';
import { Loader2, AlertCircle, Apple, Smartphone } from 'lucide-react';

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

function InnerExpressCheckout({
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
  const [canMakePayment, setCanMakePayment] = useState<boolean | null>(null);

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

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setCanMakePayment(true);
      } else {
        setCanMakePayment(false);
      }
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
            items: items || []
          }),
        });

        const { clientSecret, error: serverError } = await response.json() as { clientSecret?: string; error?: string };

        if (serverError || !clientSecret) {
          ev.complete('fail');
          onError?.(serverError || 'Payment setup failed.');
          return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (error) {
          ev.complete('fail');
          onError?.(error.message || 'Payment failed.');
          return;
        }

        ev.complete('success');

        if (paymentIntent.status === 'requires_action') {
          const { error: actionError } = await stripe.confirmCardPayment(clientSecret);
          if (actionError) {
            onError?.(actionError.message || 'Authentication failed.');
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
              message: `Express checkout confirmed.\n\nOrder: ${orderNumber}\nAmount: $${orderTotal.toFixed(2)}\nCustomer: ${resolvedName} (${resolvedEmail})\n\nSHIP THIS ORDER NOW.`,
            }),
          });
        } catch (e) {
          console.error('[Formspree] failed:', e);
        }

        onSuccess(resolvedEmail, resolvedName);
      } catch (err) {
        ev.complete('fail');
        onError?.('Payment failed. Please try again.');
      }
    });
  }, [stripe, orderTotal, orderNumber]);

  if (canMakePayment === null) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-6 h-6 animate-spin text-[#1A3A4A]" />
      </div>
    );
  }

  if (canMakePayment === false) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl text-center space-y-3">
        <div className="flex justify-center gap-4 text-gray-300">
          <Apple size={32} />
          <Smartphone size={32} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-[#1A3A4A]">Express Checkout Unavailable</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Apple Pay is available on Safari. Google Pay is available on Chrome. 
            Please ensure you have a card set up in your browser or use the Card tab instead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PaymentRequestButtonElement
        options={{
          paymentRequest: paymentRequest!,
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
