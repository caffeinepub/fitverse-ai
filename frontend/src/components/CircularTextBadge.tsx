import { useEffect, useRef } from 'react';

const TEXT = 'AI-POWERED FASHION · PERFECT FIT EVERY TIME · ';
const RADIUS = 52;
const FONT_SIZE = 10.5;

export default function CircularTextBadge() {
  const groupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let frame: number;
    let angle = 0;
    const animate = () => {
      angle += 0.3;
      if (groupRef.current) {
        groupRef.current.setAttribute('transform', `rotate(${angle}, 64, 64)`);
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Build character positions around the circle
  const chars = TEXT.split('');
  const angleStep = 360 / chars.length;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 128, height: 128 }}>
      <svg
        viewBox="0 0 128 128"
        width={128}
        height={128}
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        <g ref={groupRef} transform="rotate(0, 64, 64)">
          {chars.map((char, i) => {
            const angleDeg = i * angleStep - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = 64 + RADIUS * Math.cos(angleRad);
            const y = 64 + RADIUS * Math.sin(angleRad);
            const rotateDeg = angleDeg + 90;
            return (
              <text
                key={i}
                x={x}
                y={y}
                fontSize={FONT_SIZE}
                fill="rgba(255,255,255,0.88)"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
                letterSpacing="0.05em"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${rotateDeg}, ${x}, ${y})`}
              >
                {char}
              </text>
            );
          })}
        </g>
      </svg>

      {/* Center sparkle icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* 4-pointed star / sparkle */}
          <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
        </svg>
      </div>
    </div>
  );
}
