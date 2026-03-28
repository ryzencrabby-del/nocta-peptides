// NOCTA PEPTIDES — Cart Drawer
// Slides from right. Items with qty dropdown, shipping progress bar,
// promo code with full validation, Google/Apple Pay button, Proceed to Checkout → fires pre-checkout legal popup.

import { useState, useEffect } from 'react';
import { X, ShieldCheck, Tag, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CheckoutLegalPopup from './CheckoutLegalPopup';

const FREE_STANDARD = 150;
const FREE_TWO_DAY = 175;

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

function getPackingRange(): string {
  const today = new Date();
  const d1 = addBusinessDays(today, 3);
  const d2 = addBusinessDays(today, 5);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(d1)} – ${fmt(d2)}`;
}

export default function CartDrawer() {
  const {
    items, isOpen, closeCart, updateQuantity, removeItem,
    subtotal, totalItems,
    appliedPromo, promoError, applyPromo, removePromo,
    discountAmount, discountedSubtotal,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [showLegalPopup, setShowLegalPopup] = useState(false);
  const [gpSupported, setGpSupported] = useState(false);

  // Pre-fill input with applied code if exists
  useEffect(() => {
    if (appliedPromo) setPromoInput(appliedPromo.code);
  }, [appliedPromo]);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).PaymentRequest) {
      try {
        const req = new (window as any).PaymentRequest(
          [{ supportedMethods: 'https://google.com/pay' }, { supportedMethods: 'https://apple.com/apple-pay' }],
          { total: { label: 'Total', amount: { currency: 'USD', value: '1.00' } } }
        );
        req.canMakePayment()
          .then((result: boolean) => setGpSupported(!!result))
          .catch(() => setGpSupported(false));
      } catch {
        setGpSupported(false);
      }
    }
  }, []);

  // Use discounted subtotal for shipping thresholds
  const effectiveSubtotal = discountedSubtotal;
  const remaining150 = Math.max(0, FREE_STANDARD - effectiveSubtotal);
  const progressPct = Math.min(100, (effectiveSubtotal / FREE_TWO_DAY) * 100);

  const shippingMsg =
    effectiveSubtotal >= FREE_TWO_DAY
      ? 'You qualify for free 2-day shipping!'
      : effectiveSubtotal >= FREE_STANDARD
      ? 'You qualify for free standard shipping!'
      : null;

  const handleApplyPromo = () => {
    if (appliedPromo) return; // already applied
    applyPromo(promoInput);
  };

  const handleRemovePromo = () => {
    removePromo();
    setPromoInput('');
  };

  const handlePromoInputChange = (val: string) => {
    setPromoInput(val);
    // Clear error when user starts typing
    if (promoError) removePromo();
  };

  const handleProceedToCheckout = () => {
    setShowLegalPopup(true);
  };

  const handleLegalAgree = () => {
    setShowLegalPopup(false);
    closeCart();
    window.location.href = '/checkout';
  };

  const handleLegalCancel = () => {
    setShowLegalPopup(false);
  };

  return (
    <>
      {/* Overlay — covers everything: page, nav, banner. z-[200] > nav z-40 and banner z-30 */}
      <div
        className="fixed inset-0 transition-opacity duration-300 ease-in-out"
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 201 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#1A3A4A]" />
            <h2 className="font-bold text-[#1A3A4A] text-base">
              Cart {totalItems > 0 && <span className="text-gray-400 font-normal">({totalItems})</span>}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={40} className="text-gray-200" />
              <div>
                <p className="text-gray-500 font-medium">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-1">Add some research compounds to get started.</p>
              </div>
              <button onClick={closeCart} className="mt-2 btn-navy px-5 py-2 rounded-md text-sm">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={`${item.product.id}-${item.selectedDose}`}
                  className="flex gap-3 py-3 border-b border-gray-50"
                >
                  <img
                    src={item.product.imageCompressed}
                    alt={item.product.name}
                    className="w-14 h-14 object-contain rounded-lg bg-gray-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A3A4A] text-sm leading-tight">{item.product.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{item.selectedDose}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <select
                        value={item.quantity}
                        onChange={e => updateQuantity(item.product.id, item.selectedDose, parseInt(e.target.value))}
                        className="text-xs border border-gray-200 rounded px-2 py-1 text-[#1A3A4A] font-medium bg-white focus:outline-none focus:border-[#1A3A4A]"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <span className="text-sm font-bold text-[#1A3A4A]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.selectedDose)}
                    className="text-gray-300 hover:text-red-400 transition-colors self-start mt-0.5"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — only when items exist */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-4">
            {/* Shipment Protection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-green-500" />
                <span className="text-sm text-gray-600 font-medium">Shipment Protection</span>
              </div>
              <span className="text-sm font-bold text-green-600">Free</span>
            </div>

            {/* Free shipping progress bar */}
            <div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {shippingMsg ? (
                <p className="text-xs font-bold text-green-600 mt-1.5">{shippingMsg}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1.5">
                  <span className="text-green-600 font-bold">${remaining150.toFixed(2)} away</span> from free standard shipping
                </p>
              )}
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-400">Free standard — $150</span>
                <span className="text-[10px] text-gray-400">Free 2-day — $175</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="space-y-1.5">
              {appliedPromo ? (
                /* Applied state */
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-green-700">{appliedPromo.code}</span>
                    <span className="text-xs text-green-600">({appliedPromo.discount}% off applied)</span>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-green-400 hover:text-green-600 transition-colors ml-2"
                    aria-label="Remove promo code"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                /* Input state */
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-3 gap-2 focus-within:border-[#1A3A4A] transition-colors">
                    <Tag size={13} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoInput}
                      onChange={e => handlePromoInputChange(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                      className="flex-1 text-sm py-2 outline-none bg-transparent placeholder-gray-400 uppercase"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-lg text-gray-600 hover:border-[#1A3A4A] hover:text-[#1A3A4A] transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
              )}
              {/* Error message */}
              {promoError && !appliedPromo && (
                <p className="text-xs text-red-500 pl-1">{promoError}</p>
              )}
            </div>

            {/* Order summary */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className={`text-sm font-medium ${appliedPromo ? 'line-through text-gray-400' : 'font-bold text-[#1A3A4A]'}`}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {appliedPromo && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-medium">Discount ({appliedPromo.code})</span>
                  <span className="text-sm font-bold text-green-600">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              {appliedPromo && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-1.5">
                  <span className="text-sm font-bold text-[#1A3A4A]">New Subtotal</span>
                  <span className="text-base font-bold text-[#1A3A4A]">${discountedSubtotal.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Google Pay / Apple Pay */}
            {gpSupported && (
              <>
                <button
                  onClick={() => alert('Express checkout coming soon.')}
                  className="w-full bg-black text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                  Google Pay / Apple Pay
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">OR</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              </>
            )}

            {/* Proceed to Checkout */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full btn-navy py-3.5 rounded-xl font-bold text-sm"
            >
              Proceed to Checkout
            </button>

            {/* Packing estimate */}
            <p className="text-center text-[11px] text-gray-400">
              Estimated to be packed: <span className="font-medium text-gray-500">{getPackingRange()}</span>
            </p>
          </div>
        )}
      </div>

      {/* Pre-checkout legal popup — fires every time */}
      {showLegalPopup && (
        <CheckoutLegalPopup
          onAgree={handleLegalAgree}
          onCancel={handleLegalCancel}
        />
      )}
    </>
  );
}
