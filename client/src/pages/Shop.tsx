// NOCTA PEPTIDES — Shop Page (Visual Redesign)
// All filter/search/cart logic preserved. Only visual design changed.

import { useState, useEffect } from 'react';
import { useSearch } from 'wouter';
import { Search } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

const BLUE = '#00b8ff';
const BG = '#05080f';
const SURFACE = '#080d1a';

export default function Shop() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCategory = params.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState<string[]>([initialCategory]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('best-selling');

  useEffect(() => {
    const p = new URLSearchParams(search);
    setActiveCategory([p.get('category') || 'all']);
  }, [search]);

  const categoryProducts = activeCategory.includes('all')
    ? PRODUCTS
    : PRODUCTS.filter(p => activeCategory.includes(p.category));

  const filtered = searchQuery
    ? categoryProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categoryProducts;

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'price-asc') return a.variants[0].price - b.variants[0].price;
    if (sortOrder === 'price-desc') return b.variants[0].price - a.variants[0].price;
    return 0;
  });

  const mainProducts = sorted.filter(p => p.category !== 'accessories');

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'rgba(0, 184, 255, 0.6)', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Nocta Peptides
          </p>
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: '#dff0ff', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Research Compounds
          </h1>
          <p className="text-sm mt-2" style={{ color: 'rgba(223, 240, 255, 0.4)' }}>
            {PRODUCTS.length} products · All third-party tested · COA available
          </p>
        </div>

        {/* Search + Sort */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative max-w-md flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(0, 184, 255, 0.5)' }} />
            <input
              type="text"
              placeholder="Search compounds..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg transition-all duration-200"
              style={{
                background: 'rgba(12, 18, 40, 0.8)',
                border: '1px solid rgba(0, 184, 255, 0.12)',
                color: '#dff0ff',
                fontFamily: "'Inter', sans-serif",
                outline: 'none',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(0, 184, 255, 0.4)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 184, 255, 0.08)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(0, 184, 255, 0.12)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-lg"
            style={{
              background: 'rgba(12,18,40,0.8)',
              border: '1px solid rgba(0,184,255,0.12)',
              color: 'rgba(223,240,255,0.7)',
              fontFamily: "'Space Grotesk',sans-serif",
              outline: 'none',
            }}
          >
            <option value="best-selling">Best Selling</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSearchQuery('');
                  if (cat.id === 'all') {
                    setActiveCategory(['all']);
                  } else {
                    setActiveCategory(prev => {
                      const without = prev.filter(c => c !== 'all');
                      if (without.includes(cat.id)) {
                        const next = without.filter(c => c !== cat.id);
                        return next.length === 0 ? ['all'] : next;
                      } else {
                        return [...without, cat.id];
                      }
                    });
                  }
                }}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: isActive
                    ? 'rgba(0, 184, 255, 0.15)'
                    : 'rgba(12, 18, 40, 0.8)',
                  color: isActive
                    ? BLUE
                    : 'rgba(223, 240, 255, 0.5)',
                  border: isActive
                    ? '1px solid rgba(0, 184, 255, 0.35)'
                    : '1px solid rgba(0, 184, 255, 0.08)',
                  boxShadow: isActive
                    ? '0 0 12px rgba(0, 184, 255, 0.15)'
                    : 'none',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <p className="text-xs mb-5" style={{ color: 'rgba(223, 240, 255, 0.35)' }}>
          Showing {sorted.length} product{sorted.length !== 1 ? 's' : ''}
          {!activeCategory.includes('all') && activeCategory.length === 1 && ` in ${CATEGORIES.find(c => c.id === activeCategory[0])?.label}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>

        {/* Product Grid */}
        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium" style={{ color: 'rgba(223, 240, 255, 0.4)' }}>
              No products found
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(223, 240, 255, 0.25)' }}>
              Try a different search or category
            </p>
            <button
              onClick={() => { setActiveCategory(['all']); setSearchQuery(''); }}
              className="mt-4 btn-navy px-5 py-2 rounded-md text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {mainProducts.map(product => (
                product.isBlend ? (
                  <div key={product.id} className="relative" style={{ gridColumn: 'span 1' }}>
                    <div className="absolute -inset-[1px] rounded-xl pointer-events-none z-10" style={{ background: 'linear-gradient(135deg, rgba(0,184,255,0.25) 0%, rgba(0,100,200,0.15) 100%)', borderRadius: '13px' }} />
                    <div className="absolute top-2 left-2 z-20">
                      <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full" style={{ background: '#00b8ff', color: '#05080f' }}>Premium Blend</span>
                    </div>
                    <ProductCard product={product} />
                  </div>
                ) : (
                  <ProductCard key={product.id} product={product} />
                )
              ))}
            </div>

            {(activeCategory.includes('all') || activeCategory.includes('accessories')) && (() => {
              const accessories = PRODUCTS.filter(p => p.category === 'accessories');
              return accessories.length > 0 ? (
                <div className="mt-12">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="blue-rule" style={{ flex: 1 }} />
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(0,184,255,0.5)', fontFamily: "'Space Grotesk',sans-serif", whiteSpace: 'nowrap' }}>Research Accessories</p>
                    <div className="blue-rule" style={{ flex: 1 }} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {accessories.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                </div>
              ) : null;
            })()}
          </>
        )}
      </div>
    </div>
  );
}
