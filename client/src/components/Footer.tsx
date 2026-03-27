// NOCTA PEPTIDES — Footer
// White background, 4-column grid: brand, shop, company, contact
// Dark navy links, legal disclaimer at bottom

import { Link } from 'wouter';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480772975/WZ9nhXadZMbmVF5iFKUgx9/nocta-logo-final-fyUwjEnZ5KRipST3XdZyWi.webp"
                alt="Nocta Peptides"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Premium research-grade peptides. Third-party tested to 99%+ purity. Trusted by researchers worldwide.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Mail size={14} />
              <a href="mailto:support@noctapeptides.com" className="hover:text-[#1A3A4A] transition-colors">
                support@noctapeptides.com
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Shop</h4>
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
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-[#1A3A4A] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/research', label: 'Research Library' },
                { href: '/coa', label: 'Certificates of Analysis' },
                { href: '/partner', label: 'Partner Program' },
                { href: '/contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-[#1A3A4A] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/disclaimer', label: 'Research Disclaimer' },
                { href: '/shipping', label: 'Shipping Policy' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-[#1A3A4A] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2026 Nocta Peptides. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 text-center sm:text-right max-w-md">
            All products are for research purposes only. Not for human consumption.
            By using this site you agree to our{' '}
            <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/disclaimer" className="underline hover:text-gray-600">Research Disclaimer</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
