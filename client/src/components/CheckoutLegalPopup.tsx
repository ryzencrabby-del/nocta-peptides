// NOCTA PEPTIDES — Pre-Checkout Legal Popup
// Fires EVERY time Proceed to Checkout is clicked. No localStorage. No exceptions.
// Cannot be closed by clicking outside or pressing Escape.
// All 6 checkboxes must remain checked for I Agree to be active.

import { useState, useEffect } from 'react';

interface Props {
  onAgree: () => void;
  onCancel: () => void;
}

const TERMS = [
  'I am at least 18 years of age',
  'I am purchasing these products for in-vitro research purposes only',
  'I understand these peptides are not intended for human consumption or therapeutic use',
  'I accept full responsibility for proper handling and storage of these compounds',
  'I understand all products are shipped as lyophilized freeze-dried powder requiring reconstitution',
  'Nocta Peptides does not provide usage instructions, dosage guidance, or administration protocols of any kind',
];

export default function CheckoutLegalPopup({ onAgree, onCancel }: Props) {
  const [checked, setChecked] = useState<boolean[]>(TERMS.map(() => true));
  const [showTooltip, setShowTooltip] = useState(false);

  const allChecked = checked.every(Boolean);

  // Block Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') e.preventDefault();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggle = (i: number) => {
    setChecked(prev => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const handleAgreeClick = () => {
    if (!allChecked) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2500);
      return;
    }
    onAgree();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="px-7 py-6">
          {/* NP mark */}
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-xl bg-[#0D1F35] flex items-center justify-center">
              <span className="text-white font-extrabold text-lg tracking-tight">NP</span>
            </div>
          </div>

          {/* Header */}
          <h2 className="text-xl font-extrabold text-[#0D1F35] text-center mb-1">Confirm Purchase Terms</h2>
          <p className="text-sm font-semibold text-[#0D1F35] text-center mb-4">Research Use Acknowledgment</p>

          {/* Body */}
          <p className="text-sm text-gray-500 leading-relaxed mb-5 text-center">
            These products are sold strictly for in-vitro research and laboratory use. Not for human or veterinary use.
            By completing this purchase you confirm the following:
          </p>

          {/* Checkboxes */}
          <div className="space-y-3 mb-5">
            {TERMS.map((term, i) => (
              <label
                key={i}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={checked[i]}
                    onChange={() => toggle(i)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      checked[i]
                        ? 'bg-[#0D1F35] border-[#0D1F35]'
                        : 'border-gray-300 bg-white group-hover:border-[#0D1F35]'
                    }`}
                  >
                    {checked[i] && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-700 leading-snug">{term}</span>
              </label>
            ))}
          </div>

          {/* Legal text */}
          <p className="text-xs text-gray-400 text-center mb-5 leading-relaxed">
            By clicking I Agree you also accept our{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#0D1F35] underline hover:opacity-70">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0D1F35] underline hover:opacity-70">
              Privacy Policy
            </a>.
          </p>

          {/* Buttons */}
          <div className="space-y-2 relative">
            <button
              onClick={handleAgreeClick}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                allChecked
                  ? 'bg-[#0D1F35] text-white hover:bg-[#1a3a4a]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              I Agree and Continue to Checkout
            </button>
            {showTooltip && (
              <p className="text-xs text-red-500 text-center animate-in fade-in duration-150">
                Please confirm all terms above.
              </p>
            )}
            <button
              onClick={onCancel}
              className="w-full py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
