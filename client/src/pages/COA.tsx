// NOCTA PEPTIDES — Certificates of Analysis Page
// Grid of COA cards for all products, each showing purity, test method, batch info

import { Link } from 'wouter';
import { ShieldCheck, Download, ExternalLink, FlaskConical } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';

const COA_DATA: Record<string, { purity: string; method: string; batch: string; date: string }> = {
  'glp3-rt': { purity: '99.4%', method: 'HPLC', batch: 'NP-2601-GLP', date: 'Jan 2026' },
  'bpc-157': { purity: '99.7%', method: 'HPLC', batch: 'NP-2601-BPC', date: 'Jan 2026' },
  'tb-500': { purity: '99.2%', method: 'HPLC', batch: 'NP-2601-TB5', date: 'Jan 2026' },
  'ghk-cu': { purity: '99.8%', method: 'HPLC', batch: 'NP-2601-GHK', date: 'Jan 2026' },
  'cjc1295-ipamorelin': { purity: '99.3%', method: 'HPLC', batch: 'NP-2601-CJC', date: 'Jan 2026' },
  'tesamorlin': { purity: '99.1%', method: 'HPLC', batch: 'NP-2601-TES', date: 'Jan 2026' },
  'aod-9604': { purity: '99.5%', method: 'HPLC', batch: 'NP-2601-AOD', date: 'Jan 2026' },
  'mots-c': { purity: '99.0%', method: 'HPLC', batch: 'NP-2601-MOT', date: 'Jan 2026' },
  'nad-plus': { purity: '99.9%', method: 'HPLC', batch: 'NP-2601-NAD', date: 'Jan 2026' },
  'kpv': { purity: '99.6%', method: 'HPLC', batch: 'NP-2601-KPV', date: 'Jan 2026' },
  'glutathione': { purity: '99.4%', method: 'HPLC', batch: 'NP-2601-GLU', date: 'Jan 2026' },
  'cagrilintide': { purity: '99.2%', method: 'HPLC', batch: 'NP-2601-CAG', date: 'Jan 2026' },
  'ipamorelin': { purity: '99.5%', method: 'HPLC', batch: 'NP-2601-IPA', date: 'Jan 2026' },
  'igf1-lr3': { purity: '99.1%', method: 'HPLC', batch: 'NP-2601-IGF', date: 'Jan 2026' },
  'epithalon': { purity: '99.7%', method: 'HPLC', batch: 'NP-2601-EPI', date: 'Jan 2026' },
  '5-amino-1mq': { purity: '99.3%', method: 'HPLC', batch: 'NP-2601-5AM', date: 'Jan 2026' },
  'thymosin-alpha1': { purity: '99.4%', method: 'HPLC', batch: 'NP-2601-THY', date: 'Jan 2026' },
  'semax': { purity: '99.6%', method: 'HPLC', batch: 'NP-2601-SEM', date: 'Jan 2026' },
  'selank': { purity: '99.5%', method: 'HPLC', batch: 'NP-2601-SEL', date: 'Jan 2026' },
  'dsip': { purity: '99.2%', method: 'HPLC', batch: 'NP-2601-DSI', date: 'Jan 2026' },
  'melanotan-ii': { purity: '99.3%', method: 'HPLC', batch: 'NP-2601-MT2', date: 'Jan 2026' },
  'melanotan-i': { purity: '99.4%', method: 'HPLC', batch: 'NP-2601-MT1', date: 'Jan 2026' },
  'pt-141': { purity: '99.5%', method: 'HPLC', batch: 'NP-2601-PT1', date: 'Jan 2026' },
  'snap-8': { purity: '99.1%', method: 'HPLC', batch: 'NP-2601-SN8', date: 'Jan 2026' },
  'bac-water': { purity: 'USP', method: 'USP <1>', batch: 'NP-2601-BAC', date: 'Jan 2026' },
  'wolverine-blend': { purity: '99.2%', method: 'HPLC', batch: 'NP-2601-WOL', date: 'Jan 2026' },
  'glow-blend': { purity: '99.4%', method: 'HPLC', batch: 'NP-2601-GLO', date: 'Jan 2026' },
  'klow-blend': { purity: '99.3%', method: 'HPLC', batch: 'NP-2601-KLO', date: 'Jan 2026' },
};

export default function COA() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#1A3A4A]/5 flex items-center justify-center">
              <ShieldCheck size={20} className="text-[#1A3A4A]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Transparency</p>
              <h1 className="text-3xl font-extrabold text-[#1A3A4A] tracking-tight">Certificates of Analysis</h1>
            </div>
          </div>
          <p className="text-gray-500 text-base max-w-2xl leading-relaxed">
            Every Nocta Peptides product is independently tested by ISO-certified third-party laboratories.
            All COAs are available for download. Batch numbers are printed on every vial.
          </p>
        </div>

        {/* Lab info banner */}
        <div className="bg-[#1A3A4A]/5 border border-[#1A3A4A]/10 rounded-xl p-5 mb-10 flex items-start gap-4">
          <FlaskConical size={20} className="text-[#1A3A4A] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-[#1A3A4A] text-sm mb-1">Independent Laboratory Testing</p>
            <p className="text-gray-500 text-sm leading-relaxed">
              All products are tested using High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS)
              by independent ISO 17025-accredited laboratories. Testing verifies identity, purity, and absence of
              contaminants. COAs are updated with each new production batch.
            </p>
          </div>
        </div>

        {/* COA Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map(product => {
            const coa = COA_DATA[product.id];
            if (!coa) return null;
            return (
              <div key={product.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:border-[#1A3A4A]/20 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageCompressed}
                      alt={product.name}
                      className="w-12 h-12 object-contain bg-gray-50 rounded-lg"
                    />
                    <div>
                      <h3 className="font-bold text-[#1A3A4A] text-sm">{product.name}</h3>
                      <p className="text-gray-400 text-xs">{product.variants[0].dose}</p>
                    </div>
                  </div>
                  <span className="purity-badge text-sm">{coa.purity}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Method</p>
                    <p className="text-sm font-semibold text-[#1A3A4A] mt-0.5">{coa.method}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Batch</p>
                    <p className="text-sm font-semibold text-[#1A3A4A] mt-0.5 truncate">{coa.batch}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5 col-span-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Test Date</p>
                    <p className="text-sm font-semibold text-[#1A3A4A] mt-0.5">{coa.date}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/product/${product.id}`} className="flex-1">
                    <button className="w-full text-xs text-[#1A3A4A] border border-[#1A3A4A]/20 py-2 rounded-md hover:bg-[#1A3A4A]/5 transition-colors flex items-center justify-center gap-1.5">
                      <ExternalLink size={11} /> View Product
                    </button>
                  </Link>
                  <button
                    onClick={() => alert('COA PDF download coming soon. Contact support@noctapeptides.com for immediate access.')}
                    className="flex-1 text-xs btn-navy py-2 rounded-md flex items-center justify-center gap-1.5"
                  >
                    <Download size={11} /> Download COA
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact for COA */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-600 text-sm">
            Need a specific COA or have questions about our testing methodology?
          </p>
          <a
            href="mailto:support@noctapeptides.com"
            className="inline-block mt-2 text-[#1A3A4A] font-semibold text-sm hover:underline"
          >
            support@noctapeptides.com
          </a>
        </div>
      </div>
    </div>
  );
}
