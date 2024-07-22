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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const NumParticles = 150;

  useEffect(() => {
    const canvas = canvasRef.current;
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
        canvas.height = window.innerHeight;
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
      (_, i) => 0.2 * (1 - i / 100)
    );

    const strokeStyles = opacityLevels.map(
      opacity => `rgba(100, 149, 237, ${opacity})`
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0, 0, 50, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const state = state$.get();
      const speed = state.speed - 9;
      const num = NumParticles + speed * 3;

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

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(100, 149, 237, 0.5)";
        ctx.fill();

        for (let j = i; j < particles.length; j++) {
          const particle2 = particles[j];
          const dx = particle.x - particle2.x;
          const dy = particle.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = strokeStyles[Math.floor(distance)];
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle2.x, particle2.y);
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
    <canvas
      ref={canvasRef}
      className="absolute inset-0 bg-gradient-to-br from-gray-900 to-blue-900"
    />
  );
};