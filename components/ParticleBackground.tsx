'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
  driftAmp: number;
  driftPhase: number;
  pulseSpeed: number;
  pulseOffset: number;
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const isMobile = width < 768;

    const particleCount = isMobile ? 60 : 120;

    const connectionDistance = isMobile ? 105 : 125;

    const colors = [
      '#4F46E5',
      '#6366F1',
      '#818CF8',
      '#94A3B8',
      '#A5B4FC',
    ];

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isLargeParticle = Math.random() < 0.08;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,

        radius: isLargeParticle
          ? Math.random() * 1.8 + 1.5
          : Math.random() * 1.1 + 0.65,

        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,

        baseAlpha: isLargeParticle
          ? Math.random() * 0.18 + 0.15
          : Math.random() * 0.18 + 0.06,

        color: colors[Math.floor(Math.random() * colors.length)],

        twinkleSpeed: Math.random() * 0.8 + 0.35,
        twinkleOffset: Math.random() * Math.PI * 2,

        driftAmp: Math.random() * 2.4 + 0.6,
        driftPhase: Math.random() * Math.PI * 2,

        pulseSpeed: Math.random() * 0.7 + 0.25,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    const render = (time: number) => {
      const t = time * 0.001;

      ctx.clearRect(0, 0, width, height);

      /*
       * Particle movement
       */
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;

        /*
         * Gentle organic drifting
         */
        const driftX =
          Math.sin(t * 0.35 + p.driftPhase) * p.driftAmp;

        const driftY =
          Math.cos(t * 0.3 + p.driftPhase) *
          p.driftAmp *
          0.7;

        const drawX = p.x + driftX;
        const drawY = p.y + driftY;

        /*
         * Twinkling
         */
        const twinkle =
          Math.sin(t * p.twinkleSpeed + p.twinkleOffset) * 0.12;

        /*
         * Subtle breathing/pulsing
         */
        const pulse =
          1 +
          Math.sin(t * p.pulseSpeed + p.pulseOffset) * 0.12;

        const alpha = Math.max(
          0.025,
          Math.min(0.42, p.baseAlpha + twinkle)
        );

        /*
         * Outer glow
         */
        ctx.beginPath();
        ctx.arc(
          drawX,
          drawY,
          p.radius * 5.5 * pulse,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.08;
        ctx.fill();

        /*
         * Inner glow
         */
        ctx.beginPath();
        ctx.arc(
          drawX,
          drawY,
          p.radius * 2.4 * pulse,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.2;
        ctx.fill();

        /*
         * Core particle
         */
        ctx.beginPath();
        ctx.arc(
          drawX,
          drawY,
          p.radius * pulse,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      });

      /*
       * Connecting network
       */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;

          const distanceSquared = dx * dx + dy * dy;

          if (
            distanceSquared <
            connectionDistance * connectionDistance
          ) {
            const distance = Math.sqrt(distanceSquared);

            const opacity =
              Math.pow(
                1 - distance / connectionDistance,
                2
              ) * 0.11;

            ctx.beginPath();

            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            ctx.strokeStyle = '#6366F1';
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.55;

            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Central atmospheric glow */}
      <div
        className="
          absolute
          -top-40
          left-1/2
          -translate-x-1/2
          w-[800px]
          h-[500px]
          bg-gradient-to-b
          from-accent/12
          via-accent/6
          to-transparent
          rounded-full
          blur-3xl
        "
      />

      {/* Left ambient glow */}
      <div
        className="
          absolute
          top-1/4
          -left-48
          w-[550px]
          h-[550px]
          bg-gradient-to-tr
          from-indigo-200/30
          via-indigo-100/10
          to-transparent
          rounded-full
          blur-3xl
        "
      />

      {/* Right ambient glow */}
      <div
        className="
          absolute
          bottom-0
          -right-48
          w-[650px]
          h-[650px]
          bg-gradient-to-tl
          from-indigo-200/25
          via-indigo-100/10
          to-transparent
          rounded-full
          blur-3xl
        "
      />

      {/* Subtle bottom atmosphere */}
      <div
        className="
          absolute
          bottom-[-250px]
          left-1/2
          -translate-x-1/2
          w-[900px]
          h-[450px]
          bg-gradient-to-t
          from-indigo-100/20
          to-transparent
          rounded-full
          blur-3xl
        "
      />
    </div>
  );
}