// NOCTA PEPTIDES — Checkout Page
// 3-step: 1 Shipping Address, 2 Delivery Method, 3 Payment (Crypto default)
// NO card form fields anywhere. PaymentCardForm.tsx handles coming-soon message.
// Order confirmation screen replaces page after Place Order.
// Formspree notifications + localStorage order storage.

import { useState, useMemo } from 'react';

import { Link } from 'wouter';
import { ArrowLeft, Lock, CheckCircle2, ChevronDown, ShieldCheck, Mail } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ExpressCheckout from '@/components/ExpressCheckout';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

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

function CheckoutCardForm({
  orderTotal,
  orderNumber,
  customerEmail,
  customerName,
  shippingAddress,
  items,
  researchConfirmed,
  onSuccess,
}: {
  orderTotal: number
  orderNumber: string
  customerEmail: string
  customerName: string
  shippingAddress: string
  items: Array<{ name: string; dosage: string; qty: number; price: string }>
  researchConfirmed: boolean
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [nameOnCard, setNameOnCard] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handlePay = async () => {
    if (!researchConfirmed) {
      setErrorMessage('Please confirm the research use acknowledgment before paying.')
      return
    }
    if (!stripe || !elements) return
    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return
    if (!nameOnCard.trim()) {
      setErrorMessage('Please enter the name on your card.')
      return
    }
    setIsLoading(true)
    setErrorMessage('')
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderTotal,
          orderNumber,
          customerEmail,
          customerName,
          shippingAddress,
          items,
        }),
      })
      const { clientSecret, error: serverError } = await res.json()
      if (serverError || !clientSecret) {
        setErrorMessage(serverError || 'Payment setup failed. Please try again.')
        setIsLoading(false)
        return
      }
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: nameOnCard, email: customerEmail },
        },
      })
      if (result.error) {
        setErrorMessage(result.error.message || 'Payment failed. Please check your card details.')
        setIsLoading(false)
      } else if (result.paymentIntent.status === 'succeeded') {
        await fetch('https://formspree.io/f/mzdkdzbw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            subject: `Card Payment Confirmed — Order ${orderNumber} — $${orderTotal.toFixed(2)}`,
            _replyto: customerEmail,
            name: customerName,
            email: customerEmail,
            message: `Card payment confirmed via Stripe. SHIP THIS ORDER NOW.\n\nOrder: ${orderNumber}\nAmount: $${orderTotal.toFixed(2)}\nCustomer: ${customerName} (${customerEmail})\nShipping: ${shippingAddress}\n\nItems:\n${items.map(i => `${i.name} ${i.dosage} x${i.qty} — $${i.price}`).join('\n')}`,
          }),
        })
        onSuccess()
      }
    } catch {
      setErrorMessage('Payment failed. Please try again or contact orders@noctapeptides.com')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
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
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A4A] disabled:opacity-50"
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
                invalid: { color: '#ef4444' },
              },
              hidePostalCode: false,
            }}
          />
        </div>
      </div>
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}
      <button
        onClick={handlePay}
        disabled={isLoading || !stripe}
        className="w-full bg-[#1A3A4A] text-white py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#0D2535] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : `Pay Now — $${orderTotal.toFixed(2)}`}
      </button>
      <p className="text-center text-xs text-gray-400">
        🔒 Secured by Stripe. Your card details are never stored on our servers.
      </p>
    </div>
  )
}

