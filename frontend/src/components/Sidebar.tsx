import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Home, ShoppingBag, Package, Scan, Shirt, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/shop', label: 'Shop', icon: ShoppingBag },
  { path: '/trial-hub', label: 'Trial Hub', icon: Package },
  { path: '/body-scan', label: 'Body Scan', icon: Scan },
  { path: '/wardrobe', label: 'Wardrobe AI', icon: Shirt },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 transition-all duration-300',
        expanded ? 'w-48' : 'w-14'
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="glass-card rounded-2xl p-2 flex flex-col gap-1">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #c084fc, #60a5fa)' }}>
            <Zap size={16} className="text-white" />
          </div>
          {expanded && (
            <span className="font-orbitron text-xs font-bold gradient-text whitespace-nowrap overflow-hidden">
              FitVerse
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px mx-2 mb-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.3), transparent)' }} />

        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                  style={{ background: 'linear-gradient(180deg, #c084fc, #60a5fa)' }}
                />
              )}
              <Icon
                size={18}
                className={cn(
                  'flex-shrink-0 transition-all duration-200',
                  isActive ? 'text-purple-300' : 'group-hover:text-purple-300'
                )}
              />
              {expanded && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                  {label}
                </span>
              )}
              {isActive && expanded && (
                <ChevronRight size={12} className="ml-auto text-purple-300 flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
