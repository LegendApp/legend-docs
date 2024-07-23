import type { Observable } from "@legendapp/state";
import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
}

interface Props {
  state$: Observable<{ speed: number }>;
}

export const AnimatedBackground: React.FC<Props> = ({ state$ }) => {
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const refBg = useRef<HTMLDivElement | null>(null);
  const NumParticles = 150;

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    let oldWidth = canvas.width;
    let oldHeight = canvas.height;

    const particles: Particle[] = [];

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 2;
      }

      particles.forEach((particle) => {
        particle.x = (particle.x / oldWidth) * canvas.width;
        particle.y = (particle.y / oldHeight) * canvas.height;
      });

      oldWidth = canvas.width;
      oldHeight = canvas.height;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const createParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    };

    for (let i = 0; i < NumParticles; i++) {
      createParticle();
    }

    const opacityLevels = Array.from(
      { length: 101 },
      (_, i) => 0.4 * (1 - i / 100)
    );

    const strokeStyles = opacityLevels.map(
      (opacity) => `rgba(100, 149, 237, ${opacity})`
    );

    const scroller = document.getElementById("scroller");

    const animate = () => {
      const scrollTop = -(scroller?.scrollTop || 0);
      const scroll = scrollTop * 0.15;
      refBg.current!.style.transform = `translateY(${scrollTop}px)`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0, 0, 50, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const state = state$.get();
      const speed = (state.speed) * 2;
      const num = NumParticles + speed * 10;

      if (num < particles.length) {
        particles.length = num;
      }
      while (num > particles.length) {
        createParticle();
      }

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        particle.x += particle.dx * speed;
        particle.y += particle.dy * speed;

        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

        const x = particle.x;
        const y = particle.y + scroll;

        ctx.beginPath();
        ctx.arc(x, y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(100, 149, 237, 0.5)";
        ctx.fill();

        for (let j = i; j < particles.length; j++) {
          const particle2 = particles[j];
          const x2 = particle2.x;
          const y2 = particle2.y + scroll;
          const dx = x - x2;
          const dy = y - y2;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = strokeStyles[Math.floor(distance)];
            ctx.lineWidth = 0.5;
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0">
      <div ref={refBg} className="absolute left-0 top-0 right-0 -bottom-full bg-gradient-to-br from-gray-900 to-blue-950 -z-10" />
      <canvas ref={refCanvas} />
    </div>
  );
};
