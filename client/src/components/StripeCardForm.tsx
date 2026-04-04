import { useState, useEffect } from 'react';
import {
  Elements,
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
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
  onSuccess,
}: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isReady, setIsReady] = useState(false);

  const handleStripePayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmed?order=${orderNumber}`,
        receipt_email: customerEmail,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      {/* Express Checkout Element (Apple/Google Pay) */}
      <div className="mb-8">
        <ExpressCheckoutElement onConfirm={handleStripePayment} />
      </div>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-widest font-medium">Or pay with card</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleStripePayment} className="space-y-4">
        <div className="min-h-[200px] relative">
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#1A3A4A]" />
            </div>
          )}
          <PaymentElement 
            options={{ layout: 'tabs' }} 
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
          className="w-full bg-[#1A3A4A] text-white py-4 rounded-lg font-bold text-base flex items-center justify-center gap-2 hover:bg-[#0D2535] transition-all shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <><Loader2 size={18} className="animate-spin" />Processing...</>
          ) : (
            <><CreditCard size={18} />Pay Now — ${orderTotal.toFixed(2)}</>
          )}
        </button>

        <p className="text-center text-[10px] text-gray-400 uppercase tracking-wider font-semibold pt-2">
          🔒 Secure Encrypted Payment via Stripe
        </p>
      </form>
    </div>
  );
}

export default function StripeCardForm(props: StripeCardFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setClientSecret(null);
    setError(null);
    
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
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.details || data.error || 'Failed to initialize payment');
        return data;
      })
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('No client secret received from server');
        }
      })
      .catch(err => {
        console.error('Stripe initialization error:', err);
        setError(err.message);
      });
  }, [props.orderTotal, props.orderNumber]);

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="font-bold text-red-900">Checkout Initialization Failed</h3>
        <p className="text-sm text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-xs font-bold text-red-600 underline uppercase tracking-widest"
        >
          Try Refreshing the Page
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#1A3A4A]" />
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Securing your session...</p>
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
            spacingUnit: '5px',
            borderRadius: '10px',
          },
        }
      }}
    >
      <InnerCardForm {...props} />
    </Elements>
  );
}
