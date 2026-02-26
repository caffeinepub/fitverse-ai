import React, { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Zap, Scan, Shirt, ShoppingBag, ArrowRight, Sparkles, Brain, Star } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Brain,
      title: 'AI Body Scan',
      desc: 'Precise measurements in seconds',
      color: '#c084fc',
    },
    {
      icon: Shirt,
      title: 'Wardrobe Intelligence',
      desc: 'Smart outfit recommendations',
      color: '#60a5fa',
    },
    {
      icon: ShoppingBag,
      title: 'Virtual Trial Hub',
      desc: 'Try before you buy, digitally',
      color: '#f472b6',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden page-transition">
      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-16">
        {/* Left: Text Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(192, 132, 252, 0.1)',
              border: '1px solid rgba(192, 132, 252, 0.3)',
            }}>
            <Sparkles size={14} className="text-purple-300" />
            <span className="text-xs font-medium text-purple-300">AI-Powered Fashion Platform</span>
          </div>

          {/* Headline */}
          <h1 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="gradient-text">Shop Smart.</span>
            <br />
            <span className="text-white">Try Smart.</span>
            <br />
            <span className="gradient-text-blue">Dress Smart.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
            Experience the future of fashion with AI-powered body scanning, intelligent wardrobe analysis, and a virtual trial hub — all in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => navigate({ to: '/shop' })}
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 btn-glow"
              style={{
                background: 'linear-gradient(135deg, rgba(192,132,252,0.4), rgba(96,165,250,0.4))',
                border: '1px solid rgba(192,132,252,0.5)',
                boxShadow: '0 0 20px rgba(192,132,252,0.3)',
              }}
            >
              <ShoppingBag size={18} />
              Start Shopping
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate({ to: '/body-scan' })}
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 btn-glow-blue"
              style={{
                background: 'linear-gradient(135deg, rgba(96,165,250,0.3), rgba(34,211,238,0.3))',
                border: '1px solid rgba(96,165,250,0.4)',
              }}
            >
              <Scan size={18} />
              Scan My Body
            </button>

            <button
              onClick={() => navigate({ to: '/wardrobe' })}
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 btn-glow-pink"
              style={{
                background: 'linear-gradient(135deg, rgba(244,114,182,0.3), rgba(192,132,252,0.3))',
                border: '1px solid rgba(244,114,182,0.4)',
              }}
            >
              <Shirt size={18} />
              Scan My Wardrobe
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12 justify-center lg:justify-start">
            {[
              { value: '98%', label: 'Fit Accuracy' },
              { value: '10K+', label: 'Happy Users' },
              { value: '50K+', label: 'Items Tried' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-orbitron text-2xl font-bold gradient-text">{value}</div>
                <div className="text-xs text-white/40 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Avatar */}
        <div className="flex-shrink-0 relative" ref={avatarRef}>
          <div className="relative w-72 h-80 lg:w-80 lg:h-96">
            {/* Glow rings */}
            <div
              className="absolute inset-0 rounded-full opacity-30"
              style={{
                background: 'radial-gradient(circle, rgba(192,132,252,0.4) 0%, transparent 70%)',
                filter: 'blur(30px)',
                animation: 'pulseGlow 3s ease-in-out infinite',
              }}
            />

            {/* Avatar container */}
            <div
              className="relative w-full h-full rounded-3xl overflow-hidden float-animation"
              style={{
                background: 'linear-gradient(135deg, rgba(192,132,252,0.1), rgba(96,165,250,0.1))',
                border: '1px solid rgba(192,132,252,0.2)',
                boxShadow: '0 0 40px rgba(192,132,252,0.2)',
              }}
            >
              <img
                src="/assets/generated/ai-avatar-hero.dim_600x700.png"
                alt="AI Fashion Avatar"
                className="w-full h-full object-cover"
              />

              {/* Holographic overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(192,132,252,0.05) 0%, transparent 50%, rgba(96,165,250,0.05) 100%)',
                }}
              />

              {/* Scan lines effect */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(192,132,252,0.3) 2px, rgba(192,132,252,0.3) 3px)',
                }}
              />
            </div>

            {/* Floating badges */}
            <div
              className="absolute -top-4 -right-4 px-3 py-2 rounded-xl text-xs font-semibold text-white animate-bounce-in"
              style={{
                background: 'rgba(192,132,252,0.2)',
                border: '1px solid rgba(192,132,252,0.4)',
                backdropFilter: 'blur(10px)',
                animationDelay: '0.5s',
              }}
            >
              <div className="flex items-center gap-1.5">
                <Zap size={12} className="text-purple-300" />
                AI Powered
              </div>
            </div>

            <div
              className="absolute -bottom-4 -left-4 px-3 py-2 rounded-xl text-xs font-semibold text-white"
              style={{
                background: 'rgba(96,165,250,0.2)',
                border: '1px solid rgba(96,165,250,0.4)',
                backdropFilter: 'blur(10px)',
                animation: 'float 4s ease-in-out infinite 1s',
              }}
            >
              <div className="flex items-center gap-1.5">
                <Star size={12} className="text-blue-300" />
                Perfect Fit
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="glass-card rounded-2xl p-6 flex items-start gap-4 transition-all duration-300 hover:scale-[1.02]"
              style={{ '--glow-color': color } as React.CSSProperties}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}20`, border: `1px solid ${color}40` }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-sm text-white/50">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center border-t border-white/5">
        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} FitVerse AI. Built with{' '}
          <span className="text-pink-400">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'fitverse-ai')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
