// NOCTA PEPTIDES — Navigation
// Sticky top nav: NP logo left, links center, cart right
// White background, dark navy text, subtle bottom border

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/research', label: 'Research Library' },
  { href: '/coa', label: 'COA' },
  { href: '/partner', label: 'Partner Program' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [location] = useLocation();
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-sm bg-[#1A3A4A] flex items-center justify-center">
              <span className="text-white font-bold text-sm tracking-tight">NP</span>
            </div>
            <span className="font-bold text-[#1A3A4A] text-base tracking-tight hidden sm:block">
              NOCTA PEPTIDES
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  location === link.href
                    ? 'text-[#1A3A4A]'
                    : 'text-gray-500 hover:text-[#1A3A4A]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Cart + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative p-2 text-gray-600 hover:text-[#1A3A4A] transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#1A3A4A] text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 text-gray-600 hover:text-[#1A3A4A]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location === link.href
                    ? 'bg-gray-50 text-[#1A3A4A]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#1A3A4A]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
