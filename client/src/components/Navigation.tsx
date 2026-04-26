// NOCTA PEPTIDES — Navigation
// Frosted glass dark nav, electric blue cart badge, scroll-aware opacity

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/research', label: 'Research Library' },
  { href: '/coa', label: 'COA' },
  { href: '/about', label: 'About' },
  { href: '/partner', label: 'Partners' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-40 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(5, 8, 15, 0.92)'
          : 'rgba(5, 8, 15, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 184, 255, 0.08)',
        boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.5)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start group">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480772975/WZ9nhXadZMbmVF5iFKUgx9/nocta-logo-dark-E8B8T43eri4iUVUhTCQsdy.webp"
              alt="Nocta Peptides"
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-all duration-200 relative group"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: location === link.href ? '#00b8ff' : 'rgba(223, 240, 255, 0.55)',
                }}
              >
                <span
                  className="group-hover:text-white transition-colors duration-200"
                  style={{ color: 'inherit' }}
                >
                  {link.label}
                </span>
                {/* Active/hover underline */}
                <span
                  className="absolute -bottom-0.5 left-0 h-px transition-all duration-300"
                  style={{
                    background: '#00b8ff',
                    width: location === link.href ? '100%' : '0%',
                    boxShadow: location === link.href ? '0 0 6px rgba(0, 184, 255, 0.6)' : 'none',
                  }}
                />
              </Link>
            ))}
          </div>

          {/* Right: Search + Cart + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation('/shop')}
              className="hidden md:flex p-2 transition-colors duration-200 group"
              style={{ color: 'rgba(223, 240, 255, 0.6)' }}
              aria-label="Search products"
            >
              <Search
                size={20}
                className="group-hover:text-white transition-colors duration-200"
                style={{ color: 'inherit' }}
              />
            </button>
            <button
              onClick={openCart}
              className="relative p-2 transition-colors duration-200 group"
              style={{ color: 'rgba(223, 240, 255, 0.6)' }}
              aria-label="Open cart"
            >
              <ShoppingCart
                size={20}
                className="group-hover:text-white transition-colors duration-200"
                style={{ color: 'inherit' }}
              />
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] min-h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{
                    background: '#00b8ff',
                    color: '#05080f',
                    fontFamily: "'Space Grotesk', sans-serif",
                    boxShadow: '0 0 10px rgba(0, 184, 255, 0.5)',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 transition-colors duration-200"
              style={{ color: 'rgba(223, 240, 255, 0.6)' }}
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
        <div
          className="md:hidden px-4 py-4 space-y-1"
          style={{
            background: 'rgba(5, 8, 15, 0.98)',
            borderTop: '1px solid rgba(0, 184, 255, 0.08)',
          }}
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: location === link.href ? '#00b8ff' : 'rgba(223, 240, 255, 0.55)',
                background: location === link.href ? 'rgba(0, 184, 255, 0.08)' : 'transparent',
                border: location === link.href ? '1px solid rgba(0, 184, 255, 0.15)' : '1px solid transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
