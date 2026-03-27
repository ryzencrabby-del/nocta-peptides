// NOCTA PEPTIDES — Shop Page
// Category filter tabs, search bar, 4-col product grid

import { useState, useEffect } from 'react';
import { useSearch } from 'wouter';
import { Search } from 'lucide-react';
import { PRODUCTS, CATEGORIES, getProductsByCategory } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Nocta Peptides</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A3A4A] tracking-tight">Research Compounds</h1>
          <p className="text-gray-500 text-sm mt-2">
            {PRODUCTS.length} products · All third-party tested · COA available
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search compounds..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#1A3A4A] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-400 mb-5">
          Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'all' && ` in ${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg font-medium">No products found</p>
            <p className="text-gray-300 text-sm mt-1">Try a different search or category</p>
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
