// NOCTA PEPTIDES — Shop Page (Visual Redesign)
// All filter/search/cart logic preserved. Only visual design changed.

import { useState, useEffect } from 'react';
import { useSearch } from 'wouter';
import { Search } from 'lucide-react';
import { PRODUCTS, CATEGORIES, getProductsByCategory } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

const BLUE = '#00b8ff';
const BG = '#05080f';
const SURFACE = '#080d1a';

export default function Shop() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCategory = params.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const p = new URLSearchParams(search);
    setActiveCategory(p.get('category') || 'all');
  }, [search]);

  const categoryProducts = getProductsByCategory(activeCategory);
  const filtered = searchQuery
    ? categoryProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categoryProducts;

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

        {/* Search */}
        <div className="relative mb-6 max-w-md">
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

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: activeCategory === cat.id
                  ? 'rgba(0, 184, 255, 0.15)'
                  : 'rgba(12, 18, 40, 0.8)',
                color: activeCategory === cat.id
                  ? BLUE
                  : 'rgba(223, 240, 255, 0.5)',
                border: activeCategory === cat.id
                  ? '1px solid rgba(0, 184, 255, 0.35)'
                  : '1px solid rgba(0, 184, 255, 0.08)',
                boxShadow: activeCategory === cat.id
                  ? '0 0 12px rgba(0, 184, 255, 0.15)'
                  : 'none',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs mb-5" style={{ color: 'rgba(223, 240, 255, 0.35)' }}>
          Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'all' && ` in ${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium" style={{ color: 'rgba(223, 240, 255, 0.4)' }}>
              No products found
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(223, 240, 255, 0.25)' }}>
              Try a different search or category
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="mt-4 btn-navy px-5 py-2 rounded-md text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
