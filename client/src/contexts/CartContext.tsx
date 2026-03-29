import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '@/lib/products';

export interface CartItem {
  product: Product;
  selectedDose: string;
  price: number;
  quantity: number;
}

export interface PromoCode {
  code: string;
  discount: number; // percentage e.g. 15 = 15%
}

const VALID_CODES: Record<string, number> = {
  NOCTA15: 15,
  WELCOME10: 10,
  NOCTA20: 20,
  RIGCHOK: 15,
};

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, dose: string, price: number) => void;
  removeItem: (productId: string, dose: string) => void;
  updateQuantity: (productId: string, dose: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  // Promo code
  appliedPromo: PromoCode | null;
  promoError: string;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  discountAmount: number;
  discountedSubtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nocta-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(() => {
    try {
      const saved = localStorage.getItem('nocta-promo');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    localStorage.setItem('nocta-cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem('nocta-promo', JSON.stringify(appliedPromo));
    } else {
      localStorage.removeItem('nocta-promo');
    }
  }, [appliedPromo]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (product: Product, dose: string, price: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.selectedDose === dose);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.selectedDose === dose
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, selectedDose: dose, price, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, dose: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.selectedDose === dose)));
  };

  const updateQuantity = (productId: string, dose: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId, dose);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.product.id === productId && i.selectedDose === dose ? { ...i, quantity: qty } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
    setPromoError('');
  };

  const applyPromo = (code: string): boolean => {
    const upper = code.trim().toUpperCase();
    if (VALID_CODES[upper] !== undefined) {
      setAppliedPromo({ code: upper, discount: VALID_CODES[upper] });
      setPromoError('');
      return true;
    } else {
      setPromoError('Invalid promo code');
      return false;
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = appliedPromo ? parseFloat(((subtotal * appliedPromo.discount) / 100).toFixed(2)) : 0;
  const discountedSubtotal = parseFloat((subtotal - discountAmount).toFixed(2));

  return (
    <CartContext.Provider value={{
      items, isOpen, openCart, closeCart,
      addItem, removeItem, updateQuantity, clearCart,
      totalItems, subtotal,
      appliedPromo, promoError, applyPromo, removePromo,
      discountAmount, discountedSubtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
