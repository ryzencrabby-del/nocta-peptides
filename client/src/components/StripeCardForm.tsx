import { useState, useEffect } from 'react';
import {
  Elements,
  CardElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe, PaymentRequest } from '@stripe/stripe-js';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

export interface StripeCardFormProps {
  orderTotal: number;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  items: Array<{ name: string; dosage: string; qty: number; price: string }>;
  onSuccess: () => void;
}

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
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

  // Setup Apple Pay / Google Pay
  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: `Nocta Peptides Order ${orderNumber}`,
        amount: Math.round(orderTotal * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on('paymentmethod', async (ev) => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderTotal,
            orderNumber,
            customerEmail: ev.payerEmail || customerEmail,
            customerName: ev.payerName || customerName,
            shippingAddress,
            items
          }),
        });

        const { clientSecret, error: serverError } = await response.json();

        if (serverError || !clientSecret) {
          ev.complete('fail');
          setErrorMessage(serverError || 'Payment setup failed.');
          return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (error) {
          ev.complete('fail');
          setErrorMessage(error.message || 'Payment failed.');
          return;
        }

        ev.complete('success');

        if (paymentIntent.status === 'requires_action') {
          await stripe.confirmCardPayment(clientSecret);
        }

        await sendFormspreeNotification();
        onSuccess();
        window.location.href = '/order-confirmed';
      } catch (err) {
        ev.complete('fail');
        setErrorMessage('An unexpected error occurred during express checkout.');
      }
    });
  }, [stripe, orderTotal, orderNumber]);

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
          message: `Card payment confirmed via Stripe. SHIP THIS ORDER NOW.\n\nOrder: ${orderNumber}\nAmount: $${orderTotal.toFixed(2)}\nCustomer: ${customerName} (${customerEmail})`,
        }),
      });
    } catch (e) {
      console.error('[Formspree] failed:', e);
    }
  };

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

      const { clientSecret, error: serverError } = await response.json();

      if (serverError || !clientSecret) {
        setErrorMessage(serverError || 'Payment setup failed.');
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
        setErrorMessage(result.error.message || 'Payment failed.');
        setIsLoading(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        await sendFormspreeNotification();
        onSuccess();
        window.location.href = '/order-confirmed';
      }
    } catch (err) {
      setErrorMessage('Payment failed. Please try again or contact orders@noctapeptides.com');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {paymentRequest && (
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
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </div>
      )}

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
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A4A] focus:border-transparent disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Card Details
        </label>
        <div className="px-3 py-3 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#1A3A4A] transition-all">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#1A3A4A',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': { color: '#9ca3af' },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
              hidePostalCode: false,
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

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

      <p className="text-center text-xs text-gray-400">
        🔒 Secured by Stripe. Your card details are never stored on our servers.
      </p>
    </div>
  );
}

export default function StripeCardForm(props: StripeCardFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <InnerCardForm {...props} />
    </Elements>
  );
}
