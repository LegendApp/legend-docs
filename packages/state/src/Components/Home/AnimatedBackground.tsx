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
  const NumParticles = 50;

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
      const container = document.getElementById("background-container");
      if (canvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

    //   ctx.fillStyle = "rgba(0, 0, 50, 0.05)";
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);

      const state = state$.get();
      const speed = +state.speed + 1;
      const num = NumParticles + speed * 5;

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

        if (particle.x < 0 || particle.x >= canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y >= canvas.height - particle.radius) particle.dy *= -1;

        const x = particle.x;
        const y = particle.y;

        ctx.beginPath();
        ctx.arc(x, y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120, 171, 245, 0.6)";
        ctx.fill();

        for (let j = i; j < particles.length; j++) {
          const particle2 = particles[j];
          const x2 = particle2.x;
          const y2 = particle2.y;
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
    <div className="absolute inset-0">
      <div
        ref={refBg}
        className="absolute inset-0 bg-gradient-to-b from-[#112c53] to-[#0d1117] -z-10"
        // style={{ height: '800%'}}
      />
      <canvas ref={refCanvas} className="!mt-0" />
    </div>
  );
};
