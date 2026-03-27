// NOCTA PEPTIDES — Checkout Page
// 3-step: 1 Shipping Address, 2 Delivery Method, 3 Payment (Crypto default)
// NO card form fields anywhere. PaymentCardForm.tsx handles coming-soon message.
// Order confirmation screen replaces page after Place Order.
// Formspree notifications + localStorage order storage.

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Lock, CheckCircle2, ChevronDown, ShieldCheck, Mail } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import PaymentCardForm from '@/components/PaymentCardForm';

const TAX_RATE = 0.08875;

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Shipping', daysMin: 4, daysMax: 6, price: 4.99, freeAt: 150 },
  { id: 'twoday',   label: 'Two Day Shipping',   daysMin: 2, daysMax: 2, price: 14.99, freeAt: 175 },
  { id: 'overnight',label: 'Overnight Shipping — Orders before 2PM EST', daysMin: 1, daysMax: 1, price: 39.99, freeAt: Infinity },
];

const CRYPTOS = [
  { id: 'BTC',  label: 'Bitcoin',   ticker: 'BTC',  icon: '₿' },
  { id: 'ETH',  label: 'Ethereum',  ticker: 'ETH',  icon: 'Ξ' },
  { id: 'USDC', label: 'USDC',      ticker: 'USDC', icon: '$' },
  { id: 'LTC',  label: 'Litecoin',  ticker: 'LTC',  icon: 'Ł' },
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return result;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function genOrderNumber() {
  return 'NP' + Math.floor(10000 + Math.random() * 90000);
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Step 1
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [accountDone, setAccountDone] = useState(false);
  const [fullName, setFullName]   = useState('');
  const [street, setStreet]       = useState('');
  const [apt, setApt]             = useState('');
  const [city, setCity]           = useState('');
  const [stateVal, setStateVal]   = useState('');
  const [zip, setZip]             = useState('');
  const [phone, setPhone]         = useState('');
  const [smsConsent, setSmsConsent]   = useState(true);
  const [billingSame, setBillingSame] = useState(true);

  // Step 2
  const [shippingId, setShippingId] = useState('standard');

  // Step 3
  const [paymentTab, setPaymentTab]       = useState<'crypto'|'card'|'express'>('crypto');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [placeOrderError, setPlaceOrderError] = useState('');

  // Summary
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [promoCode, setPromoCode]     = useState('');

  // Confirmation
  const [orderNumber, setOrderNumber]     = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedItems, setConfirmedItems] = useState<typeof items>([]);

  const selectedShipping = SHIPPING_OPTIONS.find(s => s.id === shippingId)!;
  const shippingCost  = subtotal >= selectedShipping.freeAt ? 0 : selectedShipping.price;
  const taxes         = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const orderTotal    = parseFloat((subtotal + shippingCost + taxes).toFixed(2));

  const today = new Date();
  const deliveryDates = useMemo(() => ({
    standard:  `${fmtDate(addBusinessDays(today, 4))} – ${fmtDate(addBusinessDays(today, 6))}`,
    twoday:    fmtDate(addBusinessDays(today, 2)),
    overnight: fmtDate(addBusinessDays(today, 1)),
  }), []);

  const completeStep = (n: number) => {
    setCompletedSteps(prev => Array.from(new Set([...prev, n])));
    setStep(n + 1);
  };

  const handlePlaceOrder = async () => {
    if (paymentTab !== 'crypto') {
      setPlaceOrderError('Please select a payment method to continue.');
      return;
    }
    if (!selectedCrypto) {
      setPlaceOrderError('Please select a cryptocurrency to continue.');
      return;
    }
    setPlaceOrderError('');

    const num = genOrderNumber();
    setOrderNumber(num);
    setConfirmedItems([...items]);

    const itemsStr = items
      .map(i => `${i.product.name} ${i.selectedDose} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
      .join('\n');

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('nocta-orders') || '[]');
      existing.push({
        orderNumber: num,
        date: new Date().toISOString(),
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: { street, city, state: stateVal, zip },
        items: items.map(i => ({
          name: i.product.name, dosage: i.selectedDose,
          qty: i.quantity, price: (i.price * i.quantity).toFixed(2),
        })),
        shippingMethod: selectedShipping.label,
        shippingCost: shippingCost.toFixed(2),
        subtotal: subtotal.toFixed(2),
        taxes: taxes.toFixed(2),
        total: orderTotal.toFixed(2),
        paymentMethod: selectedCrypto,
        status: 'pending_payment',
      });
      localStorage.setItem('nocta-orders', JSON.stringify(existing));
    } catch { /* ignore */ }

    // Formspree — both simultaneously, never block confirmation
    Promise.all([
      fetch('https://formspree.io/f/mzdkdzbw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          subject: `New Order ${num} — $${orderTotal}`,
          order_number: num,
          date: new Date().toLocaleDateString(),
          customer_name: fullName,
          customer_email: email,
          customer_phone: phone,
          shipping_address: `${street}, ${city}, ${stateVal} ${zip}`,
          items: itemsStr,
          shipping_method: selectedShipping.label,
          shipping_cost: `$${shippingCost.toFixed(2)}`,
          subtotal: `$${subtotal.toFixed(2)}`,
          taxes: `$${taxes.toFixed(2)}`,
          order_total: `$${orderTotal}`,
          payment_method: selectedCrypto,
          action_required: `ACTION REQUIRED: Send ${selectedCrypto} wallet address to ${email}`,
        }),
      }),
      fetch('https://formspree.io/f/mzdkdzbw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          subject: `Your Nocta Peptides Order ${num} is Confirmed`,
          _replyto: email,
          name: fullName,
          email: email,
          message: `Hi ${fullName},\n\nThank you for your order with Nocta Peptides!\n\nOrder Number: ${num}\nDate: ${new Date().toLocaleDateString()}\n\nITEMS ORDERED:\n${itemsStr}\n\nSubtotal: $${subtotal.toFixed(2)}\nShipping (${selectedShipping.label}): $${shippingCost.toFixed(2)}\nTax: $${taxes.toFixed(2)}\nTotal: $${orderTotal}\n\nPayment Method: ${selectedCrypto}\n\nNEXT STEPS:\nOur team will email you your ${selectedCrypto} wallet address and the exact payment amount within 1 hour. Please do not send any payment until you receive that email from our team.\n\nShipping Address:\n${street}, ${city}, ${stateVal} ${zip}\n\nExpected dispatch: 1-2 business days after payment confirmed.\n\nQuestions? Reply to this email or contact orders@noctapeptides.com\n\nThank you for choosing Nocta Peptides.\n\nThe Nocta Peptides Team\nnoctapeptides.com`,
        }),
      }),
    ]).catch(err => console.error('Formspree error:', err));

    clearCart();
    setOrderConfirmed(true);
  };

  // ── Order Confirmation ──────────────────────────────────────────────────────
  if (orderConfirmed) {
    const firstName = fullName.split(' ')[0];
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={36} className="text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0D1F35] text-center mb-1">Order Confirmed</h1>
          <p className="text-gray-400 text-sm text-center mb-1">
            Order number: <span className="font-bold text-[#0D1F35]">{orderNumber}</span>
          </p>
          <p className="text-gray-500 text-sm text-center mb-6">
            Thank you {firstName}. Your order has been placed successfully.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-5 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={18} className="text-yellow-600" />
              <p className="font-bold text-[#0D1F35] text-sm">Payment Instructions Coming</p>
            </div>
            <p className="text-sm text-gray-600">
              We will email your <strong>{selectedCrypto}</strong> wallet address and exact payment amount to{' '}
              <strong>{email}</strong> within 1 hour.
            </p>
            <p className="text-sm text-gray-600">Your order will be processed and shipped once payment is confirmed.</p>
            <p className="text-sm text-gray-600">Expected dispatch: <strong>1-2 business days after payment confirmed.</strong></p>
            <p className="text-sm text-gray-500">Please check your spam folder if you do not receive our email within 1 hour.</p>
            <p className="text-sm font-bold text-red-600">Do not send payment to any address not confirmed in our email.</p>
          </div>

          <div className="border border-gray-100 rounded-xl p-4 mb-5 space-y-2">
            {confirmedItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <img src={item.product.imageCompressed} alt={item.product.name} className="w-10 h-10 object-contain bg-gray-50 rounded" />
                <div className="flex-1">
                  <p className="font-medium text-[#0D1F35]">{item.product.name} <span className="text-gray-400">{item.selectedDose}</span></p>
                  <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-[#0D1F35]">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping ({selectedShipping.label})</span>
                <span>{shippingCost === 0 ? <span className="text-green-600 font-bold">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-500"><span>Tax</span><span>${taxes.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-[#0D1F35] text-base pt-1"><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-400 text-xs pt-1"><span>Payment method</span><span>{selectedCrypto}</span></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop" className="flex-1">
              <button className="w-full btn-navy py-3 rounded-xl font-bold text-sm">Continue Shopping</button>
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

  // ── Empty cart ──────────────────────────────────────────────────────────────
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

  // ── Checkout Layout ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/shop" className="flex items-center gap-1.5 text-gray-500 hover:text-[#0D1F35] transition-colors text-sm">
            <ArrowLeft size={16} /> Back
          </Link>
          <span className="font-extrabold text-[#0D1F35] tracking-tight text-lg">NOCTA PEPTIDES</span>
          <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
            <Lock size={13} /> Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Left — Steps */}
        <div className="space-y-4">
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-6">
            {[1,2,3].map(n => (
              <div key={n} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  completedSteps.includes(n) ? 'bg-green-500 text-white'
                  : step === n ? 'bg-[#0D1F35] text-white'
                  : 'bg-gray-200 text-gray-400'
                }`}>
                  {completedSteps.includes(n) ? <CheckCircle2 size={14}/> : n}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === n ? 'text-[#0D1F35]' : 'text-gray-400'}`}>
                  {n===1?'Shipping':n===2?'Delivery':'Payment'}
                </span>
                {n < 3 && <div className="w-8 h-px bg-gray-200 mx-1"/>}
              </div>
            ))}
          </div>

          {/* ── STEP 1 ── */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${completedSteps.includes(1)?'bg-green-500 text-white':'bg-[#0D1F35] text-white'}`}>
                  {completedSteps.includes(1)?<CheckCircle2 size={13}/>:'1'}
                </div>
                <span className="font-bold text-[#0D1F35]">Shipping Address</span>
              </div>
              {completedSteps.includes(1) && step !== 1 && (
                <button onClick={() => setStep(1)} className="text-xs text-[#0D1F35] underline font-medium">Edit</button>
              )}
            </div>

            {step === 1 && (
              <div className="px-6 py-5 space-y-5">
                {!accountDone && (
                  <div className="border border-gray-100 rounded-xl p-5 space-y-4">
                    <div className="flex flex-col items-center text-center gap-1 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-1">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                      </div>
                      <p className="font-bold text-[#0D1F35] text-base">Quick sign up to checkout</p>
                      <p className="text-gray-400 text-sm">Just an email and password — takes 2 seconds</p>
                    </div>
                    <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D1F35]"/>
                    <input type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D1F35]"/>
                    <button onClick={() => { if (email) setAccountDone(true); }}
                      className="w-full btn-navy py-3 rounded-xl font-bold text-sm">
                      Continue to Checkout
                    </button>
                    <p className="text-center text-xs text-gray-400">Already have an account? <span className="text-[#0D1F35] underline cursor-pointer">Sign in</span></p>
                  </div>
                )}

                {accountDone && (
                  <div className="space-y-4">
                    <p className="font-semibold text-[#0D1F35] text-sm">Your Information</p>
                    <input type="text" placeholder="Full name *" value={fullName} onChange={e => setFullName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D1F35]"/>
                    <div>
                      <input type="email" value={email} readOnly
                        className="w-full border border-gray-100 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-500"/>
                      <p className="text-xs text-gray-400 italic mt-1">We will send your order confirmation, tracking number, and shipping updates here.</p>
                    </div>

                    <p className="font-semibold text-[#0D1F35] text-sm pt-2">Delivery Address</p>
                    <div className="relative">
                      <input type="text" placeholder="Street address *" value={street} onChange={e => setStreet(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#0D1F35]"/>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📍</span>
                    </div>
                    <input type="text" placeholder="Apartment, suite, etc. (optional)" value={apt} onChange={e => setApt(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D1F35]"/>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="City *" value={city} onChange={e => setCity(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D1F35]"/>
                      <select value={stateVal} onChange={e => setStateVal(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D1F35] bg-white text-gray-700">
                        <option value="">State *</option>
                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="ZIP code *" value={zip} onChange={e => setZip(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D1F35]"/>
                      <input type="tel" placeholder="Phone for delivery *" value={phone} onChange={e => setPhone(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D1F35]"/>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer" onClick={() => setSmsConsent(!smsConsent)}>
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${smsConsent?'bg-green-500 border-green-500':'border-gray-300'}`}>
                        {smsConsent && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">I would like to receive order and shipping text updates</p>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">By providing your phone number you agree to receive informational text messages from Nocta Peptides. Consent is not a condition of purchase. Message frequency will vary. Msg and data rates may apply. Reply HELP for help or STOP to cancel.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer" onClick={() => setBillingSame(!billingSame)}>
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${billingSame?'bg-blue-500 border-blue-500':'border-gray-300'}`}>
                        {billingSame && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className="text-sm text-gray-700">Billing address same as shipping address</span>
                    </label>

                    <button
                      onClick={() => { if (fullName && street && city && stateVal && zip && phone) completeStep(1); }}
                      className="w-full btn-navy py-3 rounded-xl font-bold text-sm mt-2">
                      Continue to Delivery
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── STEP 2 ── */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${completedSteps.includes(2)?'bg-green-500 text-white':step===2?'bg-[#0D1F35] text-white':'bg-gray-200 text-gray-400'}`}>
                  {completedSteps.includes(2)?<CheckCircle2 size={13}/>:'2'}
                </div>
                <span className={`font-bold ${step>=2?'text-[#0D1F35]':'text-gray-400'}`}>Delivery Method</span>
              </div>
              {completedSteps.includes(2) && step !== 2 && (
                <button onClick={() => setStep(2)} className="text-xs text-[#0D1F35] underline font-medium">Edit</button>
              )}
            </div>

            {step === 2 && (
              <div className="px-6 py-5 space-y-3">
                <p className="text-sm text-gray-500 mb-4">How would you like your order delivered?</p>
                {SHIPPING_OPTIONS.map(opt => {
                  const isFree = subtotal >= opt.freeAt;
                  const estDate = opt.id==='standard' ? deliveryDates.standard : opt.id==='twoday' ? deliveryDates.twoday : deliveryDates.overnight;
                  return (
                    <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingId===opt.id?'border-[#0D1F35] bg-[#0D1F35]/5':'border-gray-100 hover:border-gray-300'}`}>
                      <input type="radio" name="shipping" value={opt.id} checked={shippingId===opt.id} onChange={() => setShippingId(opt.id)} className="sr-only"/>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${shippingId===opt.id?'border-[#0D1F35]':'border-gray-300'}`}>
                        {shippingId===opt.id && <div className="w-2 h-2 rounded-full bg-[#0D1F35]"/>}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#0D1F35] text-sm">{opt.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Est. {estDate}</p>
                      </div>
                      <span className={`text-sm font-bold ${isFree?'text-green-600':'text-[#0D1F35]'}`}>
                        {isFree ? 'FREE' : `$${opt.price.toFixed(2)}`}
                      </span>
                    </label>
                  );
                })}

                <button onClick={() => completeStep(2)} className="w-full btn-navy py-3 rounded-xl font-bold text-sm mt-2">
                  Continue to Payment
                </button>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 mt-3">
                  <ShieldCheck size={18} className="text-green-600 flex-shrink-0 mt-0.5"/>
                  <div>
                    <p className="font-bold text-green-800 text-sm">Free Shipment Protection</p>
                    <p className="text-green-700 text-xs mt-0.5 leading-relaxed">Every order is protected at no extra cost. If your package is damaged, lost, or stolen we will replace it or issue a full refund.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── STEP 3 ── */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step===3?'bg-[#0D1F35] text-white':'bg-gray-200 text-gray-400'}`}>3</div>
                <span className={`font-bold ${step>=3?'text-[#0D1F35]':'text-gray-400'}`}>Payment</span>
              </div>
            </div>

            {step === 3 && (
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center gap-2 text-green-600 text-xs font-semibold">
                  <Lock size={13}/> Secure checkout — 256-bit SSL
                </div>

                {/* Payment tabs */}
                <div className="flex gap-2">
                  {[
                    { id:'crypto', label:'Crypto', icon:'₿', soon:false },
                    { id:'card',   label:'Card',   icon:'💳', soon:true },
                    { id:'express',label:'Express',icon:'⚡', soon:true },
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setPaymentTab(tab.id as any)}
                      className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        paymentTab===tab.id ? 'bg-[#0D1F35] text-white border-[#0D1F35]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                      }`}>
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                      {tab.soon && <span className="absolute -top-2 -right-1 bg-gray-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">SOON</span>}
                    </button>
                  ))}
                </div>

                {/* Crypto */}
                {paymentTab === 'crypto' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      {CRYPTOS.map(c => (
                        <button key={c.id} onClick={() => setSelectedCrypto(c.id)}
                          className={`py-3 rounded-xl border-2 text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                            selectedCrypto===c.id ? 'bg-[#0D1F35] text-white border-[#0D1F35]' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                          }`}>
                          <span className="text-base">{c.icon}</span>
                          <span>{c.ticker}</span>
                        </button>
                      ))}
                    </div>
                    {selectedCrypto && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-1.5">
                        <div className="flex items-center gap-2 mb-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          <p className="text-sm font-semibold text-blue-800">Your order will be reserved for 30 minutes</p>
                        </div>
                        <p className="text-xs text-blue-700">After placing your order our team will email your wallet address and exact payment amount to <strong>{email || 'your email'}</strong> within 1 hour.</p>
                        <p className="text-xs text-blue-700">Please do not send any payment until you receive our email with wallet instructions.</p>
                        <p className="text-xs font-bold text-red-600">Do not send payment to any address not confirmed by our team via email.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Card — coming soon, NO form fields */}
                {paymentTab === 'card' && <PaymentCardForm />}

                {/* Express — coming soon */}
                {paymentTab === 'express' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center space-y-2">
                    <p className="font-semibold text-[#0D1F35] text-sm">Apple Pay and Google Pay coming soon</p>
                    <p className="text-gray-500 text-sm">Please use cryptocurrency for now.</p>
                  </div>
                )}

                {placeOrderError && <p className="text-red-500 text-xs font-medium">{placeOrderError}</p>}

                <button onClick={handlePlaceOrder} className="w-full btn-navy py-4 rounded-xl font-bold text-base mt-2">
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <button className="lg:hidden w-full flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-4 mb-2"
            onClick={() => setSummaryOpen(!summaryOpen)}>
            <span className="font-bold text-[#0D1F35] text-sm">Order Summary ({items.length} items)</span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${summaryOpen?'rotate-180':''}`}/>
          </button>

          <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden ${summaryOpen?'block':'hidden lg:block'}`}>
            <div className="px-5 py-4 space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.product.imageCompressed} alt={item.product.name} className="w-12 h-12 object-contain bg-gray-50 rounded-lg flex-shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0D1F35] truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400">{item.selectedDose} · Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#0D1F35]">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <input type="text" placeholder="Promo code" value={promoCode} onChange={e => setPromoCode(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0D1F35]"/>
                <button className="px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600 hover:border-[#0D1F35] hover:text-[#0D1F35] transition-colors">Apply</button>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>{shippingCost===0 ? <span className="text-green-600 font-bold">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-500"><span>Shipment Protection</span><span className="text-green-600 font-bold">Free</span></div>
                <div className="flex justify-between text-gray-500"><span>Tax (8.875%)</span><span>${taxes.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-[#0D1F35] text-base pt-1 border-t border-gray-100">
                  <span>Total</span><span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-green-600 text-xs font-semibold pt-1">
                <Lock size={12}/> Secure checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
