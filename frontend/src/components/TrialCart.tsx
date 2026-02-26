import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAppContext } from '../contexts/AppContext';
import { X, ArrowRight, ShoppingBag } from 'lucide-react';

export default function TrialCart() {
  const { trialCartItems, removeFromTrialCart } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag size={18} className="text-purple-300" />
          <h3 className="font-semibold text-white text-sm">Trial Cart</h3>
        </div>
        <div
          className="text-xs px-2 py-0.5 rounded-full font-bold"
          style={{
            background: trialCartItems.length >= 5
              ? 'rgba(244, 114, 182, 0.2)'
              : 'rgba(192, 132, 252, 0.2)',
            border: `1px solid ${trialCartItems.length >= 5 ? 'rgba(244,114,182,0.4)' : 'rgba(192,132,252,0.4)'}`,
            color: trialCartItems.length >= 5 ? '#f472b6' : '#c084fc',
          }}
        >
          {trialCartItems.length}/5
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(trialCartItems.length / 5) * 100}%`,
            background: 'linear-gradient(90deg, #c084fc, #60a5fa, #f472b6)',
          }}
        />
      </div>

      {/* Items */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-0">
        {trialCartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <ShoppingBag size={32} className="text-white/20 mb-3" />
            <p className="text-white/30 text-xs">No items yet</p>
            <p className="text-white/20 text-xs mt-1">Add up to 5 items</p>
          </div>
        ) : (
          trialCartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden"
                style={{ background: 'rgba(192,132,252,0.1)' }}
              >
                <img
                  src={`https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop&q=80`}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{item.product.name}</p>
                <p className="text-xs text-white/40">Size: {item.selectedSize}</p>
              </div>
              <button
                onClick={() => removeFromTrialCart(item.id)}
                className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Send to Trial Hub */}
      {trialCartItems.length > 0 && (
        <button
          onClick={() => navigate({ to: '/trial-hub' })}
          className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 btn-glow"
          style={{
            background: 'linear-gradient(135deg, rgba(192,132,252,0.4), rgba(96,165,250,0.4))',
            border: '1px solid rgba(192,132,252,0.5)',
            color: 'white',
          }}
        >
          Send to Trial Hub
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
