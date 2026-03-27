// NOCTA PEPTIDES — Legal / Research Disclaimer Popup
// Shown on first visit. User must click "I Agree" to proceed.
// Stored in localStorage so it only shows once.

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function LegalPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const agreed = localStorage.getItem('nocta-legal-agreed');
    if (!agreed) {
      setShow(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('nocta-legal-agreed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-amber-500" />
          </div>
          <div>
            <h2 className="font-bold text-[#1A3A4A] text-lg">Research Use Disclaimer</h2>
            <p className="text-gray-400 text-xs">Please read before continuing</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p>
            All products sold by <strong className="text-[#1A3A4A]">Nocta Peptides</strong> are intended
            <strong> exclusively for in-vitro research and laboratory use</strong> by qualified researchers.
          </p>
          <p>
            These products are <strong>not approved by the FDA</strong> and are not intended for human
            consumption, veterinary use, or any clinical, therapeutic, or diagnostic application.
          </p>
          <p>
            By clicking "I Agree & Enter", you confirm that:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
            <li>You are a qualified researcher or licensed professional</li>
            <li>You are at least 18 years of age</li>
            <li>You will use these products solely for lawful research purposes</li>
            <li>You understand these products are not for human use</li>
            <li>You have read and agree to our Terms of Service and Research Disclaimer</li>
          </ul>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleAgree}
            className="w-full btn-navy py-3 rounded-md text-sm font-semibold"
          >
            I Agree & Enter Site
          </button>
          <a
            href="https://www.google.com"
            className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            I Do Not Agree — Leave Site
          </a>
        </div>
      </div>
    </div>
  );
}
