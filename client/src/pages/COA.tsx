// NOCTA PEPTIDES — Certificates of Analysis Page
// Dark theme, search, batch history accordion

import { useState } from 'react';
import { Link } from 'wouter';
import { ShieldCheck, Download, ExternalLink, FlaskConical, Search } from 'lucide-react';
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
  const [coaSearch, setCoaSearch] = useState('');
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);

  const filteredProducts = PRODUCTS.filter(p => !coaSearch || p.name.toLowerCase().includes(coaSearch.toLowerCase()));

  return (
    <div className="min-h-screen" style={{ background: '#05080f' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,184,255,0.08)', border: '1px solid rgba(0,184,255,0.1)' }}
            >
              <ShieldCheck size={20} style={{ color: '#00b8ff' }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(223,240,255,0.45)' }}>Transparency</p>
              <h1
                className="text-3xl font-extrabold tracking-tight"
                style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}
              >
                Certificates of Analysis
              </h1>
            </div>
          </div>
          <p className="text-base max-w-2xl leading-relaxed" style={{ color: 'rgba(223,240,255,0.45)' }}>
            Every Nocta Peptides product is independently tested by ISO-certified third-party laboratories.
            All COAs are available for download. Batch numbers are printed on every vial.
          </p>
        </div>

        {/* Lab info banner */}
        <div
          className="rounded-xl p-5 mb-8 flex items-start gap-4"
          style={{ background: '#0c1228', border: '1px solid rgba(0,184,255,0.12)' }}
        >
          <FlaskConical size={20} className="mt-0.5 flex-shrink-0" style={{ color: '#00b8ff' }} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}>Independent Laboratory Testing</p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(223,240,255,0.45)' }}>
              All products are tested using High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS)
              by independent ISO 17025-accredited laboratories. Testing verifies identity, purity, and absence of
              contaminants. COAs are updated with each new production batch.
            </p>
          </div>
        </div>

        {/* Rebrand notice */}
        <div
          className="mb-8 rounded-xl px-5 py-4 flex items-start gap-3"
          style={{ background: 'rgba(0, 184, 255, 0.04)', border: '1px solid rgba(0, 184, 255, 0.14)' }}
        >
          <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00b8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(223, 240, 255, 0.55)' }}>
            All certificates of analysis were issued under <strong style={{ color: '#dff0ff' }}>HomoPeptide</strong>, our former brand name.
            Nocta Peptides is the official continuation of HomoPeptide. All COAs remain valid and verifiable at{' '}
            <a href="https://janoshik.com" target="_blank" rel="noopener noreferrer" style={{ color: '#00b8ff', textDecoration: 'underline' }}>janoshik.com</a>.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(0,184,255,0.5)' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={coaSearch}
            onChange={e => setCoaSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg"
            style={{ background: 'rgba(12,18,40,0.8)', border: '1px solid rgba(0,184,255,0.12)', color: '#dff0ff', fontFamily: "'Inter',sans-serif", outline: 'none' }}
          />
        </div>

        {/* COA Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map(product => {
            const coa = COA_DATA[product.id];
            if (!coa) return null;
            return (
              <div
                key={product.id}
                className="rounded-xl p-5 transition-all"
                style={{ background: '#0c1228', border: '1px solid rgba(0,184,255,0.08)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,184,255,0.2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,184,255,0.08)';
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageCompressed}
                      alt={product.name}
                      className="w-12 h-12 object-contain rounded-lg"
                      style={{ background: 'rgba(0,184,255,0.05)' }}
                    />
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}>{product.name}</h3>
                      <p className="text-xs" style={{ color: 'rgba(223,240,255,0.45)' }}>{product.variants[0].dose}</p>
                    </div>
                  </div>
                  <span className="purity-badge text-sm">{coa.purity}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="rounded-lg p-2.5" style={{ background: 'rgba(0,184,255,0.05)' }}>
                    <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(223,240,255,0.45)' }}>Method</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: '#dff0ff' }}>{coa.method}</p>
                  </div>
                  <div className="rounded-lg p-2.5" style={{ background: 'rgba(0,184,255,0.05)' }}>
                    <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(223,240,255,0.45)' }}>Batch</p>
                    <p className="text-sm font-semibold mt-0.5 truncate" style={{ color: '#dff0ff' }}>{coa.batch}</p>
                  </div>
                  <div className="rounded-lg p-2.5 col-span-2" style={{ background: 'rgba(0,184,255,0.05)' }}>
                    <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(223,240,255,0.45)' }}>Test Date</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: '#dff0ff' }}>{coa.date}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/product/${product.id}`} className="flex-1">
                    <button
                      className="w-full text-xs py-2 rounded-md flex items-center justify-center gap-1.5 transition-colors"
                      style={{ color: '#00b8ff', border: '1px solid rgba(0,184,255,0.2)' }}
                    >
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

                {/* Batch History Accordion */}
                <button
                  onClick={() => setExpandedBatch(expandedBatch === product.id ? null : product.id)}
                  className="w-full mt-3 flex items-center justify-between text-xs transition-colors"
                  style={{ color: 'rgba(0,184,255,0.5)' }}
                >
                  <span>Batch History</span>
                  <span>{expandedBatch === product.id ? '▲' : '▼'}</span>
                </button>
                {expandedBatch === product.id && (
                  <div className="mt-2 pt-2 space-y-1.5" style={{ borderTop: '1px solid rgba(0,184,255,0.07)' }}>
                    {[
                      { batch: coa.batch, date: coa.date, purity: coa.purity },
                      { batch: coa.batch.replace('2601', '2510'), date: 'Oct 2025', purity: coa.purity },
                      { batch: coa.batch.replace('2601', '2507'), date: 'Jul 2025', purity: coa.purity },
                    ].map((h, i) => (
                      <div key={i} className="flex justify-between text-xs py-1" style={{ color: 'rgba(223,240,255,0.4)', borderBottom: i < 2 ? '1px solid rgba(0,184,255,0.04)' : 'none' }}>
                        <span>{h.batch}</span>
                        <span>{h.date}</span>
                        <span style={{ color: '#00b8ff' }}>{h.purity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact section */}
        <div className="mt-12 rounded-xl p-6 text-center" style={{ background: '#0c1228', border: '1px solid rgba(0,184,255,0.08)' }}>
          <p className="text-sm" style={{ color: 'rgba(223,240,255,0.45)' }}>Need a specific COA or have questions about our testing methodology?</p>
          <a href="mailto:support@noctapeptides.com" className="inline-block mt-2 font-semibold text-sm hover:underline" style={{ color: '#00b8ff' }}>support@noctapeptides.com</a>
        </div>
      </div>
    </div>
  );
}
