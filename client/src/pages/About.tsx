import { Link } from 'wouter';
import { ShieldCheck, FlaskConical, ArrowRight, Microscope, Award, Globe } from 'lucide-react';

const BLUE = '#00b8ff';
const BG = '#05080f';
const CARD = '#0c1228';

const PILLARS = [
  {
    icon: <ShieldCheck size={22} style={{ color: BLUE }} />,
    title: '99%+ Purity, Every Batch',
    desc: 'Every compound we supply is independently tested by ISO 17025-accredited laboratories using HPLC and mass spectrometry. We publish COA data for every single product — no exceptions.',
  },
  {
    icon: <FlaskConical size={22} style={{ color: BLUE }} />,
    title: 'Pharmaceutical-Grade Synthesis',
    desc: 'Our compounds are synthesized using pharmaceutical-grade processes and lyophilized for maximum stability. Rigorous QC at every stage means the compound in your vial matches the label.',
  },
  {
    icon: <Microscope size={22} style={{ color: BLUE }} />,
    title: 'Research-First Approach',
    desc: 'We supply researchers, not customers. Every product listing includes mechanism of action, purity method, and storage protocols. We exist to support serious scientific inquiry.',
  },
  {
    icon: <Globe size={22} style={{ color: BLUE }} />,
    title: 'Trusted Worldwide',
    desc: 'Over 2,400 researchers across 40+ countries have ordered from Nocta Peptides. Our compounds reach university labs, independent researchers, and institutional facilities globally.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(0,184,255,0.6)', fontFamily: "'Space Grotesk',sans-serif" }}>
            About Nocta Peptides
          </p>
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6"
            style={{ fontFamily: "'Space Grotesk',sans-serif", color: '#dff0ff' }}
          >
            The Standard for
            <br />
            <span style={{ color: BLUE, textShadow: '0 0 30px rgba(0,184,255,0.3)' }}>Research-Grade</span>{' '}
            Peptides.
          </h1>
          <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, #00b8ff, transparent)' }} />
        </div>

        {/* Mission */}
        <div className="mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(0,184,255,0.5)', fontFamily: "'Space Grotesk',sans-serif" }}>Our Mission</p>
              <p className="text-lg leading-relaxed mb-5" style={{ color: 'rgba(223,240,255,0.7)' }}>
                Nocta Peptides exists to give researchers access to the highest-quality peptide compounds available — with full transparency on purity, testing, and sourcing.
              </p>
              <p className="text-base leading-relaxed mb-5" style={{ color: 'rgba(223,240,255,0.5)' }}>
                Research peptides play a critical role in advancing our understanding of human biology — from tissue regeneration and metabolic regulation to neuroprotection and cellular aging. The quality of those compounds directly affects the validity of the research. Bad purity means bad data.
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(223,240,255,0.5)' }}>
                We built Nocta Peptides because we believe researchers deserve a supplier who treats quality as non-negotiable, not a marketing claim. Every batch we ship comes with a Certificate of Analysis from an independent ISO-accredited laboratory. We don't sell compounds we wouldn't trust in our own research.
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="rounded-2xl p-6" style={{ background: CARD, border: '1px solid rgba(0,184,255,0.1)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'rgba(0,184,255,0.5)', fontFamily: "'Space Grotesk',sans-serif" }}>At a Glance</p>
                {[
                  { value: '28+', label: 'Research Compounds' },
                  { value: '99%+', label: 'Purity Guarantee' },
                  { value: '2,400+', label: 'Researchers Served' },
                  { value: '40+', label: 'Countries Reached' },
                ].map(s => (
                  <div key={s.label} className="flex items-baseline justify-between py-3" style={{ borderBottom: '1px solid rgba(0,184,255,0.06)' }}>
                    <span className="text-2xl font-extrabold" style={{ color: BLUE, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</span>
                    <span className="text-sm" style={{ color: 'rgba(223,240,255,0.4)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Research Peptides */}
        <div className="mb-14 rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #050d20 0%, #081828 100%)', border: '1px solid rgba(0,184,255,0.12)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(0,184,255,0.6)', fontFamily: "'Space Grotesk',sans-serif" }}>Why Research Peptides</p>
          <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}>The Science Behind the Compounds</h2>
          <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(223,240,255,0.55)' }}>
            Peptides are short chains of amino acids — the fundamental building blocks of proteins. In research contexts, synthetic peptides allow scientists to study specific biological signaling pathways with precision that would be impossible with larger molecules.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(223,240,255,0.55)' }}>
            From BPC-157's cytoprotective effects and TB-500's role in tissue remodeling, to Epithalon's telomerase activation and Semax's BDNF upregulation — each compound represents a targeted research tool. The quality of the compound determines the quality of the science.
          </p>
        </div>

        {/* Four pillars */}
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(0,184,255,0.6)', fontFamily: "'Space Grotesk',sans-serif" }}>What Makes Nocta Different</p>
          <h2 className="text-2xl font-extrabold mb-8" style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}>Our Commitment to Quality</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PILLARS.map(pillar => (
              <div key={pillar.title} className="flex flex-col gap-3 p-6 rounded-xl" style={{ background: CARD, border: '1px solid rgba(0,184,255,0.08)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,184,255,0.08)', border: '1px solid rgba(0,184,255,0.15)' }}>
                  {pillar.icon}
                </div>
                <h3 className="font-bold text-base" style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}>{pillar.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(223,240,255,0.45)' }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop">
            <button className="btn-navy flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold">
              Browse Research Compounds <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="/coa">
            <button
              className="flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{ border: '1px solid rgba(0,184,255,0.2)', color: 'rgba(223,240,255,0.65)', background: 'transparent' }}
            >
              View All COA Reports
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
