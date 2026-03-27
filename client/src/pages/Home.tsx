// NOCTA PEPTIDES — Home Page
// Hero (asymmetric: text left, vials right), stats bar, featured products, categories, trust section

import { Link } from 'wouter';
import { ArrowRight, ShieldCheck, FlaskConical, Truck, Star, ChevronRight } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480772975/WZ9nhXadZMbmVF5iFKUgx9/hero-vials-cGwSQrCCcwhCrBw7dqnSHx.webp';

const STATS = [
  { value: '28+', label: 'Research Compounds' },
  { value: '99%+', label: 'Purity Guaranteed' },
  { value: '3rd Party', label: 'COA Verified' },
  { value: '48hr', label: 'Dispatch Time' },
];

const CATEGORIES = [
  { id: 'weight-loss', label: 'Weight Loss', icon: '⚖️', desc: 'GLP-3 RT, AOD-9604, Cagrilintide' },
  { id: 'recovery', label: 'Recovery', icon: '🔬', desc: 'BPC-157, TB-500, IGF-1 LR3' },
  { id: 'anti-aging', label: 'Anti-Aging', icon: '🧬', desc: 'NAD+, Epithalon, GHK-Cu' },
  { id: 'cognitive', label: 'Cognitive', icon: '🧠', desc: 'Semax, Selank, DSIP' },
  { id: 'sexual-health', label: 'Sexual Health', icon: '💊', desc: 'PT-141, Melanotan I & II' },
  { id: 'blends', label: 'Blends & Stacks', icon: '⚗️', desc: 'Wolverine, Glow, KLOW' },
];

const TRUST_ITEMS = [
  {
    icon: <ShieldCheck size={22} className="text-[#1A3A4A]" />,
    title: '99%+ Purity Guaranteed',
    desc: 'Every batch is third-party tested by independent ISO-certified laboratories. COA available for every product.',
  },
  {
    icon: <FlaskConical size={22} className="text-[#1A3A4A]" />,
    title: 'Research-Grade Quality',
    desc: 'Synthesized using pharmaceutical-grade processes. Lyophilized for maximum stability and shelf life.',
  },
  {
    icon: <Truck size={22} className="text-[#1A3A4A]" />,
    title: 'Discreet & Fast Shipping',
    desc: 'Orders dispatched within 48 hours. Shipped in temperature-controlled packaging. Free shipping over $150.',
  },
];

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1A3A4A]/5 text-[#1A3A4A] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A3A4A] animate-pulse" />
              Premium Research Compounds
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A3A4A] leading-[1.1] tracking-tight mb-6">
              Research-Grade<br />
              <span className="text-gray-300">Peptides.</span><br />
              Verified Purity.
            </h1>
            {/* Rebrand badge */}
            <div className="inline-flex items-center gap-2 bg-[#1A3A4A]/5 border border-[#1A3A4A]/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A3A4A]/40" />
              <span className="text-xs text-[#1A3A4A]/70 font-medium tracking-wide">
                Formerly HomoPeptide — Same compounds. Same COAs. Elevated brand.
              </span>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
              28 premium compounds. Every vial third-party tested to 99%+ purity.
              COA available on every product. Trusted by researchers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/shop">
                <button className="btn-navy flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-semibold">
                  Shop All Products
                  <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/coa">
                <button className="flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-semibold border border-gray-200 text-gray-600 hover:border-[#1A3A4A] hover:text-[#1A3A4A] transition-colors">
                  View COA Reports
                </button>
              </Link>
            </div>

            {/* Mini trust row */}
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="flex -space-x-2">
                {['bg-blue-200','bg-green-200','bg-purple-200','bg-amber-200'].map((c,i) => (
                  <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white`} />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={11} className="star-gold fill-current" />)}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Trusted by 2,400+ researchers</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl" />
            <img
              src={HERO_IMAGE}
              alt="Nocta Peptides product vials"
              className="relative w-full rounded-3xl object-cover shadow-xl"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Purity</p>
              <p className="text-xl font-extrabold text-[#1A3A4A]">99%+</p>
              <p className="text-[10px] text-gray-400">3rd Party Verified</p>
            </div>
            <div className="absolute -top-4 -right-4 bg-[#1A3A4A] rounded-xl shadow-lg px-4 py-3">
              <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold">Products</p>
              <p className="text-xl font-extrabold text-white">28+</p>
              <p className="text-[10px] text-white/60">Compounds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="section-gray border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#1A3A4A]">{stat.value}</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Top Sellers</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A3A4A] tracking-tight">Featured Products</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-1 text-sm font-medium text-[#1A3A4A] hover:gap-2 transition-all">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section-gray border-y border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Browse By Goal</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A3A4A] tracking-tight">Research Categories</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href={`/shop?category=${cat.id}`}>
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:border-[#1A3A4A]/30 hover:shadow-md transition-all cursor-pointer group">
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <p className="font-semibold text-[#1A3A4A] text-xs mb-1">{cat.label}</p>
                  <p className="text-gray-400 text-[10px] leading-tight">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Why Nocta</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A3A4A] tracking-tight">The Nocta Standard</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {TRUST_ITEMS.map(item => (
            <div key={item.title} className="flex flex-col items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A3A4A]/5 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-bold text-[#1A3A4A] text-base">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[#1A3A4A] rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Ready to start your research?
            </h2>
            <p className="text-white/60 text-sm">
              Browse 28 premium compounds. Free shipping on orders over $150.
            </p>
          </div>
          <Link href="/shop">
            <button className="bg-white text-[#1A3A4A] font-bold px-6 py-3.5 rounded-md text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap">
              Shop Now <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
