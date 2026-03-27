// NOCTA PEPTIDES — Product Card
// Used in shop grid and featured sections
// White card, hover lift, purity badge, add to cart

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
    <div className="product-card bg-white rounded-xl border border-gray-100 overflow-hidden group">
      <Link href={`/product/${product.id}`}>
        {/* Image */}
        <div className="relative bg-gray-50 aspect-square overflow-hidden">
          <img
            src={product.imageCompressed}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.tags?.includes('bestseller') && (
            <div className="absolute top-3 left-3 bg-[#1A3A4A] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Bestseller
            </div>
          )}
          {product.isBlend && (
            <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Blend
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-[#1A3A4A] text-sm leading-tight">{product.name}</h3>
            <span className="purity-badge flex-shrink-0">{product.purity}</span>
          </div>

          <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{product.shortDesc}</p>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={10} className="star-gold fill-current" />
            ))}
            <span className="text-gray-400 text-[10px] ml-1">(5.0)</span>
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
            <span className="font-bold text-[#1A3A4A] text-base">${variant.price.toFixed(2)}</span>
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
