// NOCTA PEPTIDES — Checkout Page

import { useState } from 'react';
import { Link } from 'wouter';
import { ShieldCheck, Lock, CheckCircle, ChevronLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
    cardNumber: '', expiry: '', cvv: '', cardName: '',
    agreeTerms: false, agreeResearch: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const shipping = subtotal >= 150 ? 0 : 12.99;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreeTerms || !form.agreeResearch) {
      alert('Please agree to the Terms of Service and Research Disclaimer to continue.');
      return;
    }
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-[#1A3A4A] mb-2">Order Confirmed!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            Thank you for your order. A confirmation email has been sent to <strong>{form.email}</strong>.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Orders are dispatched within 48 hours. You will receive tracking information by email.
          </p>
          <Link href="/shop">
            <button className="btn-navy px-6 py-3 rounded-md text-sm font-semibold">Continue Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Your cart is empty.</p>
          <Link href="/shop">
            <button className="btn-navy px-5 py-2.5 rounded-md text-sm">Browse Products</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/shop" className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1A3A4A] transition-colors">
            <ChevronLeft size={14} /> Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="font-bold text-[#1A3A4A] text-base mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'firstName', label: 'First Name', placeholder: 'John' },
                    { key: 'lastName', label: 'Last Name', placeholder: 'Smith' },
                    { key: 'email', label: 'Email', placeholder: 'john@lab.edu', type: 'email' },
                    { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', type: 'tel' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">{field.label}</label>
                      <input
                        type={field.type || 'text'}
                        required={field.key !== 'phone'}
                        value={(form as any)[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="font-bold text-[#1A3A4A] text-base mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Street Address</label>
                    <input type="text" required value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                      placeholder="123 Research Blvd" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">City</label>
                      <input type="text" required value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                        placeholder="Boston" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">State</label>
                      <input type="text" required value={form.state} onChange={e => setForm({...form, state: e.target.value})}
                        placeholder="MA" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">ZIP</label>
                      <input type="text" required value={form.zip} onChange={e => setForm({...form, zip: e.target.value})}
                        placeholder="02101" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-[#1A3A4A] text-base">Payment</h2>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Lock size={12} /> SSL Secured
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Card Number</label>
                    <input type="text" required value={form.cardNumber} onChange={e => setForm({...form, cardNumber: e.target.value})}
                      placeholder="4242 4242 4242 4242" maxLength={19}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors font-mono" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Expiry</label>
                      <input type="text" required value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})}
                        placeholder="MM / YY" maxLength={7}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">CVV</label>
                      <input type="text" required value={form.cvv} onChange={e => setForm({...form, cvv: e.target.value})}
                        placeholder="123" maxLength={4}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Name on Card</label>
                    <input type="text" required value={form.cardName} onChange={e => setForm({...form, cardName: e.target.value})}
                      placeholder="John Smith"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors" />
                  </div>
                </div>
              </div>

              {/* Agreements */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-3">
                <h2 className="font-bold text-[#1A3A4A] text-base mb-2">Agreements</h2>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.agreeTerms} onChange={e => setForm({...form, agreeTerms: e.target.checked})}
                    className="mt-0.5 w-4 h-4 accent-[#1A3A4A]" />
                  <span className="text-sm text-gray-600">
                    I agree to the <Link href="/terms" className="text-[#1A3A4A] underline">Terms of Service</Link> and{' '}
                    <Link href="/privacy" className="text-[#1A3A4A] underline">Privacy Policy</Link>.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.agreeResearch} onChange={e => setForm({...form, agreeResearch: e.target.checked})}
                    className="mt-0.5 w-4 h-4 accent-[#1A3A4A]" />
                  <span className="text-sm text-gray-600">
                    I confirm these products are for <strong>research use only</strong> and not for human consumption.
                    I agree to the <Link href="/disclaimer" className="text-[#1A3A4A] underline">Research Disclaimer</Link>.
                  </span>
                </label>
              </div>

              <button type="submit" className="w-full btn-navy py-4 rounded-md text-sm font-semibold flex items-center justify-center gap-2">
                <ShieldCheck size={16} /> Place Order · ${total.toFixed(2)}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-[#1A3A4A] text-base mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.selectedDose}`} className="flex items-center gap-3">
                    <img src={item.product.imageCompressed} alt={item.product.name}
                      className="w-12 h-12 object-contain bg-gray-50 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1A3A4A] truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-400">{item.selectedDose} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#1A3A4A]">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                {subtotal < 150 && (
                  <p className="text-xs text-gray-400">Add ${(150 - subtotal).toFixed(2)} more for free shipping</p>
                )}
                <div className="flex justify-between font-bold text-[#1A3A4A] text-base pt-2 border-t border-gray-100">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
