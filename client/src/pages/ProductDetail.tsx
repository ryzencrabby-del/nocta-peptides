// NOCTA PEPTIDES — Product Detail Page
// Dark theme, tabbed content, frequently bought together

import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { ShoppingCart, Star, Shield, FileText, ChevronLeft, Package } from 'lucide-react';
import { getProductById, PRODUCTS } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const product = getProductById(params?.id || '');
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'research' | 'storage' | 'coa' | 'reviews'>('description');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#05080f' }}>
        <div className="text-center">
          <p className="text-lg" style={{ color: 'rgba(223,240,255,0.45)' }}>Product not found</p>
          <Link href="/shop" className="mt-4 inline-block btn-navy px-5 py-2 rounded-md text-sm">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];

  const handleAddToCart = () => {
    addItem(product, variant.dose, variant.price);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Related products (same category, different product)
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen" style={{ background: '#05080f' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: 'rgba(223,240,255,0.45)' }}>
          <Link href="/shop" className="flex items-center gap-1 transition-colors hover:text-[#dff0ff]" style={{ color: 'rgba(223,240,255,0.45)' }}>
            <ChevronLeft size={12} /> Shop
          </Link>
          <span>/</span>
          <span style={{ color: 'rgba(223,240,255,0.65)' }}>{product.name}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div
            className="rounded-2xl aspect-square flex items-center justify-center p-8"
            style={{ background: '#0c1228', border: '1px solid rgba(0,184,255,0.08)' }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details */}
          <div>
            {/* Category badge */}
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: 'rgba(0,184,255,0.08)', color: '#00b8ff', border: '1px solid rgba(0,184,255,0.15)' }}
            >
              {product.category.replace('-', ' ')}
            </span>

            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2"
              style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}
            >
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-1.5 mb-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={14} className={`${i <= Math.round(product.rating || 5) ? 'star-gold fill-current' : ''}`} style={{ color: i <= Math.round(product.rating || 5) ? undefined : 'rgba(223,240,255,0.2)' }} />
              ))}
              <span className="text-sm ml-1" style={{ color: 'rgba(223,240,255,0.45)' }}>{product.rating || 5.0} · {product.reviewCount || 48} reviews</span>
            </div>

            {/* Purity badge */}
            <div className="flex items-center gap-2 mb-5">
              <span className="purity-badge text-sm px-3 py-1">{product.purity} Purity</span>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ background: '#0c1228', color: 'rgba(223,240,255,0.45)', border: '1px solid rgba(0,184,255,0.08)' }}
              >
                COA Available
              </span>
              {product.isBlend && (
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: 'rgba(0,184,255,0.12)', color: '#00b8ff', border: '1px solid rgba(0,184,255,0.2)' }}
                >
                  Blend
                </span>
              )}
            </div>

            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(223,240,255,0.55)' }}>{product.description}</p>

            {/* Blend components */}
            {product.isBlend && product.blendComponents && (
              <div className="rounded-xl p-4 mb-6" style={{ background: '#0c1228', border: '1px solid rgba(0,184,255,0.08)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(223,240,255,0.45)' }}>Blend Components</p>
                <div className="flex flex-wrap gap-2">
                  {product.blendComponents.map(comp => (
                    <span
                      key={comp}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(0,184,255,0.08)', border: '1px solid rgba(0,184,255,0.15)', color: '#00b8ff' }}
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dosage Selector */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(223,240,255,0.45)' }}>Select Dosage</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.dose}
                      onClick={() => setSelectedVariant(idx)}
                      className={`dosage-pill ${idx === selectedVariant ? 'selected' : ''}`}
                    >
                      {v.dose}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className="text-3xl font-extrabold"
                style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}
              >
                ${variant.price.toFixed(2)}
              </span>
              <span style={{ color: 'rgba(223,240,255,0.45)' }} className="text-sm">{variant.dose}</span>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`w-full btn-navy flex items-center justify-center gap-2 py-4 rounded-md text-sm font-semibold mb-4 ${added ? 'bg-green-700' : ''}`}
            >
              <ShoppingCart size={16} />
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>

            {/* Trust row */}
            <div
              className="grid grid-cols-3 gap-3 pt-4"
              style={{ borderTop: '1px solid rgba(0,184,255,0.08)' }}
            >
              <div className="flex flex-col items-center gap-1 text-center">
                <Shield size={16} style={{ color: '#00b8ff' }} />
                <p className="text-[10px] font-medium" style={{ color: 'rgba(223,240,255,0.45)' }}>3rd Party Tested</p>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <FileText size={16} style={{ color: '#00b8ff' }} />
                <p className="text-[10px] font-medium" style={{ color: 'rgba(223,240,255,0.45)' }}>COA Available</p>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <Package size={16} style={{ color: '#00b8ff' }} />
                <p className="text-[10px] font-medium" style={{ color: 'rgba(223,240,255,0.45)' }}>48hr Dispatch</p>
              </div>
            </div>

            {/* COA link */}
            <div className="mt-4">
              <Link href="/coa" className="text-sm underline underline-offset-2 hover:no-underline" style={{ color: '#00b8ff' }}>
                View Certificate of Analysis →
              </Link>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="mb-16">
          {/* Tab bar */}
          <div
            className="flex overflow-x-auto gap-1 p-1 rounded-xl mb-6"
            style={{ background: '#0c1228', border: '1px solid rgba(0,184,255,0.08)' }}
          >
            {[
              { id: 'description', label: 'Description' },
              { id: 'research', label: 'Research' },
              { id: 'storage', label: 'Storage & Handling' },
              { id: 'coa', label: 'COA' },
              { id: 'reviews', label: `Reviews (${product.reviewCount || 0})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 flex-1"
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  background: activeTab === tab.id ? '#00b8ff' : 'transparent',
                  color: activeTab === tab.id ? '#05080f' : 'rgba(223,240,255,0.5)',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="rounded-xl p-6" style={{ background: '#0c1228', border: '1px solid rgba(0,184,255,0.08)' }}>
            {activeTab === 'description' && (
              <div>
                <h3 className="text-base font-bold mb-3" style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}>About {product.name}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(223,240,255,0.55)' }}>{product.description}</p>
                {product.isBlend && product.blendComponents && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(0,184,255,0.6)' }}>Blend Components</p>
                    <div className="flex flex-wrap gap-2">
                      {product.blendComponents.map(c => (
                        <span key={c} className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(0,184,255,0.08)', border: '1px solid rgba(0,184,255,0.15)', color: '#00b8ff' }}>{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'research' && (
              <div>
                <h3 className="text-base font-bold mb-3" style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}>Research Background</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(223,240,255,0.55)' }}>
                  {product.name} has been the subject of extensive preclinical and in-vitro research. All compounds sold by Nocta Peptides are for research purposes only and have not been evaluated by the FDA for human use.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(223,240,255,0.55)' }}>{product.description}</p>
                <a href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-sm" style={{ color: '#00b8ff' }}>
                  Search PubMed for {product.name} research →
                </a>
              </div>
            )}
            {activeTab === 'storage' && (
              <div>
                <h3 className="text-base font-bold mb-4" style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}>Storage & Handling</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Lyophilized Storage', body: 'Store lyophilized peptides at −20°C in a sealed, moisture-free environment. Avoid repeated freeze-thaw cycles. Shelf life is typically 24 months when stored correctly.' },
                    { title: 'Reconstitution', body: 'Reconstitute with bacteriostatic water (BAC Water) or sterile saline. Add solvent slowly down the side of the vial, do not inject directly onto the powder. Gently swirl — do not shake.' },
                    { title: 'After Reconstitution', body: 'Store reconstituted peptide at 2–8°C (refrigerator). Use within 28 days. Keep away from light. Do not freeze reconstituted solution.' },
                    { title: 'Research Use Only', body: 'All Nocta Peptides products are for in-vitro research and laboratory use only. Not for human or veterinary use. Handle with appropriate laboratory safety precautions.' },
                  ].map(item => (
                    <div key={item.title} className="p-4 rounded-lg" style={{ background: 'rgba(0,184,255,0.04)', border: '1px solid rgba(0,184,255,0.08)' }}>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#00b8ff', fontFamily: "'Space Grotesk',sans-serif" }}>{item.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(223,240,255,0.55)' }}>{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'coa' && (
              <div>
                <h3 className="text-base font-bold mb-3" style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}>Certificate of Analysis</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Purity', value: product.purity },
                    { label: 'Test Method', value: 'HPLC' },
                    { label: 'Standard', value: 'ISO 17025' },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-lg text-center" style={{ background: 'rgba(0,184,255,0.06)', border: '1px solid rgba(0,184,255,0.1)' }}>
                      <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(0,184,255,0.6)' }}>{item.label}</p>
                      <p className="font-bold" style={{ color: '#00b8ff', fontFamily: "'Space Grotesk',sans-serif" }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm mb-4" style={{ color: 'rgba(223,240,255,0.45)' }}>Every batch is independently tested by ISO 17025-accredited laboratories using HPLC and mass spectrometry. Batch numbers are printed on every vial.</p>
                <Link href="/coa">
                  <button className="btn-navy px-4 py-2.5 rounded-lg text-sm">View Full COA Report</button>
                </Link>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-4xl font-extrabold" style={{ color: '#00b8ff', fontFamily: "'Space Grotesk',sans-serif" }}>{product.rating || 5.0}</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3,4,5].map(i => <Star key={i} size={12} className="star-gold fill-current" />)}
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'rgba(223,240,255,0.35)' }}>{product.reviewCount} reviews</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'R.K.', rating: 5, date: 'Mar 2026', text: `Excellent quality. The ${product.name} arrived well-packaged, lyophilized perfectly. COA matched what was listed on the site. Will reorder.` },
                    { name: 'J.M.', rating: 5, date: 'Feb 2026', text: `Third order now. Consistent purity batch to batch. Fast shipping, discreet packaging. Nocta is my go-to supplier.` },
                    { name: 'A.T.', rating: 4, date: 'Jan 2026', text: `Good product, fast dispatch. ${product.name} reconstituted easily with BAC water. Purity looks solid based on COA.` },
                  ].map((review, i) => (
                    <div key={i} className="p-4 rounded-lg" style={{ background: 'rgba(0,184,255,0.03)', border: '1px solid rgba(0,184,255,0.07)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0,184,255,0.15)', color: '#00b8ff' }}>{review.name[0]}</div>
                          <span className="text-sm font-medium" style={{ color: '#dff0ff' }}>{review.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= review.rating ? 'star-gold fill-current' : ''} style={{ color: s <= review.rating ? undefined : 'rgba(223,240,255,0.2)' }} />)}</div>
                          <span className="text-xs" style={{ color: 'rgba(223,240,255,0.3)' }}>{review.date}</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(223,240,255,0.55)' }}>{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Frequently Bought Together */}
        {(product.id === 'bpc-157' || product.id === 'tb-500' || product.id === 'wolverine-blend') && (() => {
          const pairs: Record<string, string[]> = {
            'bpc-157': ['tb-500', 'bac-water'],
            'tb-500': ['bpc-157', 'bac-water'],
            'wolverine-blend': ['bac-water', 'nad-plus'],
          };
          const pairIds = pairs[product.id] || [];
          const pairProducts = pairIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
          if (!pairProducts.length) return null;
          return (
            <div className="mb-16">
              <h2 className="text-xl font-bold mb-6" style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}>
                Frequently Bought Together
              </h2>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 p-4 rounded-xl" style={{ background: '#0c1228', border: '1px solid rgba(0,184,255,0.15)' }}>
                  <img src={product.imageCompressed} alt={product.name} className="w-14 h-14 object-contain rounded-lg" style={{ background: '#080d1a' }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#dff0ff' }}>{product.name}</p>
                    <p className="text-xs" style={{ color: '#00b8ff' }}>${product.variants[0].price.toFixed(2)}</p>
                  </div>
                </div>
                {pairProducts.map(p => p && (
                  <span key={p.id} style={{ color: 'rgba(0,184,255,0.5)', fontSize: '20px' }}>+</span>
                ))}
                {pairProducts.map(p => p && (
                  <div key={p.id} className="flex items-center gap-2 p-4 rounded-xl" style={{ background: '#0c1228', border: '1px solid rgba(0,184,255,0.15)' }}>
                    <img src={p.imageCompressed} alt={p.name} className="w-14 h-14 object-contain rounded-lg" style={{ background: '#080d1a' }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#dff0ff' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: '#00b8ff' }}>${p.variants[0].price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    pairProducts.forEach(p => p && addItem(p, p.variants[0].dose, p.variants[0].price));
                  }}
                  className="btn-navy px-5 py-3 rounded-lg text-sm font-semibold"
                >
                  Add All to Cart
                </button>
              </div>
            </div>
          );
        })()}

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#dff0ff', fontFamily: "'Space Grotesk',sans-serif" }}>Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
