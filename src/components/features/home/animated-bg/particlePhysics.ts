import type { Particle } from './types';

export function createParticles(width: number, height: number, isDark: boolean): Particle[] {
  const particles: Particle[] = [];
  const particleCount = Math.min(80, Math.floor((width * height) / 15000));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() * 60 + (isDark ? 200 : 180),
    });
  }

  return particles;
}

export function updateParticles(particles: Particle[], width: number, height: number): void {
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    // 边界反弹
    if (particle.x < 0 || particle.x > width) {
      particle.vx *= -1;
      particle.x = Math.max(0, Math.min(width, particle.x));
    }
    if (particle.y < 0 || particle.y > height) {
      particle.vy *= -1;
      particle.y = Math.max(0, Math.min(height, particle.y));
    }

    // 轻微的透明度变化
    particle.opacity += (Math.random() - 0.5) * 0.01;
    particle.opacity = Math.max(0.1, Math.min(0.7, particle.opacity));

    // 色相轻微变化
    particle.hue += (Math.random() - 0.5) * 0.5;
  });
}

export function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle, isDark: boolean): void {
  ctx.save();
  ctx.globalAlpha = particle.opacity;

  // 创建径向渐变
  const gradient = ctx.createRadialGradient(
    particle.x,
    particle.y,
    0,
    particle.x,
    particle.y,
    particle.size * 3
  );

  if (isDark) {
    gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, 0.8)`);
    gradient.addColorStop(0.5, `hsla(${particle.hue}, 70%, 50%, 0.4)`);
    gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 40%, 0)`);
  } else {
    gradient.addColorStop(0, `hsla(${particle.hue}, 60%, 70%, 0.6)`);
    gradient.addColorStop(0.5, `hsla(${particle.hue}, 60%, 60%, 0.3)`);
    gradient.addColorStop(1, `hsla(${particle.hue}, 60%, 50%, 0)`);
  }

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawConnections(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  isDark: boolean
): void {
  const maxDistance = 120;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * 0.2;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = isDark ? '#4f46e5' : '#6366f1';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}
