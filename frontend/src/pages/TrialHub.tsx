import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAppContext } from '../contexts/AppContext';
import { Check, X, Package, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type ItemStatus = 'neutral' | 'kept' | 'returned';

interface TrialItemState {
  id: string;
  status: ItemStatus;
  animating: boolean;
}

const categoryImages: Record<string, string> = {
  Shirts: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop&q=80',
  Pants: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop&q=80',
  Tops: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&h=300&fit=crop&q=80',
  Jackets: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop&q=80',
  Shorts: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=300&h=300&fit=crop&q=80',
  Dresses: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop&q=80',
  Kurtas: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=300&fit=crop&q=80',
  Jeans: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop&q=80',
  'T-Shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&q=80',
};

export default function TrialHub() {
  const navigate = useNavigate();
  const { trialCartItems } = useAppContext();
  const [itemStates, setItemStates] = useState<TrialItemState[]>(
    trialCartItems.map((item) => ({ id: item.id, status: 'neutral', animating: false }))
  );

  const updateItemStatus = (id: string, status: ItemStatus) => {
    setItemStates((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status, animating: true } : s
      )
    );
    setTimeout(() => {
      setItemStates((prev) =>
        prev.map((s) => (s.id === id ? { ...s, animating: false } : s))
      );
    }, 600);
  };

  const keptCount = itemStates.filter((s) => s.status === 'kept').length;
  const returnedCount = itemStates.filter((s) => s.status === 'returned').length;
  const pendingCount = itemStates.filter((s) => s.status === 'neutral').length;

  return (
    <div className="min-h-screen page-transition">
      <div className="max-w-5xl mx-auto px-6 py-8 pl-24">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate({ to: '/shop' })}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-4"
          >
            <ArrowLeft size={14} />
            Back to Shop
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(192,132,252,0.3), rgba(96,165,250,0.3))', border: '1px solid rgba(192,132,252,0.4)' }}
            >
              <Package size={16} className="text-purple-300" />
            </div>
            <h1 className="font-orbitron text-2xl font-bold gradient-text">Trial Hub</h1>
          </div>
          <p className="text-white/40 text-sm">Review your trial items and decide what to keep</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pending', count: pendingCount, color: '#c084fc', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.3)' },
            { label: 'Purchased', count: keptCount, color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)' },
            { label: 'Returned', count: returnedCount, color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
          ].map(({ label, count, color, bg, border }) => (
            <div
              key={label}
              className="glass-card rounded-2xl p-4 text-center"
              style={{ background: bg, borderColor: border }}
            >
              <div className="font-orbitron text-3xl font-bold" style={{ color }}>{count}</div>
              <div className="text-xs text-white/50 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {trialCartItems.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <ShoppingBag size={48} className="text-white/20 mx-auto mb-4" />
            <h3 className="text-white/50 font-semibold mb-2">No items in trial</h3>
            <p className="text-white/30 text-sm mb-6">Add items from the shop to try them here</p>
            <button
              onClick={() => navigate({ to: '/shop' })}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white btn-glow"
              style={{
                background: 'linear-gradient(135deg, rgba(192,132,252,0.3), rgba(96,165,250,0.3))',
                border: '1px solid rgba(192,132,252,0.4)',
              }}
            >
              Go to Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trialCartItems.map((item) => {
              const state = itemStates.find((s) => s.id === item.id);
              const status = state?.status || 'neutral';
              const animating = state?.animating || false;
              const imageUrl = categoryImages[item.product.category] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&q=80';

              return (
                <div
                  key={item.id}
                  className={cn(
                    'glass-card rounded-2xl overflow-hidden transition-all duration-500',
                    animating && 'scale-105',
                    status === 'kept' && 'ring-2 ring-green-400/50',
                    status === 'returned' && 'ring-2 ring-red-400/50'
                  )}
                  style={
                    status === 'kept'
                      ? { background: 'rgba(74, 222, 128, 0.08)', borderColor: 'rgba(74,222,128,0.3)' }
                      : status === 'returned'
                      ? { background: 'rgba(248, 113, 113, 0.08)', borderColor: 'rgba(248,113,113,0.3)' }
                      : {}
                  }
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Status overlay */}
                    {status !== 'neutral' && (
                      <div
                        className={cn(
                          'absolute inset-0 flex items-center justify-center',
                          animating && 'animate-bounce-in'
                        )}
                        style={{
                          background: status === 'kept' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)',
                        }}
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{
                            background: status === 'kept' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)',
                            border: `2px solid ${status === 'kept' ? '#4ade80' : '#f87171'}`,
                          }}
                        >
                          {status === 'kept' ? (
                            <Check size={32} className="text-green-400" />
                          ) : (
                            <X size={32} className="text-red-400" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status badge */}
                    {status !== 'neutral' && (
                      <div
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                        style={
                          status === 'kept'
                            ? { background: 'rgba(74,222,128,0.3)', border: '1px solid rgba(74,222,128,0.5)', color: '#4ade80' }
                            : { background: 'rgba(248,113,113,0.3)', border: '1px solid rgba(248,113,113,0.5)', color: '#f87171' }
                        }
                      >
                        {status === 'kept' ? '✓ Purchased' : '✗ Returned'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-1">{item.product.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-white/40">Size: <span className="text-white/70 font-medium">{item.selectedSize}</span></span>
                      <span className="text-sm font-bold gradient-text">${item.product.price.toFixed(2)}</span>
                    </div>

                    {/* Action buttons */}
                    {status === 'neutral' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateItemStatus(item.id, 'kept')}
                          className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-[1.02]"
                          style={{
                            background: 'rgba(74,222,128,0.15)',
                            border: '1px solid rgba(74,222,128,0.4)',
                            color: '#4ade80',
                          }}
                        >
                          <Check size={14} />
                          Keep
                        </button>
                        <button
                          onClick={() => updateItemStatus(item.id, 'returned')}
                          className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-[1.02]"
                          style={{
                            background: 'rgba(248,113,113,0.15)',
                            border: '1px solid rgba(248,113,113,0.4)',
                            color: '#f87171',
                          }}
                        >
                          <X size={14} />
                          Return
                        </button>
                      </div>
                    ) : (
                      <div
                        className="py-2.5 rounded-xl text-sm font-semibold text-center"
                        style={
                          status === 'kept'
                            ? { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: 'rgba(74,222,128,0.7)' }
                            : { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: 'rgba(248,113,113,0.7)' }
                        }
                      >
                        {status === 'kept' ? 'Decision: Keep' : 'Decision: Return'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {keptCount > 0 && (
          <div
            className="mt-8 p-6 rounded-2xl flex items-center justify-between"
            style={{
              background: 'rgba(74,222,128,0.08)',
              border: '1px solid rgba(74,222,128,0.2)',
            }}
          >
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-green-400" />
              <div>
                <p className="text-white font-semibold text-sm">
                  {keptCount} item{keptCount > 1 ? 's' : ''} purchased!
                </p>
                <p className="text-white/40 text-xs">
                  Total: ${trialCartItems
                    .filter((item) => itemStates.find((s) => s.id === item.id)?.status === 'kept')
                    .reduce((sum, item) => sum + item.product.price, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
            <div className="text-green-400 font-orbitron text-sm font-bold">
              ✓ Confirmed
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
