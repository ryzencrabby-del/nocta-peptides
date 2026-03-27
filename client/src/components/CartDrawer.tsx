// NOCTA PEPTIDES — Cart Drawer
// Slides from right, shows items with qty controls, subtotal, checkout CTA

import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'wouter';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#1A3A4A]" />
            <h2 className="font-semibold text-[#1A3A4A] text-base">
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
              <button
                onClick={closeCart}
                className="mt-2 btn-navy px-5 py-2 rounded-md text-sm"
              >
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
                    className="w-16 h-16 object-contain rounded-md bg-gray-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A3A4A] text-sm truncate">{item.product.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{item.selectedDose}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedDose, item.quantity - 1)}
                          className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#1A3A4A] hover:text-[#1A3A4A] transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedDose, item.quantity + 1)}
                          className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#1A3A4A] hover:text-[#1A3A4A] transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-[#1A3A4A]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.selectedDose)}
                    className="text-gray-300 hover:text-red-400 transition-colors self-start mt-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="font-bold text-[#1A3A4A] text-lg">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping calculated at checkout. Free on orders over $150.</p>
            <Link href="/checkout" onClick={closeCart}>
              <button className="w-full btn-navy py-3 rounded-md text-sm font-semibold">
                Proceed to Checkout
              </button>
            </Link>
            <button
              onClick={closeCart}
              className="w-full py-2.5 text-sm text-gray-500 hover:text-[#1A3A4A] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
