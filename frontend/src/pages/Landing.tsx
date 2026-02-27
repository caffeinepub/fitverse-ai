import { useNavigate } from '@tanstack/react-router';
import ContinuousRotatingBlob from '../components/ContinuousRotatingBlob';
import CircularTextBadge from '../components/CircularTextBadge';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#7B2FFF' }}
    >
      {/* ── Top Nav ── */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        <span
          className="text-white text-xl font-black tracking-tight"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          FitVerse<span style={{ color: 'rgba(255,255,255,0.55)' }}>AI</span>
        </span>
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate({ to: '/shop' })}
            className="nav-link"
          >
            Shop
          </button>
          <button
            onClick={() => navigate({ to: '/wardrobe' })}
            className="nav-link"
          >
            Wardrobe
          </button>
          <button
            onClick={() => navigate({ to: '/body-scan' })}
            className="nav-link"
          >
            About
          </button>
        </div>
      </nav>

      {/* ── 3D Blob canvas — fills the hero, behind text ── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <ContinuousRotatingBlob />
      </div>

      {/* ── Headline — overlaps blob ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="hero-headline">
          FitVerse
        </h1>
      </div>

      {/* ── Circular badge — below blob center ── */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30">
        <CircularTextBadge />
      </div>

      {/* ── Footer ── */}
      <div className="landing-footer">
        <p className="footer-text">
          © {new Date().getFullYear()} FitVerseAI &nbsp;·&nbsp; Built with{' '}
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'fitverse-ai'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
