import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Scan, Zap, Activity, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ScanState = 'idle' | 'scanning' | 'complete';

const measurements = [
  { label: 'Shoulder', value: '18 in', icon: '↔', color: '#c084fc' },
  { label: 'Chest', value: '40 in', icon: '⊙', color: '#60a5fa' },
  { label: 'Waist', value: '32 in', icon: '◎', color: '#f472b6' },
  { label: 'Height', value: "5'10\"", icon: '↕', color: '#22d3ee' },
];

export default function BodyScan() {
  const { setBodyScanData } = useAppContext();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [progress, setProgress] = useState(0);
  const [visibleMeasurements, setVisibleMeasurements] = useState<number[]>([]);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const startScan = () => {
    if (scanState !== 'idle') return;
    setScanState('scanning');
    setProgress(0);
    setVisibleMeasurements([]);

    let p = 0;
    progressRef.current = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(progressRef.current!);
        setScanState('complete');
        setBodyScanData({
          shoulder: '18 in',
          chest: '40 in',
          waist: '32 in',
          height: "5'10\"",
          recommendedSize: 'M',
          scanned: true,
        });
        // Reveal measurements one by one
        measurements.forEach((_, i) => {
          setTimeout(() => {
            setVisibleMeasurements((prev) => [...prev, i]);
          }, i * 200);
        });
      }
    }, 50);
  };

  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen page-transition">
      <div className="max-w-5xl mx-auto px-6 py-8 pl-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.3), rgba(34,211,238,0.3))', border: '1px solid rgba(96,165,250,0.4)' }}
            >
              <Scan size={16} className="text-blue-300" />
            </div>
            <h1 className="font-orbitron text-2xl font-bold gradient-text-blue">Body Scan AI</h1>
          </div>
          <p className="text-white/40 text-sm">AI-powered body measurement for perfect fit recommendations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera / Scan UI */}
          <div className="flex flex-col gap-4">
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(10, 5, 25, 0.8)',
                border: '1px solid rgba(96, 165, 250, 0.2)',
                aspectRatio: '2/3',
                maxHeight: '480px',
              }}
            >
              {/* Body illustration */}
              <img
                src="/assets/generated/body-scan-illustration.dim_400x600.png"
                alt="Body Scan"
                className="w-full h-full object-cover opacity-60"
              />

              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(rgba(96,165,250,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.3) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }}
              />

              {/* Corner brackets */}
              {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
                <div
                  key={i}
                  className={`absolute w-8 h-8 ${pos}`}
                  style={{
                    borderTop: i < 2 ? '2px solid rgba(96,165,250,0.8)' : 'none',
                    borderBottom: i >= 2 ? '2px solid rgba(96,165,250,0.8)' : 'none',
                    borderLeft: i % 2 === 0 ? '2px solid rgba(96,165,250,0.8)' : 'none',
                    borderRight: i % 2 === 1 ? '2px solid rgba(96,165,250,0.8)' : 'none',
                  }}
                />
              ))}

              {/* Scan animation */}
              {scanState === 'scanning' && (
                <>
                  {/* Scan line */}
                  <div
                    className="absolute left-0 right-0 h-0.5 scan-line"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.8), rgba(34,211,238,0.8), transparent)',
                      boxShadow: '0 0 10px rgba(96,165,250,0.6)',
                    }}
                  />

                  {/* Pulsing rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="absolute rounded-full border animate-scan-ring"
                        style={{
                          width: `${i * 60}px`,
                          height: `${i * 60}px`,
                          borderColor: 'rgba(96,165,250,0.4)',
                          animationDelay: `${i * 0.3}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Progress overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                  >
                    <div
                      className="h-full transition-all duration-100"
                      style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #60a5fa, #22d3ee)',
                      }}
                    />
                  </div>
                </>
              )}

              {/* Complete overlay */}
              {scanState === 'complete' && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'rgba(96,165,250,0.05)' }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center animate-bounce-in"
                    style={{
                      background: 'rgba(96,165,250,0.2)',
                      border: '2px solid rgba(96,165,250,0.6)',
                    }}
                  >
                    <CheckCircle size={32} className="text-blue-400" />
                  </div>
                </div>
              )}

              {/* Status label */}
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: `1px solid ${scanState === 'complete' ? 'rgba(74,222,128,0.4)' : 'rgba(96,165,250,0.4)'}`,
                  color: scanState === 'complete' ? '#4ade80' : '#60a5fa',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {scanState === 'idle' ? '● Ready to Scan' : scanState === 'scanning' ? `⟳ Scanning... ${progress}%` : '✓ Scan Complete'}
              </div>
            </div>

            {/* Start Scan button */}
            <button
              onClick={startScan}
              disabled={scanState !== 'idle'}
              className={cn(
                'w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-300',
                scanState === 'idle' ? 'btn-glow-blue' : 'opacity-50 cursor-not-allowed'
              )}
              style={{
                background: scanState === 'idle'
                  ? 'linear-gradient(135deg, rgba(96,165,250,0.4), rgba(34,211,238,0.4))'
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${scanState === 'idle' ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {scanState === 'idle' ? (
                <>
                  <Scan size={18} />
                  Start Scan
                </>
              ) : scanState === 'scanning' ? (
                <>
                  <Activity size={18} className="animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Scan Complete
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            {/* Measurements */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Activity size={16} className="text-blue-300" />
                Body Measurements
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {measurements.map((m, i) => (
                  <div
                    key={m.label}
                    className={cn(
                      'p-3 rounded-xl transition-all duration-500',
                      visibleMeasurements.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    )}
                    style={{
                      background: `${m.color}10`,
                      border: `1px solid ${m.color}30`,
                      transitionDelay: `${i * 100}ms`,
                    }}
                  >
                    <div className="text-lg mb-1" style={{ color: m.color }}>{m.icon}</div>
                    <div className="text-xs text-white/50 mb-0.5">{m.label}</div>
                    <div className="font-bold text-white text-sm">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Size */}
            {scanState === 'complete' && (
              <div
                className="glass-card rounded-2xl p-6 text-center animate-bounce-in"
                style={{
                  background: 'linear-gradient(135deg, rgba(192,132,252,0.1), rgba(96,165,250,0.1))',
                  border: '1px solid rgba(192,132,252,0.3)',
                  boxShadow: '0 0 30px rgba(192,132,252,0.15)',
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Zap size={16} className="text-purple-300" />
                  <span className="text-white/60 text-sm">AI Recommendation</span>
                </div>
                <div className="font-orbitron text-5xl font-bold gradient-text mb-2">M</div>
                <p className="text-white/70 text-sm font-medium">Your Ideal Size</p>
                <p className="text-white/40 text-xs mt-2">Based on your body measurements</p>

                <div
                  className="mt-4 p-3 rounded-xl text-xs text-white/60"
                  style={{ background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.15)' }}
                >
                  <Zap size={12} className="inline mr-1 text-purple-300" />
                  Size warning will appear in Shop if you select a different size
                </div>
              </div>
            )}

            {/* Idle state hint */}
            {scanState === 'idle' && (
              <div
                className="glass-card rounded-2xl p-6 text-center"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <Scan size={40} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Click "Start Scan" to begin</p>
                <p className="text-white/25 text-xs mt-1">AI will analyze your body measurements</p>
              </div>
            )}

            {/* Tips */}
            <div className="glass-card rounded-2xl p-4">
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Scan Tips</h4>
              {[
                'Stand straight with arms slightly out',
                'Ensure good lighting for accuracy',
                'Wear fitted clothing for best results',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs"
                    style={{ background: 'rgba(96,165,250,0.2)', color: '#60a5fa' }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-xs text-white/40">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
