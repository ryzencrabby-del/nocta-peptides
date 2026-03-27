// NOCTA PEPTIDES — Navigation
// Dark navy sticky top nav with white logo and links

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/research', label: 'Research Library' },
  { href: '/coa', label: 'COA' },
  { href: '/about', label: 'About' },
  { href: '/partner', label: 'Partner Program' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [location] = useLocation();
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-[#0D1F35] border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start group">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480772975/WZ9nhXadZMbmVF5iFKUgx9/nocta-logo-dark-E8B8T43eri4iUVUhTCQsdy.webp"
              alt="Nocta Peptides"
              className="h-9 w-auto object-contain"
            />
            <span className="text-[10px] text-white/35 tracking-wide leading-none mt-0.5 hidden sm:block">Formerly known as HomoPeptide</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  location === link.href
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
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
              className="relative p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-white text-[#0D1F35] text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 text-white/70 hover:text-white"
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
        <div className="md:hidden border-t border-white/10 bg-[#0D1F35]">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location === link.href
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
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
