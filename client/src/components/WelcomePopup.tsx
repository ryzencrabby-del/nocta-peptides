// NOCTA PEPTIDES — First Visit Welcome Popup
// Shows 5s after first visit, bottom-right (mobile: bottom-center)
// Only once per visitor (localStorage: nocta-welcome-shown)
// Auto-dismisses after 10s. Clicking NOCTA15 copies to clipboard.
// Does NOT show on /checkout.

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'wouter';

const STORAGE_KEY = 'nocta-welcome-shown';
const SHOW_DELAY  = 5000;   // 5 seconds
const AUTO_DISMISS = 10000; // 10 seconds

export default function WelcomePopup() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => setMounted(false), 400); // wait for fade-out
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  useEffect(() => {
    // Don't show on checkout
    if (location === '/checkout') return;

    // Only show on homepage, shop, and product pages
    const allowed = ['/', '/shop'].some(p => location === p) || location.startsWith('/product/');
    if (!allowed) return;

    // Only show once per visitor
    if (localStorage.getItem(STORAGE_KEY)) return;

    const showTimer = setTimeout(() => {
      setMounted(true);
      // Small delay for mount → trigger CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });

      // Auto-dismiss after 10s
      const dismissTimer = setTimeout(dismiss, AUTO_DISMISS);
      return () => clearTimeout(dismissTimer);
    }, SHOW_DELAY);

    return () => clearTimeout(showTimer);
  }, [location, dismiss]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText('NOCTA15');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = 'NOCTA15';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShopNow = () => {
    dismiss();
    window.location.href = '/shop';
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed z-[300] transition-all duration-400 ease-out
        bottom-4 right-4 sm:right-6
        sm:bottom-6
        max-sm:left-4 max-sm:right-4 max-sm:bottom-4
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}
      `}
      style={{ width: 'min(320px, calc(100vw - 2rem))' }}
      role="dialog"
      aria-label="Welcome offer"
    >
      <div className="bg-[#0D1F35] rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors z-10"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="px-5 pt-5 pb-4 space-y-3">
          {/* Emoji */}
          <div className="text-2xl">🎁</div>

          {/* Headline */}
          <div>
            <h3 className="text-white font-extrabold text-base leading-tight">
              Welcome to Nocta Peptides
            </h3>
            <p className="text-white/60 text-xs mt-1 leading-relaxed">
              Use code <span className="text-white font-semibold">NOCTA15</span> at checkout for 15% off your first order
            </p>
          </div>

          {/* Code pill */}
          <button
            onClick={handleCopyCode}
            className="w-full flex flex-col items-center gap-0.5 bg-[#0A2E4A] hover:bg-[#0e3a5e] border border-cyan-400/30 rounded-xl py-3 px-4 transition-colors group"
          >
            <span className="text-cyan-400 font-extrabold text-xl tracking-widest group-hover:text-cyan-300 transition-colors">
              NOCTA15
            </span>
            <span className="text-white/40 text-[10px]">
              {copied ? '✓ Copied!' : 'Click to copy'}
            </span>
          </button>

          {/* Shop Now */}
          <button
            onClick={handleShopNow}
            className="w-full bg-white text-[#0D1F35] font-bold text-sm py-2.5 rounded-xl hover:bg-white/90 transition-colors"
          >
            Shop Now
          </button>

          {/* Fine print */}
          <p className="text-white/25 text-[10px] text-center">
            First order only. Research compounds.
          </p>
        </div>
      </div>
    </div>
  );
}
