import { useState, useEffect } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe, StripePaymentElementOptions } from '@stripe/stripe-js';
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isReady, setIsReady] = useState(false);

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmed?order=${orderNumber}`,
        receipt_email: customerEmail,
        payment_method_data: {
          billing_details: {
            name: customerName,
            email: customerEmail,
          },
        },
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setIsLoading(false);
    } else {
      // confirmPayment usually redirects, but if it doesn't:
      onSuccess();
    }
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
    business: { name: 'Nocta Peptides' },
  };

  return (
    <form onSubmit={handleStripePayment} className="space-y-4">
      <div className="min-h-[300px] relative">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#1A3A4A]" />
          </div>
        )}
        <PaymentElement 
          options={paymentElementOptions} 
          onReady={() => setIsReady(true)}
        />
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements || !isReady}
        className="w-full bg-[#1A3A4A] text-white py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#0D2535] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <><Loader2 size={16} className="animate-spin" />Processing...</>
        ) : (
          <><CreditCard size={16} />Pay Now — ${orderTotal.toFixed(2)}</>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        🔒 Secured by Stripe. Your payment details are never stored on our servers.
      </p>
    </form>
  );
}

export default function StripeCardForm(props: StripeCardFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderTotal: props.orderTotal,
        orderNumber: props.orderNumber,
        customerEmail: props.customerEmail,
        customerName: props.customerName,
        shippingAddress: props.shippingAddress,
        items: props.items,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create payment intent');
        return res.json();
      })
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error('No client secret returned:', data);
        }
      })
      .catch(err => {
        console.error('Payment intent error:', err);
      });
  }, [props.orderTotal, props.orderNumber]);

  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A3A4A]" />
        <p className="text-sm text-gray-500 font-medium">Initializing secure checkout...</p>
      </div>
    );
  }

  return (
    <Elements 
      stripe={stripePromise} 
      options={{ 
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#1A3A4A',
            colorBackground: '#ffffff',
            colorText: '#1A3A4A',
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        }
      }}
    >
      <InnerCardForm {...props} />
    </Elements>
  );
}
