// NOCTA PEPTIDES — Home Page (Visual Redesign)
// All content/links preserved. Only visual design changed.
// Dark immersive aesthetic: grid hero bg, glassmorphism cards, electric blue accent

import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ShieldCheck, FlaskConical, Truck, Star, ChevronRight } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480772975/WZ9nhXadZMbmVF5iFKUgx9/hero-vials-cGwSQrCCcwhCrBw7dqnSHx.webp';
const BLUE = '#00b8ff';
const BG = '#05080f';
const SURFACE = '#080d1a';
const CARD = '#0c1228';

const STATS = [
  { value: '2,400+', label: 'Researchers Worldwide' },
  { value: '48hr', label: 'Dispatch Time' },
  { value: '100%', label: 'Discreet Shipping' },
  { value: 'Money Back', label: 'Guarantee' },
];

const CATEGORIES = [
  {
    id: 'weight-loss',
    label: 'Weight Loss',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
    desc: 'GLP-3 RT, AOD-9604, Cagrilintide'
  },
  {
    id: 'recovery',
    label: 'Recovery',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
      </svg>
    ),
    desc: 'BPC-157, TB-500, IGF-1 LR3'
  },
  {
    id: 'anti-aging',
    label: 'Anti-Aging',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
    desc: 'NAD+, Epithalon, GHK-Cu'
  },
  {
    id: 'cognitive',
    label: 'Cognitive',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14z"/>
      </svg>
    ),
    desc: 'Semax, Selank, DSIP'
  },
  {
    id: 'sexual-health',
    label: 'Hormonal Health',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5"/>
        <path d="M12 13v8"/>
        <path d="M9 18h6"/>
      </svg>
    ),
    desc: 'PT-141, Melanotan I & II'
  },
  {
    id: 'blends',
    label: 'Blends & Stacks',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5l3 7H5l7 11 7-11h-3l3-7h-4"/>
        <path d="M12 3v4"/>
      </svg>
    ),
    desc: 'Wolverine, Glow, KLOW'
  },
];