export default function Checkout() {
  const { items, subtotal, clearCart, appliedPromo, promoError, applyPromo, removePromo, discountAmount, discountedSubtotal } = useCart();

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
  const [paymentTab, setPaymentTab]       = useState<'crypto'|'card'>('crypto');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [researchConfirmed, setResearchConfirmed] = useState(false);
  const [placeOrderError, setPlaceOrderError] = useState('');
  const [isLoading, setIsLoading]           = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Summary
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [promoInput, setPromoInput]   = useState(() => {
    try { const p = localStorage.getItem('nocta-promo'); return p ? JSON.parse(p)?.code || '' : ''; } catch { return ''; }
  });

  // Confirmation
  const [orderNumber, setOrderNumber]     = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedItems, setConfirmedItems] = useState<typeof items>([]);

  const selectedShipping = SHIPPING_OPTIONS.find(s => s.id === shippingId)!;
  const shippingCost  = discountedSubtotal >= selectedShipping.freeAt ? 0 : selectedShipping.price;
  const taxes         = parseFloat((discountedSubtotal * TAX_RATE).toFixed(2));
  const orderTotal    = parseFloat((discountedSubtotal + shippingCost + taxes).toFixed(2));

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

  const sendFormspreeNotification = async (num: string, itemsStr: string) => {
    const shippingAddress = `${street}${apt ? ', ' + apt : ''}, ${city}, ${stateVal} ${zip}`;
    const cartItemsFormatted = items.map(i =>
      `${i.product.name} ${i.selectedDose} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`
    ).join('\n');

    return Promise.all([
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
          shipping_address: shippingAddress,
          items: itemsStr,
          shipping_method: selectedShipping.label,
          shipping_cost: `$${shippingCost.toFixed(2)}`,
          subtotal: `$${subtotal.toFixed(2)}`,
          taxes: `$${taxes.toFixed(2)}`,
          order_total: `$${orderTotal}`,
          payment_method: selectedCrypto,
          action_required: 'Customer has been redirected to NOWPayments to complete crypto payment. You will receive a separate confirmation email when payment is confirmed on the blockchain. No manual wallet address needed.',
        }),
      }),
      fetch('https://formspree.io/f/mzdkdzbw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          subject: `Your Nocta Peptides Order ${num} — Payment Pending`,
          _replyto: email,
          name: fullName,
          email: email,
          message: `Hi ${fullName},\n\nThank you for your order with Nocta Peptides!\n\nOrder Number: ${num}\nDate: ${new Date().toLocaleDateString()}\n\nITEMS:\n${cartItemsFormatted}\n\nSubtotal: $${discountedSubtotal.toFixed(2)}\nShipping: $${shippingCost.toFixed(2)}\nTax: $${taxes.toFixed(2)}\nTotal: $${orderTotal}\n\nPayment Method: ${selectedCrypto}\n\nNEXT STEPS:\nYou have been redirected to complete your crypto payment. Once your payment is confirmed on the blockchain we will process and ship your order within 1-2 business days.\n\nShipping Address:\n${shippingAddress}\n\nQuestions? Email orders@noctapeptides.com\n\nThank you,\nNocta Peptides\nnoctapeptides.com`,
        }),
      }),
    ]).catch(err => console.error('Formspree error:', err));
  };

  const handlePlaceOrder = async () => {
    if (!researchConfirmed) {
      setPlaceOrderError('Please confirm the research use acknowledgment to proceed.');
      return;
    }
    if (paymentTab === 'card') {
      setPlaceOrderError('Please complete your card payment using the form above.');
      return;
    }
    if (!selectedCrypto) {
      setPlaceOrderError('Please select a cryptocurrency to continue.');
      return;
    }
    setPlaceOrderError('');
    setIsLoading(true);
    setLoadingMessage('Creating your secure payment page...');

    const num = genOrderNumber();

    const itemsStr = items
      .map(i => `${i.product.name} ${i.selectedDose} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
      .join('\n');

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

    try {
      await sendFormspreeNotification(num, itemsStr);

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderTotal,
          orderNumber: num,
          selectedCrypto,
          customerName: fullName,
          customerEmail: email,
          shippingAddress: `${street}${apt ? ', ' + apt : ''}, ${city}, ${stateVal} ${zip}`,
          items: items.map(i => ({
            name: i.product.name,
            dosage: i.selectedDose,
            qty: i.quantity,
            price: (i.price * i.quantity).toFixed(2),
          })),
        }),
      });

      const data = await response.json() as { invoiceUrl?: string; error?: string };

      if (!data.invoiceUrl) {
        throw new Error(data.error || 'No invoice URL returned');
      }

      clearCart();
      window.location.href = data.invoiceUrl;
    } catch (err) {
      console.error('Payment error:', err);
      setIsLoading(false);
      setPlaceOrderError('Payment setup failed. Please try again or contact orders@noctapeptides.com');
    }
  };

  // ── Order Confirmation ──────────────────────────────────────────────────────
  if (orderConfirmed) {
    const firstName = fullName.split(' ')[0];
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={36} className="text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-[#1A3A4A] mb-2">Order Confirmed!</h1>
          <p className="text-center text-gray-600 mb-6">Thank you for your order, {firstName}.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-600">Order Number:</span><span className="font-bold text-[#1A3A4A]">{orderNumber}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Items:</span><span className="font-bold text-[#1A3A4A]">{confirmedItems.length}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Total:</span><span className="font-bold text-[#1A3A4A]">${orderTotal.toFixed(2)}</span></div>
          </div>
          <Link href="/">
            <button className="w-full btn-navy py-3 rounded-lg font-bold text-sm">Continue Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Empty Cart ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1A3A4A] mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some research compounds to get started.</p>
          <Link href="/shop">
            <button className="btn-navy px-6 py-3 rounded-lg font-bold">Browse Products</button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Main Checkout ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1A3A4A]">Checkout</h1>
          <Link href="/shop">
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#1A3A4A] transition-colors">
              <ArrowLeft size={16} /> Back to Shop
            </button>
          </Link>
        </div>

        {/* Order Summary Drawer */}
        <div className="mb-6">
          <button
            onClick={() => setSummaryOpen(!summaryOpen)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1A3A4A]">Order Summary</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{items.length} items</span>
            </div>
            <ChevronDown size={18} className={`text-gray-400 transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
          </button>

          {summaryOpen && (
            <div className="mt-2 bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              {items.map(item => (
                <div key={`${item.product.id}-${item.selectedDose}`} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.product.name} {item.selectedDose} x{item.quantity}</span>
                  <span className="font-bold text-[#1A3A4A]">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal:</span><span className="font-bold">${subtotal.toFixed(2)}</span></div>
                {appliedPromo && <div className="flex justify-between text-sm text-green-600"><span>Discount ({appliedPromo.code}):</span><span>-${discountAmount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping:</span><span className="font-bold">${shippingCost.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Tax:</span><span className="font-bold">${taxes.toFixed(2)}</span></div>
                <div className="flex justify-between text-base font-bold text-[#1A3A4A] pt-2 border-t"><span>Total:</span><span>${orderTotal.toFixed(2)}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {/* ── STEP 1 ── */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step===1?'bg-[#0D1F35] text-white':'bg-gray-200 text-gray-400'}`}>1</div>
                <span className={`font-bold ${step>=1?'text-[#1A3A4A]':'text-gray-400'}`}>Shipping Address</span>
              </div>
              {completedSteps.includes(1) && <CheckCircle2 size={20} className="text-green-500" />}
            </div>

            {step === 1 && (
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A4A]" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Full Name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A4A]" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Street Address</label>
                  <input type="text" value={street} onChange={e => setStreet(e.target.value)} placeholder="123 Main St" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A4A]" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Apt / Suite (Optional)</label>
                  <input type="text" value={apt} onChange={e => setApt(e.target.value)} placeholder="Apt 4B" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A4A]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">City</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="New York" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A4A]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">State</label>
                    <select value={stateVal} onChange={e => setStateVal(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A4A]">
                      <option value="">Select State</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">ZIP Code</label>
                  <input type="text" value={zip} onChange={e => setZip(e.target.value)} placeholder="10001" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A4A]" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 123-4567" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A4A]" />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={smsConsent} onChange={e => setSmsConsent(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-600">I'd like to receive SMS updates about my order</span>
                </label>

                <button onClick={() => completeStep(1)} className="w-full btn-navy py-3 rounded-xl font-bold text-sm mt-2">Continue to Shipping</button>
              </div>
            )}
          </div>

          {/* ── STEP 2 ── */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step===2?'bg-[#0D1F35] text-white':'bg-gray-200 text-gray-400'}`}>2</div>
                <span className={`font-bold ${step>=2?'text-[#1A3A4A]':'text-gray-400'}`}>Shipping Method</span>
              </div>
              {completedSteps.includes(2) && <CheckCircle2 size={20} className="text-green-500" />}
            </div>

            {step === 2 && (
              <div className="px-6 py-5 space-y-4">
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

                <button onClick={() => completeStep(2)} className="w-full btn-navy py-3 rounded-xl font-bold text-sm mt-2">Continue to Payment</button>

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
                <span className={`font-bold ${step>=3?'text-[#1A3A4A]':'text-gray-400'}`}>Payment</span>
              </div>
            </div>

            {step === 3 && (
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center gap-2 text-green-600 text-xs font-semibold">
                  <Lock size={13}/> Secure checkout — 256-bit SSL
                </div>

                {/* Express checkout — Apple Pay / Google Pay — shows automatically if browser supports it */}
                <ExpressCheckout
                  orderTotal={orderTotal}
                  orderNumber={genOrderNumber()}
                  customerEmail={email}
                  customerName={fullName}
                  shippingAddress={`${street}${apt ? ', ' + apt : ''}, ${city}, ${stateVal} ${zip}`}
                  items={items.map(i => ({
                    name: i.product.name,
                    dosage: i.selectedDose,
                    qty: i.quantity,
                    price: (i.price * i.quantity).toFixed(2)
                  }))}
                  showDivider={true}
                  onSuccess={(_payerEmail, _payerName) => {
                    clearCart()
                    window.location.href = `/order-confirmed?order=${genOrderNumber()}`
                  }}
                  onError={(msg) => setPlaceOrderError(msg)}
                />

                {/* Research confirmation checkbox */}
                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={researchConfirmed}
                    onChange={e => setResearchConfirmed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 flex-shrink-0 rounded border-gray-300 accent-[#0D1F35]"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    I confirm I am purchasing for legitimate research purposes only and am legally permitted to do so in my jurisdiction. I am 18 or older. I understand these products are not for human consumption.
                  </span>
                </label>

                {/* Payment tabs — Crypto and Card only */}
                <div className="flex gap-2">
                  {[
                    { id: 'crypto', label: 'Crypto', icon: '₿' },
                    { id: 'card', label: 'Card', icon: '💳' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setPaymentTab(tab.id as any)}
                      className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        paymentTab === tab.id
                          ? 'bg-[#0D1F35] text-white border-[#0D1F35]'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Crypto tab */}
                {paymentTab === 'crypto' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      {CRYPTOS.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCrypto(c.id)}
                          className={`py-3 rounded-xl border-2 text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                            selectedCrypto === c.id
                              ? 'bg-[#0D1F35] text-white border-[#0D1F35]'
                              : 'border-gray-200 text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <span className="text-base">{c.icon}</span>
                          <span>{c.ticker}</span>
                        </button>
                      ))}
                    </div>
                    {selectedCrypto && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-blue-800 mb-1">Secure crypto payment</p>
                        <p className="text-xs text-blue-700">You will be redirected to our secure payment page to complete your crypto payment instantly.</p>
                      </div>
                    )}
                    {placeOrderError && <p className="text-red-500 text-xs font-medium">{placeOrderError}</p>}
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                      className="w-full btn-navy py-4 rounded-xl font-bold text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                          </svg>
                          {loadingMessage}
                        </>
                      ) : 'Place Order'}
                    </button>
                  </div>
                )}

                {/* Card tab — inline Stripe card form wrapped in its own Elements provider */}
                {paymentTab === 'card' && (
                  <Elements stripe={stripePromise}>
                    <CheckoutCardForm
                      orderTotal={orderTotal}
                      orderNumber={genOrderNumber()}
                      customerEmail={email}
                      customerName={fullName}
                      shippingAddress={`${street}${apt ? ', ' + apt : ''}, ${city}, ${stateVal} ${zip}`}
                      items={items.map(i => ({
                        name: i.product.name,
                        dosage: i.selectedDose,
                        qty: i.quantity,
                        price: (i.price * i.quantity).toFixed(2)
                      }))}
                      researchConfirmed={researchConfirmed}
                      onSuccess={() => {
                        clearCart()
                        window.location.href = `/order-confirmed?order=${genOrderNumber()}`
                      }}
                    />
                  </Elements>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
