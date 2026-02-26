import React, { useState } from 'react';
import { Product } from '../backend';
import { TrialCartItem } from '../contexts/AppContext';
import { ShoppingBag, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  cartFull: boolean;
  onAddToTrial: (item: TrialCartItem) => void;
  onSizeWarning?: (size: string) => void;
  recommendedSize?: string;
  onWardrobeWarning?: (product: Product) => void;
  wardrobeScanned?: boolean;
}

const categoryImages: Record<string, string> = {
  Shirts: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&q=80',
  Pants: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&q=80',
  Tops: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop&q=80',
  Jackets: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&q=80',
  Shorts: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&h=400&fit=crop&q=80',
  Dresses: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&q=80',
  Kurtas: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=400&fit=crop&q=80',
  Jeans: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&q=80',
  'T-Shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80',
};

const fallbackImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80';

export default function ProductCard({
  product,
  isInCart,
  cartFull,
  onAddToTrial,
  onSizeWarning,
  recommendedSize,
  onWardrobeWarning,
  wardrobeScanned,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const confidence = Number(product.fitConfidence);
  const imageUrl = categoryImages[product.category] || fallbackImage;

  const confidenceColor =
    confidence >= 85 ? '#4ade80' : confidence >= 70 ? '#facc15' : '#f87171';

  const handleAddToTrial = () => {
    if (cartFull || isInCart) return;

    // Check size warning
    if (recommendedSize && selectedSize !== recommendedSize) {
      onSizeWarning?.(selectedSize);
      return;
    }

    // Check wardrobe warning
    if (wardrobeScanned && (product.category === 'Tops' || product.category === 'T-Shirts')) {
      onWardrobeWarning?.(product);
      return;
    }

    onAddToTrial({
      product,
      selectedSize,
      id: `${product.name}-${Date.now()}`,
    });
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-purple flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              background: 'rgba(192, 132, 252, 0.2)',
              border: '1px solid rgba(192, 132, 252, 0.4)',
              color: '#c084fc',
            }}
          >
            {product.category}
          </span>
        </div>

        {/* Fit confidence badge */}
        <div className="absolute top-3 right-3">
          <div
            className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: `1px solid ${confidenceColor}40`,
              color: confidenceColor,
            }}
          >
            <Zap size={10} />
            {confidence}%
          </div>
        </div>

        {isInCart && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(74, 222, 128, 0.3)', border: '2px solid #4ade80' }}
            >
              <Check size={24} className="text-green-400" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-semibold text-white text-sm leading-tight">{product.name}</h3>
          <p className="text-xs text-white/40 mt-0.5">{product.brand}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold gradient-text">${product.price.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: confidenceColor }} />
            <span className="text-xs text-white/50">AI Fit</span>
          </div>
        </div>

        {/* Size selector */}
        <div>
          <p className="text-xs text-white/40 mb-1.5">Size</p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-lg transition-all duration-200 font-medium',
                  selectedSize === size
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/70'
                )}
                style={
                  selectedSize === size
                    ? {
                        background: 'linear-gradient(135deg, rgba(192,132,252,0.3), rgba(96,165,250,0.3))',
                        border: '1px solid rgba(192,132,252,0.5)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }
                }
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Trial button */}
        <button
          onClick={handleAddToTrial}
          disabled={cartFull || isInCart}
          className={cn(
            'mt-auto w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300',
            isInCart
              ? 'opacity-60 cursor-not-allowed'
              : cartFull
              ? 'opacity-40 cursor-not-allowed'
              : 'btn-glow hover:scale-[1.02]'
          )}
          style={
            isInCart
              ? { background: 'rgba(74, 222, 128, 0.2)', border: '1px solid rgba(74, 222, 128, 0.4)', color: '#4ade80' }
              : cartFull
              ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }
              : { background: 'linear-gradient(135deg, rgba(192,132,252,0.3), rgba(96,165,250,0.3))', border: '1px solid rgba(192,132,252,0.4)', color: 'white' }
          }
        >
          {isInCart ? (
            <>
              <Check size={14} />
              Added to Trial
            </>
          ) : cartFull ? (
            'Trial Full (5/5)'
          ) : (
            <>
              <ShoppingBag size={14} />
              Add to Trial
            </>
          )}
        </button>
      </div>
    </div>
  );
}
