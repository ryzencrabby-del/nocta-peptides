// NOCTA PEPTIDES — Order Confirmed Page
// Shown after NOWPayments redirects back on successful payment.
// Reads ?order=NP12345 from URL query string.

import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { CheckCircle2, Mail, Package, ArrowRight } from 'lucide-react';

export default function OrderConfirmed() {
  const [orderNumber, setOrderNumber] = useState('');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Read order number from URL query param
    const params = new URLSearchParams(window.location.search);
    const order = params.get('order') || '';
    setOrderNumber(order);
    // Trigger animation after mount
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div
        className={`bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 transition-all duration-700 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Animated checkmark */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-full bg-green-100 flex items-center justify-center transition-all duration-500 ${
              animate ? 'scale-100' : 'scale-0'
            }`}
          >
            <CheckCircle2
              size={44}
              className={`text-green-500 transition-all duration-700 delay-200 ${
                animate ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
            />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-[#0D1F35] text-center mb-1">
          Payment Confirmed!
        </h1>

        {orderNumber && (
          <p className="text-gray-400 text-sm text-center mb-1">
            Order number:{' '}
            <span className="font-bold text-[#0D1F35]">{orderNumber}</span>
          </p>
        )}

        <p className="text-gray-500 text-sm text-center mb-7">
          Your payment has been received. Your order is now being processed.
        </p>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 space-y-3">
          <div className="flex items-start gap-3">
            <Package size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#0D1F35] text-sm mb-1">What happens next?</p>
              <ul className="text-xs text-gray-600 space-y-1.5 leading-relaxed">
                <li>✓ Your payment has been confirmed on the blockchain</li>
                <li>✓ Our team has been notified and will begin processing your order</li>
                <li>✓ Your order will be dispatched within 1–2 business days</li>
                <li>✓ You will receive a shipping confirmation email with tracking details</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Mail size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            A confirmation email has been sent to your email address. Please check your spam folder if you do not see it within a few minutes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop" className="flex-1">
            <button className="w-full btn-navy py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              Continue Shopping <ArrowRight size={15} />
            </button>
          </Link>
          <a href="mailto:orders@noctapeptides.com" className="flex-1">
            <button className="w-full py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:border-[#0D1F35] hover:text-[#0D1F35] transition-colors">
              Questions? Email Us
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
