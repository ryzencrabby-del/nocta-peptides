// NOCTA PEPTIDES — About Page
// Same Science. New Name. — HomoPeptide rebrand story

import { Link } from 'wouter';
import { ShieldCheck, FlaskConical, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Our Story</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1A3A4A] tracking-tight leading-[1.1] mb-6">
            Same Science.<br />New Name.
          </h1>
          <div className="w-12 h-1 bg-[#1A3A4A] rounded-full" />
        </div>

        {/* Body */}
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Nocta Peptides is the official rebrand of <strong className="text-[#1A3A4A]">HomoPeptide</strong>. We have been operating in the research peptide space supplying verified third-party tested compounds to researchers worldwide.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Our entire product catalog carries the same <strong className="text-[#1A3A4A]">Janoshik Analytical certificates of analysis</strong> from our HomoPeptide era — fully valid, fully verifiable in real time.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            We rebranded to Nocta Peptides to better reflect our commitment to premium quality and elevated customer experience. Nothing about our sourcing, testing standards, or product formulations has changed. Only the name.
          </p>
        </div>

        {/* Trust cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-[#1A3A4A]/5 border border-[#1A3A4A]/10 rounded-xl p-6">
            <ShieldCheck size={22} className="text-[#1A3A4A] mb-3" />
            <h3 className="font-bold text-[#1A3A4A] text-base mb-2">Same COAs</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              All Janoshik batch numbers and live test results from our HomoPeptide era remain fully valid and verifiable at{' '}
              <a href="https://janoshik.com" target="_blank" rel="noopener noreferrer" className="text-[#1A3A4A] underline hover:opacity-70">janoshik.com</a>.
            </p>
          </div>
          <div className="bg-[#1A3A4A]/5 border border-[#1A3A4A]/10 rounded-xl p-6">
            <FlaskConical size={22} className="text-[#1A3A4A] mb-3" />
            <h3 className="font-bold text-[#1A3A4A] text-base mb-2">Same Compounds</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Identical sourcing, identical formulations, identical 99%+ purity standards. The rebrand changed nothing about our product quality or testing protocols.
            </p>
          </div>
        </div>

        {/* HomoPeptide notice */}
        <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <span className="text-amber-500 mt-0.5 flex-shrink-0 text-base">ℹ</span>
          <p className="text-sm text-amber-800 leading-relaxed">
            If you previously ordered from <strong>HomoPeptide</strong>, your order history, COA batch numbers, and all Janoshik test results remain fully valid under the Nocta Peptides brand. For any questions, contact{' '}
            <a href="mailto:support@noctapeptides.com" className="underline font-medium">support@noctapeptides.com</a>.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row gap-3">
          <Link href="/shop">
            <button className="btn-navy flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-semibold">
              Shop All Products <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="/coa">
            <button className="flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-semibold border border-gray-200 text-gray-600 hover:border-[#1A3A4A] hover:text-[#1A3A4A] transition-colors">
              View COA Reports
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