const TRUST_ITEMS = [
  {
    icon: <ShieldCheck size={22} style={{ color: BLUE }} />,
    title: '99%+ Purity Guaranteed',
    desc: 'Every batch is third-party tested by independent ISO-certified laboratories. COA available for every product.',
  },
  {
    icon: <FlaskConical size={22} style={{ color: BLUE }} />,
    title: 'Research-Grade Quality',
    desc: 'Synthesized using pharmaceutical-grade processes. Lyophilized for maximum stability and shelf life.',
  },
  {
    icon: <Truck size={22} style={{ color: BLUE }} />,
    title: 'Discreet & Fast Shipping',
    desc: 'Orders dispatched within 48 hours. Shipped in temperature-controlled packaging. Free shipping over $150.',
  },
  {
    icon: <Star size={22} style={{ color: BLUE }} />,
    title: 'Money-Back Guarantee',
    desc: 'Not satisfied with your order? We offer a no-questions-asked refund within 14 days of delivery. Your research confidence is our priority.',
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('[data-reveal]').forEach((child, i) => {
            (child as HTMLElement).style.animationDelay = `${i * 0.08}s`;
            child.classList.add('reveal');
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Home() {
  const featured = getFeaturedProducts();
  const statsRef = useReveal();
  const productsRef = useReveal();
  const categoriesRef = useReveal();
  const trustRef = useReveal();

  return (
    <div className="min-h-screen" style={{ background: BG }}>

      {/* ── Hero ── Full-screen dark with grid background */}
      <section
        className="hero-grid-bg relative min-h-screen flex items-center overflow-hidden"
        style={{ minHeight: '92vh' }}
      >
        <div className="noise-overlay" />

        {/* Bottom fade to body bg */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${BG})` }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-10 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <div>
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
                style={{
                  background: 'rgba(0, 184, 255, 0.08)',
                  border: '1px solid rgba(0, 184, 255, 0.2)',
                  color: BLUE,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: BLUE, boxShadow: '0 0 6px rgba(0, 184, 255, 0.8)' }}
                />
                Premium Research Compounds
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#dff0ff' }}
              >
                Research-Grade
                <br />
                <span style={{ color: BLUE, textShadow: '0 0 30px rgba(0, 184, 255, 0.4)' }}>
                  Peptides.
                </span>
                <br />
                <span style={{ color: 'rgba(223, 240, 255, 0.35)' }}>Verified Purity.</span>
              </h1>


              <p
                className="text-lg leading-relaxed mb-8 max-w-lg"
                style={{ color: 'rgba(223, 240, 255, 0.5)', fontFamily: "'Inter', sans-serif" }}
              >
                28 premium compounds. Every vial third-party tested to 99%+ purity.
                COA available on every product. Trusted by researchers worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/shop">
                  <button className="btn-navy flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold">
                    Shop All Products
                    <ArrowRight size={16} />
                  </button>
                </Link>
                <Link href="/coa">
                  <button
                    className="flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200"
                    style={{
                      border: '1px solid rgba(0, 184, 255, 0.2)',
                      color: 'rgba(223, 240, 255, 0.65)',
                      background: 'transparent',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 184, 255, 0.45)';
                      (e.currentTarget as HTMLElement).style.color = '#dff0ff';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(0, 184, 255, 0.06)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 184, 255, 0.2)';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(223, 240, 255, 0.65)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    View COA Reports
                  </button>
                </Link>
              </div>

              {/* Trust row */}
              <div
                className="flex items-center gap-4 mt-8 pt-8"
                style={{ borderTop: '1px solid rgba(0, 184, 255, 0.08)' }}
              >
                <div className="flex -space-x-2">
                  {['rgba(0,184,255,0.3)', 'rgba(0,140,220,0.3)', 'rgba(80,200,255,0.3)', 'rgba(0,100,200,0.3)'].map((c, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2"
                      style={{
                        background: c,
                        borderColor: BG,
                        backdropFilter: 'blur(4px)',
                      }}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={11} className="star-gold fill-current" />)}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(223, 240, 255, 0.35)' }}>
                    Trusted by 2,400+ researchers
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              {/* Glow behind image */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(0, 184, 255, 0.08) 0%, transparent 70%)' }}
              />
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  border: '1px solid rgba(0, 184, 255, 0.12)',
                  background: 'rgba(8, 13, 26, 0.8)',
                  boxShadow: '0 0 60px rgba(0, 184, 255, 0.06), 0 20px 60px rgba(0, 0, 0, 0.6)',
                }}
              >
                <img
                  src={HERO_IMAGE}
                  alt="Nocta Peptides product vials"
                  className="w-full rounded-3xl object-cover"
                  style={{ filter: 'brightness(0.95) contrast(1.05)' }}
                />
              </div>

              {/* Floating badge — purity */}
              <div
                className="absolute -bottom-4 -left-4 rounded-xl px-4 py-3 glass-card"
                style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 184, 255, 0.1)' }}
              >
                <p
                  className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: 'rgba(0, 184, 255, 0.6)' }}
                >
                  Purity
                </p>
                <p
                  className="text-xl font-extrabold"
                  style={{ color: BLUE, fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 0 15px rgba(0, 184, 255, 0.5)' }}
                >
                  99%+
                </p>
                <p className="text-[10px]" style={{ color: 'rgba(223, 240, 255, 0.35)' }}>
                  3rd Party Verified
                </p>
              </div>

              {/* Floating badge — compounds */}
              <div
                className="absolute -top-4 -right-4 rounded-xl px-4 py-3"
                style={{
                  background: BLUE,
                  boxShadow: '0 0 30px rgba(0, 184, 255, 0.4), 0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                <p
                  className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: 'rgba(5, 8, 15, 0.65)' }}
                >
                  Products
                </p>
                <p
                  className="text-xl font-extrabold"
                  style={{ color: '#05080f', fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  28+
                </p>
                <p className="text-[10px]" style={{ color: 'rgba(5, 8, 15, 0.55)' }}>
                  Compounds
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section
        className="blue-rule"
        style={{ marginTop: 0 }}
      />
      <section ref={statsRef} style={{ background: SURFACE, borderBottom: '1px solid rgba(0, 184, 255, 0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="text-center" data-reveal>
                <p
                  className="text-2xl sm:text-3xl font-extrabold"
                  style={{ color: BLUE, fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 0 20px rgba(0, 184, 255, 0.3)' }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs font-medium uppercase tracking-wider mt-1"
                  style={{ color: 'rgba(223, 240, 255, 0.38)' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section
        ref={productsRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="flex items-center justify-between mb-10" data-reveal>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: 'rgba(0, 184, 255, 0.6)', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Top Sellers
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: '#dff0ff', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-sm font-medium transition-all duration-200 hover:gap-2"
            style={{ color: BLUE, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {featured.map((product, i) => (
            <div key={product.id} data-reveal style={{ animationDelay: `${i * 0.07}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <div className="blue-rule mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <section
        ref={categoriesRef}
        className="py-16"
        style={{ background: SURFACE, borderTop: '1px solid rgba(0, 184, 255, 0.06)', borderBottom: '1px solid rgba(0, 184, 255, 0.06)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10" data-reveal>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: 'rgba(0, 184, 255, 0.6)', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Browse By Goal
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: '#dff0ff', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Research Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.id} href={`/shop?category=${cat.id}`}>
                <div
                  className="rounded-xl p-4 text-center cursor-pointer transition-all duration-200"
                  data-reveal
                  style={{
                    background: CARD,
                    border: '1px solid rgba(0, 184, 255, 0.08)',
                    animationDelay: `${i * 0.06}s`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = '#0f1a35';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,184,255,0.3)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(0,184,255,0.1)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = CARD;
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,184,255,0.08)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 mx-auto"
                    style={{ background: 'rgba(0,184,255,0.08)', border: '1px solid rgba(0,184,255,0.12)', color: '#00b8ff' }}
                  >
                    {cat.icon}
                  </div>
                  <p
                    className="font-semibold text-xs mb-1"
                    style={{ color: '#dff0ff', fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {cat.label}
                  </p>
                  <p
                    className="text-[10px] leading-tight"
                    style={{ color: 'rgba(223, 240, 255, 0.35)' }}
                  >
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section
        ref={trustRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center mb-10" data-reveal>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'rgba(0, 184, 255, 0.6)', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Why Nocta
          </p>
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: '#dff0ff', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            The Nocta Standard
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className="flex flex-col items-start gap-4 p-6 rounded-xl card-glow"
              data-reveal
              style={{
                background: CARD,
                border: '1px solid rgba(0, 184, 255, 0.08)',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,184,255,0.12) 0%, rgba(0,100,200,0.08) 100%)',
                  border: '1px solid rgba(0,184,255,0.2)',
                  boxShadow: '0 0 20px rgba(0,184,255,0.06)',
                }}
              >
                {item.icon}
              </div>
              <h3
                className="font-bold text-base"
                style={{ color: '#dff0ff', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(223, 240, 255, 0.45)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div
          className="rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #050d20 0%, #081828 50%, #04101c 100%)`,
            border: '1px solid rgba(0, 184, 255, 0.18)',
            boxShadow: '0 0 60px rgba(0, 184, 255, 0.06), inset 0 1px 0 rgba(0, 184, 255, 0.1)',
          }}
        >
          {/* Background glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0, 184, 255, 0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
          />
          <div className="relative z-10">
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2"
              style={{ color: '#dff0ff', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ready to start your research?
            </h2>
            <p className="text-sm" style={{ color: 'rgba(223, 240, 255, 0.45)' }}>
              Browse 28 premium compounds. Free shipping on orders over $150.
            </p>
          </div>
          <Link href="/shop" className="relative z-10">
            <button
              className="font-bold px-6 py-3.5 rounded-lg text-sm flex items-center gap-2 whitespace-nowrap transition-all duration-200"
              style={{
                background: BLUE,
                color: '#05080f',
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: '0 0 25px rgba(0, 184, 255, 0.4)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(0, 184, 255, 0.6)';
                (e.currentTarget as HTMLElement).style.background = '#20c4ff';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 25px rgba(0, 184, 255, 0.4)';
                (e.currentTarget as HTMLElement).style.background = BLUE;
              }}
            >
              Shop Now <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
