// NOCTA PEPTIDES — Stripe Card Payment Form
// Wraps Stripe Elements. VITE_STRIPE_PUBLISHABLE_KEY is the only key used here.
// STRIPE_SECRET_KEY lives server-side only — never referenced in this file.

import { useState } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import ExpressCheckout, { InnerExpressCheckout } from './ExpressCheckout';

// Publishable key is provided via Elements provider in parent component

export interface StripeCardFormProps {
  orderTotal: number;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  items: Array<{ name: string; dosage: string; qty: number; price: string }>;
  onSuccess: () => void;
}

// ─── Inner form (must be inside <Elements>) ────────────────────────────────
function InnerCardForm({
  orderTotal,
  orderNumber,
  customerEmail,
  customerName,
  shippingAddress,
  items,
  onSuccess,
}: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [nameOnCard, setNameOnCard] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ─── Formspree notification ────────────────────────────────────────────────
  const sendFormspreeNotification = async () => {
    try {
      await fetch('https://formspree.io/f/mzdkdzbw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          subject: `Card Payment Confirmed — Order ${orderNumber} — $${orderTotal.toFixed(2)}`,
          _replyto: customerEmail,
          name: customerName,
          email: customerEmail,
          message: `Card payment confirmed via Stripe. SHIP THIS ORDER NOW.\n\nOrder: ${orderNumber}\nAmount: $${orderTotal.toFixed(2)} USD\nCustomer: ${customerName} (${customerEmail})\nShipping: ${shippingAddress}\n\nItems:\n${items.map(i => `${i.name} ${i.dosage} x${i.qty} — $${i.price}`).join('\n')}`,
        }),
      });
    } catch (e) {
      console.error('[Formspree] notification failed:', e);
    }
  };

  // ─── Card payment handler ─────────────────────────────────────────────────
  const handleStripePayment = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    if (!nameOnCard.trim()) {
      setErrorMessage('Please enter the name on your card.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Processing your payment...');
    setErrorMessage('');

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderTotal, orderNumber, customerEmail, customerName, shippingAddress, items }),
      });

      const { clientSecret, error: serverError } = await response.json() as { clientSecret?: string; error?: string };

      if (serverError || !clientSecret) {
        setErrorMessage(serverError || 'Payment setup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: nameOnCard,
            email: customerEmail,
          },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message || 'Payment failed. Please check your card details.');
        setIsLoading(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        await sendFormspreeNotification();
        onSuccess();
      }
    } catch {
      setErrorMessage('Payment failed. Please try again or contact orders@noctapeptides.com');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Apple Pay / Google Pay — uses shared ExpressCheckout component */}
      <InnerExpressCheckout
        orderTotal={orderTotal}
        orderNumber={orderNumber}
        customerEmail={customerEmail}
        customerName={customerName}
        shippingAddress={shippingAddress}
        items={items}
        showDivider={true}
        onSuccess={() => onSuccess()}
        onError={(msg) => setErrorMessage(msg)}
      />

      {/* Name on card */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Name on Card
        </label>
        <input
          type="text"
          value={nameOnCard}
          onChange={e => setNameOnCard(e.target.value)}
          placeholder="Full name as it appears on card"
          disabled={isLoading}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A4A] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Stripe CardElement */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Card Details
        </label>
        <div className="px-3 py-3 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#1A3A4A] focus-within:border-transparent transition-all">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#1A3A4A',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': { color: '#9ca3af' },
                },
                invalid: { color: '#ef4444' },
              },
              hidePostalCode: false,
            }}
          />
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Pay Now button */}
      <button
        onClick={handleStripePayment}
        disabled={isLoading || !stripe}
        className="w-full bg-[#1A3A4A] text-white py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#0D2535] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {loadingMessage || 'Processing...'}
          </>
        ) : (
          <>
            <CreditCard size={16} />
            Pay Now — ${orderTotal.toFixed(2)}
          </>
        )}
      </button>

      {/* Security note */}
      <p className="text-center text-xs text-gray-400">
        🔒 Secured by Stripe. Your card details are never stored on our servers.
      </p>
    </div>
  );
}

// ─── Exported component ─────────────────────────────────────────────────────
export default function StripeCardForm(props: StripeCardFormProps) {
  return <InnerCardForm {...props} />;
}
