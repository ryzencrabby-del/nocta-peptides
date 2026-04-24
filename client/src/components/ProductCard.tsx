// NOCTA PEPTIDES — Product Card
// Dark glassmorphism card, blue glow on hover, all cart logic preserved

import { useState } from 'react';
import { Link } from 'wouter';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const variant = product.variants[selectedVariant];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, variant.dose, variant.price);
  };

  return (
    <div className="product-card rounded-xl overflow-hidden group">
      <Link href={`/product/${product.id}`}>
        {/* Image */}
        <div
          className="relative aspect-square overflow-hidden"
          style={{ background: 'rgba(8, 13, 26, 0.9)' }}
        >
          <img
            src={product.imageCompressed}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-108"
            style={{ transform: 'scale(1)', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
            loading="lazy"
          />
          {/* Subtle blue vignette on image hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 184, 255, 0.06) 100%)' }}
          />
          {product.tags?.includes('bestseller') && (
            <div
              className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(0, 184, 255, 0.15)',
                color: '#00b8ff',
                border: '1px solid rgba(0, 184, 255, 0.3)',
                fontFamily: "'Space Grotesk', sans-serif",
                backdropFilter: 'blur(8px)',
              }}
            >
              Bestseller
            </div>
          )}
          {product.isBlend && (
            <div
              className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(245, 166, 35, 0.15)',
                color: '#F5A623',
                border: '1px solid rgba(245, 166, 35, 0.3)',
                fontFamily: "'Space Grotesk', sans-serif",
                backdropFilter: 'blur(8px)',
              }}
            >
              Blend
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(0, 184, 255, 0.07)' }}>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              className="font-bold text-sm leading-tight"
              style={{ color: '#dff0ff', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {product.name}
            </h3>
            <span className="purity-badge flex-shrink-0">{product.purity}</span>
          </div>

          <p
            className="text-xs leading-relaxed mb-3 line-clamp-2"
            style={{ color: 'rgba(223, 240, 255, 0.42)' }}
          >
            {product.shortDesc}
          </p>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[1,2,3,4,5].map(i => (
              <Star
                key={i}
                size={10}
                className={i <= Math.round(product.rating || 5) ? 'star-gold fill-current' : ''}
                style={{ color: i <= Math.round(product.rating || 5) ? '#F5A623' : 'rgba(223, 240, 255, 0.15)' }}
              />
            ))}
            <span className="text-[10px] ml-1" style={{ color: 'rgba(223, 240, 255, 0.35)' }}>
              ({product.rating || 5.0})
            </span>
          </div>

          {/* Dosage selector */}
          {product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.variants.map((v, idx) => (
                <button
                  key={v.dose}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedVariant(idx); }}
                  className={`dosage-pill text-xs ${idx === selectedVariant ? 'selected' : ''}`}
                >
                  {v.dose}
                </button>
              ))}
            </div>
          )}

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between">
            <span
              className="font-bold text-base"
              style={{ color: '#dff0ff', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {product.variants.length > 1 && selectedVariant === 0
                ? `From $${Math.min(...product.variants.map(v => v.price)).toFixed(2)}`
                : `$${variant.price.toFixed(2)}`}
            </span>
            <button
              onClick={handleAddToCart}
              className="btn-navy flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs"
            >
              <ShoppingCart size={12} />
              Add
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
