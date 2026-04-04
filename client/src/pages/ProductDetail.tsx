// NOCTA PEPTIDES — Product Detail Page
// Large image left, details right, dosage pills, add to cart, description, blend components

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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Product not found</p>
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/shop" className="hover:text-[#1A3A4A] flex items-center gap-1 transition-colors">
            <ChevronLeft size={12} /> Shop
          </Link>
          <span>/</span>
          <span className="text-gray-600">{product.name}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="bg-gray-50 rounded-2xl aspect-square flex items-center justify-center p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details */}
          <div>
            {/* Category badge */}
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#1A3A4A] bg-[#1A3A4A]/5 px-3 py-1 rounded-full mb-3">
              {product.category.replace('-', ' ')}
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A3A4A] tracking-tight mb-2">
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-1.5 mb-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={14} className={`${i <= Math.round(product.rating || 5) ? 'star-gold fill-current' : 'text-gray-200'}`} />
              ))}
              <span className="text-gray-400 text-sm ml-1">{product.rating || 5.0} · {product.reviewCount || 48} reviews</span>
            </div>

            {/* Purity badge */}
            <div className="flex items-center gap-2 mb-5">
              <span className="purity-badge text-sm px-3 py-1">{product.purity} Purity</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">COA Available</span>
              {product.isBlend && (
                <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">Blend</span>
              )}
            </div>

            <p className="text-gray-600 text-base leading-relaxed mb-6">{product.description}</p>

            {/* Blend components */}
            {product.isBlend && product.blendComponents && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Blend Components</p>
                <div className="flex flex-wrap gap-2">
                  {product.blendComponents.map(comp => (
                    <span key={comp} className="text-xs bg-white border border-gray-200 text-[#1A3A4A] px-3 py-1 rounded-full font-medium">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dosage Selector */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Select Dosage</p>
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
              <span className="text-3xl font-extrabold text-[#1A3A4A]">${variant.price.toFixed(2)}</span>
              <span className="text-sm text-gray-400">{variant.dose}</span>
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
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              <div className="flex flex-col items-center gap-1 text-center">
                <Shield size={16} className="text-[#1A3A4A]" />
                <p className="text-[10px] text-gray-400 font-medium">3rd Party Tested</p>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <FileText size={16} className="text-[#1A3A4A]" />
                <p className="text-[10px] text-gray-400 font-medium">COA Available</p>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <Package size={16} className="text-[#1A3A4A]" />
                <p className="text-[10px] text-gray-400 font-medium">48hr Dispatch</p>
              </div>
            </div>

            {/* COA link */}
            <div className="mt-4">
              <Link href="/coa" className="text-sm text-[#1A3A4A] underline underline-offset-2 hover:no-underline">
                View Certificate of Analysis →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-[#1A3A4A] mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
