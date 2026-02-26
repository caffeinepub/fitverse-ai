import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Shirt, Camera, BarChart3, CheckCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';

type ScanState = 'idle' | 'scanning' | 'complete';

const mockWardrobeData = {
  tops: 12,
  jeans: 5,
  dresses: 3,
  jackets: 4,
  colorDistribution: [
    { color: 'Pink', count: 5, hex: '#f472b6' },
    { color: 'Blue', count: 8, hex: '#60a5fa' },
    { color: 'Black', count: 6, hex: '#6b7280' },
    { color: 'White', count: 4, hex: '#e5e7eb' },
    { color: 'Purple', count: 3, hex: '#c084fc' },
  ],
};

const chartConfig = {
  count: { label: 'Items', color: '#c084fc' },
};

export default function Wardrobe() {
  const { setWardrobeData } = useAppContext();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [progress, setProgress] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);

  const startScan = () => {
    if (scanState !== 'idle') return;
    setScanState('scanning');
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 3;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        setScanState('complete');
        setShowDashboard(true);
        setWardrobeData({ ...mockWardrobeData, scanned: true });
      }
    }, 60);
  };

  const categoryStats = [
    { label: 'Tops', count: mockWardrobeData.tops, color: '#c084fc', icon: '👕' },
    { label: 'Jeans', count: mockWardrobeData.jeans, color: '#60a5fa', icon: '👖' },
    { label: 'Dresses', count: mockWardrobeData.dresses, color: '#f472b6', icon: '👗' },
    { label: 'Jackets', count: mockWardrobeData.jackets, color: '#22d3ee', icon: '🧥' },
  ];

  return (
    <div className="min-h-screen page-transition">
      <div className="max-w-5xl mx-auto px-6 py-8 pl-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(244,114,182,0.3), rgba(192,132,252,0.3))',
                border: '1px solid rgba(244,114,182,0.4)',
              }}
            >
              <Shirt size={16} className="text-pink-300" />
            </div>
            <h1
              className="font-orbitron text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #f472b6, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Wardrobe AI
            </h1>
          </div>
          <p className="text-white/40 text-sm">Intelligent wardrobe analysis and outfit recommendations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner UI */}
          <div className="flex flex-col gap-4">
            <div
              className="relative rounded-3xl overflow-hidden flex flex-col items-center justify-center"
              style={{
                background: 'rgba(10, 5, 25, 0.8)',
                border: '1px solid rgba(244, 114, 182, 0.2)',
                minHeight: '320px',
              }}
            >
              {/* Wardrobe icon */}
              <div className="relative z-10 flex flex-col items-center gap-4 p-8">
                <div
                  className={cn(
                    'w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-300',
                    scanState === 'scanning' && 'animate-pulse'
                  )}
                  style={{
                    background: 'rgba(244,114,182,0.1)',
                    border: '1px solid rgba(244,114,182,0.3)',
                  }}
                >
                  <img
                    src="/assets/generated/wardrobe-icon.dim_128x128.png"
                    alt="Wardrobe"
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {scanState === 'idle' && (
                  <div className="text-center">
                    <p className="text-white/60 text-sm font-medium">Ready to scan your wardrobe</p>
                    <p className="text-white/30 text-xs mt-1">AI will analyze your clothing collection</p>
                  </div>
                )}

                {scanState === 'scanning' && (
                  <div className="text-center w-full max-w-xs">
                    <p className="text-pink-300 text-sm font-medium mb-3">Analyzing wardrobe...</p>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-100"
                        style={{
                          width: `${progress}%`,
                          background: 'linear-gradient(90deg, #f472b6, #c084fc)',
                        }}
                      />
                    </div>
                    <p className="text-white/40 text-xs mt-2">{progress}% complete</p>
                  </div>
                )}

                {scanState === 'complete' && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                      <CheckCircle size={18} />
                      <span className="text-sm font-semibold">Scan Complete!</span>
                    </div>
                    <p className="text-white/40 text-xs">Wardrobe data loaded</p>
                  </div>
                )}
              </div>

              {/* Scanning animation rings */}
              {scanState === 'scanning' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border animate-scan-ring"
                      style={{
                        width: `${i * 80}px`,
                        height: `${i * 80}px`,
                        borderColor: 'rgba(244,114,182,0.3)',
                        animationDelay: `${i * 0.4}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Corner brackets */}
              {(
                [
                  ['top-4 left-4', true, false, true, false],
                  ['top-4 right-4', true, false, false, true],
                  ['bottom-4 left-4', false, true, true, false],
                  ['bottom-4 right-4', false, true, false, true],
                ] as [string, boolean, boolean, boolean, boolean][]
              ).map(([pos, bt, bb, bl, br], i) => (
                <div
                  key={i}
                  className={`absolute w-6 h-6 ${pos}`}
                  style={{
                    borderTop: bt ? '2px solid rgba(244,114,182,0.5)' : 'none',
                    borderBottom: bb ? '2px solid rgba(244,114,182,0.5)' : 'none',
                    borderLeft: bl ? '2px solid rgba(244,114,182,0.5)' : 'none',
                    borderRight: br ? '2px solid rgba(244,114,182,0.5)' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Scan button */}
            <button
              onClick={startScan}
              disabled={scanState !== 'idle'}
              className={cn(
                'w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-300',
                scanState === 'idle' ? 'btn-glow-pink' : 'opacity-50 cursor-not-allowed'
              )}
              style={{
                background:
                  scanState === 'idle'
                    ? 'linear-gradient(135deg, rgba(244,114,182,0.4), rgba(192,132,252,0.4))'
                    : 'rgba(255,255,255,0.05)',
                border: `1px solid ${scanState === 'idle' ? 'rgba(244,114,182,0.5)' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {scanState === 'idle' ? (
                <>
                  <Camera size={18} />
                  Start Wardrobe Scan
                </>
              ) : scanState === 'scanning' ? (
                <>
                  <Zap size={18} className="animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Scan Complete
                </>
              )}
            </button>

            {/* AI Insight hint */}
            {scanState === 'complete' && (
              <div
                className="p-4 rounded-2xl text-sm"
                style={{
                  background: 'rgba(244,114,182,0.08)',
                  border: '1px solid rgba(244,114,182,0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-pink-300" />
                  <span className="text-pink-300 font-semibold text-xs">AI Wardrobe Insight</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">
                  You own <span className="text-pink-300 font-semibold">5 pink tops</span>. When shopping, you'll be
                  notified if you're about to buy a similar item.
                </p>
              </div>
            )}
          </div>

          {/* Analytics Dashboard */}
          <div className="flex flex-col gap-4">
            {showDashboard ? (
              <>
                {/* Category stats */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 size={16} className="text-pink-300" />
                    Wardrobe Breakdown
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categoryStats.map(({ label, count, color, icon }, i) => (
                      <div
                        key={label}
                        className="p-3 rounded-xl"
                        style={{
                          background: `${color}10`,
                          border: `1px solid ${color}30`,
                          animation: `fadeSlideIn 0.4s ease-out ${i * 100}ms both`,
                        }}
                      >
                        <div className="text-xl mb-1">{icon}</div>
                        <div className="text-xs text-white/50 mb-0.5">{label}</div>
                        <div className="font-bold text-lg" style={{ color }}>
                          {count}
                        </div>
                        <div className="text-xs text-white/30">items</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color distribution chart */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-purple-300" />
                    Color Distribution
                  </h3>
                  <ChartContainer config={chartConfig} className="h-40 w-full">
                    <BarChart
                      data={mockWardrobeData.colorDistribution}
                      margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
                    >
                      <XAxis
                        dataKey="color"
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {mockWardrobeData.colorDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.hex} opacity={0.85} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>

                  {/* Color legend */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {mockWardrobeData.colorDistribution.map(({ color, hex, count }) => (
                      <div key={color} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: hex }} />
                        <span className="text-xs text-white/50">
                          {color} ({count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total summary */}
                <div
                  className="glass-card rounded-2xl p-4 flex items-center justify-between"
                  style={{
                    background: 'linear-gradient(135deg, rgba(244,114,182,0.08), rgba(192,132,252,0.08))',
                    border: '1px solid rgba(244,114,182,0.2)',
                  }}
                >
                  <div>
                    <p className="text-white/50 text-xs mb-0.5">Total Items</p>
                    <p className="font-orbitron text-2xl font-bold gradient-text">
                      {mockWardrobeData.tops +
                        mockWardrobeData.jeans +
                        mockWardrobeData.dresses +
                        mockWardrobeData.jackets}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-xs mb-0.5">Unique Colors</p>
                    <p className="font-orbitron text-2xl font-bold" style={{ color: '#f472b6' }}>
                      {mockWardrobeData.colorDistribution.length}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Idle placeholder */
              <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: 'rgba(244,114,182,0.1)',
                    border: '1px solid rgba(244,114,182,0.2)',
                  }}
                >
                  <BarChart3 size={28} className="text-pink-300/40" />
                </div>
                <p className="text-white/30 text-sm font-medium">Analytics Dashboard</p>
                <p className="text-white/20 text-xs mt-1">Scan your wardrobe to see insights</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-white/5 text-center">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} FitVerse AI. Built with{' '}
            <span className="text-pink-400">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname || 'fitverse-ai'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
