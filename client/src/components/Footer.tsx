// NOCTA PEPTIDES — Footer
// Deep dark background, blue accent links, same structure

import { Link } from 'wouter';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="mt-20"
      style={{
        background: '#030609',
        borderTop: '1px solid rgba(0, 184, 255, 0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480772975/WZ9nhXadZMbmVF5iFKUgx9/nocta-logo-dark-E8B8T43eri4iUVUhTCQsdy.webp"
                alt="Nocta Peptides"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(223, 240, 255, 0.4)' }}>
              Premium research-grade peptides. Third-party tested to 99%+ purity. Trusted by researchers worldwide.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: 'rgba(223, 240, 255, 0.4)' }}>
              <Mail size={14} style={{ color: 'rgba(0, 184, 255, 0.6)' }} />
              <a
                href="mailto:support@noctapeptides.com"
                className="hover:text-white transition-colors duration-200"
                style={{ color: 'inherit' }}
              >
                support@noctapeptides.com
              </a>
            </div>
            <div className="flex gap-3 mt-3">
              <a
                href="https://instagram.com/noctapeptides"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
                style={{ color: 'rgba(223,240,255,0.4)' }}
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/noctapeptides"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
                style={{ color: 'rgba(223,240,255,0.4)' }}
                aria-label="X / Twitter"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
            <div className="mt-5">
              <p style={{ color: 'rgba(223,240,255,0.35)', fontSize: '11px', fontFamily: "'Space Grotesk',sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontWeight: 600 }}>Stay Updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 text-xs rounded-md"
                  style={{ background: 'rgba(12,18,40,0.8)', border: '1px solid rgba(0,184,255,0.12)', color: '#dff0ff', fontFamily: "'Inter',sans-serif", outline: 'none', minWidth: 0 }}
                />
                <button className="btn-navy px-3 py-2 text-xs rounded-md whitespace-nowrap">Subscribe</button>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(0, 184, 255, 0.5)', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Shop
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/shop', label: 'All Products' },
                { href: '/shop?category=weight-loss', label: 'Weight Loss' },
                { href: '/shop?category=recovery', label: 'Recovery' },
                { href: '/shop?category=anti-aging', label: 'Anti-Aging' },
                { href: '/shop?category=cognitive', label: 'Cognitive' },
                { href: '/shop?category=blends', label: 'Blends & Stacks' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(223, 240, 255, 0.4)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(0, 184, 255, 0.5)', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/research', label: 'Research Library' },
                { href: '/coa', label: 'Certificates of Analysis' },
                { href: '/partner', label: 'Partners' },
                { href: '/contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(223, 240, 255, 0.4)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(0, 184, 255, 0.5)', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Legal
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/disclaimer', label: 'Research Disclaimer' },
                { href: '/shipping', label: 'Shipping Policy' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(223, 240, 255, 0.4)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(0, 184, 255, 0.07)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(223, 240, 255, 0.22)' }}>
            © 2026 Nocta Peptides. All rights reserved.
          </p>
          <p className="text-xs text-center sm:text-right max-w-md" style={{ color: 'rgba(223, 240, 255, 0.22)' }}>
            All products are for research purposes only. Not for human consumption.
            By using this site you agree to our{' '}
            <Link href="/terms" className="underline hover:text-white/60 transition-colors">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/disclaimer" className="underline hover:text-white/60 transition-colors">Research Disclaimer</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
