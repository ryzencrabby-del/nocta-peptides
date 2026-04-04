import { useState, useEffect } from 'react';
import {
  Elements,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2, AlertCircle } from 'lucide-react';

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
  onSuccess,
  onError,
  showDivider = true,
}: ExpressCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onConfirm = async () => {
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmed?order=${orderNumber}`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      onError?.(error.message || 'Payment failed');
      setIsLoading(false);
    } else {
      onSuccess(customerEmail, customerName);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}
      
      <div className="min-h-[48px] relative">
        <ExpressCheckoutElement onConfirm={onConfirm} />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 rounded-lg">
            <Loader2 className="w-6 h-6 animate-spin text-[#1A3A4A]" />
          </div>
        )}
      </div>

      {showDivider && (
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold tracking-widest uppercase">Or</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>
      )}
    </div>
  );
}

export default function ExpressCheckout(props: ExpressCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        console.error('Express initialization error:', err);
        setError(err.message);
      });
  }, [props.orderTotal, props.orderNumber]);

  if (error || !clientSecret) {
    return null; // Don't show anything if initialization fails or is loading in sidebar
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
            borderRadius: '10px',
          },
        },
        // Request shipping address collection for Express Checkout
        paymentMethodCreation: 'manual',
        externalPaymentMethodSettings: {
          applePay: {
            shippingContactFields: ['name', 'address', 'email', 'phone'],
          },
          googlePay: {
            shippingAddressRequired: true,
            shippingAddressParameters: {
              phoneNumberRequired: true,
            },
          },
        },
      }}
    >
      <InnerExpressCheckout {...props} />
    </Elements>
  );
}
