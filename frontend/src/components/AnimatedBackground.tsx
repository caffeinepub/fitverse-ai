import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      'rgba(192, 132, 252,',
      'rgba(96, 165, 250,',
      'rgba(244, 114, 182,',
      'rgba(34, 211, 238,',
    ];

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: -(Math.random() * 1.5 + 0.5),
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 200 + 100,
    });

    for (let i = 0; i < 40; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particlesRef.current.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.1 && particlesRef.current.length < 60) {
        particlesRef.current.push(createParticle());
      }

      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

      particlesRef.current.forEach((p) => {
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;

        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.1
          ? lifeRatio * 10 * p.opacity
          : lifeRatio > 0.8
          ? (1 - lifeRatio) * 5 * p.opacity
          : p.opacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha * 0.15})`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      {/* Gradient mesh background */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: 'radial-gradient(ellipse at 20% 20%, rgba(120, 40, 200, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(30, 80, 200, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(180, 30, 120, 0.15) 0%, transparent 60%), linear-gradient(135deg, #050010 0%, #0a0020 50%, #050015 100%)',
        }}
      />
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 animate-mesh"
          style={{
            background: 'radial-gradient(circle, rgba(192, 132, 252, 0.8) 0%, transparent 70%)',
            top: '-10%',
            left: '-5%',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.8) 0%, transparent 70%)',
            bottom: '10%',
            right: '5%',
            filter: 'blur(60px)',
            animation: 'meshMove 25s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(244, 114, 182, 0.8) 0%, transparent 70%)',
            top: '50%',
            right: '20%',
            filter: 'blur(50px)',
            animation: 'meshMove 18s ease-in-out infinite',
          }}
        />
      </div>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ opacity: 0.7 }}
      />
    </>
  );
}
