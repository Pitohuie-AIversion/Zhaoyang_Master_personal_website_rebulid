import { useEffect, useRef, useCallback } from 'react';
import type { MatrixColumn, MatrixIntensity, MatrixThemeName } from './types';
import { matrixChars, themes, intensityConfig } from './matrixConstants';

interface UseMatrixRainOptions {
  intensity?: MatrixIntensity;
  theme?: MatrixThemeName;
  speed?: number;
}

export const useMatrixRain = ({
  intensity = 'medium',
  theme = 'green',
  speed = 1,
}: UseMatrixRainOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const columnsRef = useRef<MatrixColumn[]>([]);
  const lastTimeRef = useRef<number>(0);

  const getRandomChar = useCallback(() => {
    return matrixChars[Math.floor(Math.random() * matrixChars.length)];
  }, []);

  const createColumn = useCallback((x: number): MatrixColumn => {
    return {
      x,
      characters: [],
      speed: (Math.random() * 3 + 2) * speed,
      lastSpawn: 0,
      spawnDelay: Math.random() * 100 + 50,
    };
  }, [speed]);

  const initializeColumns = useCallback((canvas: HTMLCanvasElement) => {
    const columns = columnsRef.current;
    columns.length = 0;

    const columnWidth = 20; // 列宽度
    const columnCount = Math.floor(canvas.width / columnWidth);

    for (let i = 0; i < columnCount; i++) {
      columns.push(createColumn(i * columnWidth + columnWidth / 2));
    }
  }, [createColumn]);

  const updateColumns = useCallback((canvas: HTMLCanvasElement, currentTime: number) => {
    const config = intensityConfig[intensity];
    const columns = columnsRef.current;
    const deltaTime = currentTime - lastTimeRef.current;

    columns.forEach(column => {
      // 更新现有字符位置
      column.characters.forEach((char, charIndex) => {
        char.y += column.speed * (deltaTime / 16); // 标准化到60fps

        // 更新透明度和亮度
        if (char.isHead) {
          char.brightness = 1;
          char.opacity = 1;
        } else {
          // 根据距离头部的位置计算透明度
          const distanceFromHead = charIndex;
          char.brightness = Math.max(0.1, 1 - distanceFromHead * 0.1);
          char.opacity = Math.max(0.1, 1 - distanceFromHead * 0.05);
        }

        // 随机改变字符（Matrix效果）
        if (Math.random() < 0.02) {
          char.char = getRandomChar();
        }
      });

      // 移除超出屏幕的字符
      column.characters = column.characters.filter(char => char.y < canvas.height + 50);

      // 更新头部标记
      column.characters.forEach((char, index) => {
        char.isHead = index === 0;
      });

      // 生成新字符
      column.lastSpawn += deltaTime;
      if (column.lastSpawn >= column.spawnDelay && Math.random() < config.spawnRate) {
        column.characters.unshift({
          y: -20,
          char: getRandomChar(),
          opacity: 1,
          brightness: 1,
          isHead: true,
        });
        column.lastSpawn = 0;
        column.spawnDelay = Math.random() * 200 + 100;
      }
    });

    lastTimeRef.current = currentTime;
  }, [intensity, getRandomChar]);

  const drawColumns = useCallback((ctx: CanvasRenderingContext2D) => {
    const currentTheme = themes[theme];
    const columns = columnsRef.current;
    const fontSize = 16;

    columns.forEach(column => {
      column.characters.forEach((char) => {
        ctx.save();

        // 设置字体
        ctx.font = `${fontSize}px 'Courier New', 'MS Gothic', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 根据字符位置和亮度选择颜色
        let color: string;
        if (char.isHead) {
          // 头部字符使用最亮的颜色
          color = currentTheme.bright;
          ctx.shadowColor = currentTheme.glow;
          ctx.shadowBlur = 15;
        } else if (char.brightness > 0.7) {
          // 接近头部的字符
          color = currentTheme.primary;
          ctx.shadowColor = currentTheme.glow;
          ctx.shadowBlur = 8;
        } else if (char.brightness > 0.4) {
          // 中间部分
          color = currentTheme.secondary;
          ctx.shadowColor = currentTheme.glow;
          ctx.shadowBlur = 4;
        } else if (char.brightness > 0.2) {
          // 尾部
          color = currentTheme.tertiary;
          ctx.shadowColor = currentTheme.glow;
          ctx.shadowBlur = 2;
        } else {
          // 最暗的部分
          color = currentTheme.fade;
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }

        // 设置透明度
        ctx.globalAlpha = char.opacity;

        // 绘制字符
        ctx.fillStyle = color;
        ctx.fillText(char.char, column.x, char.y);

        // 为头部字符添加额外的发光效果
        if (char.isHead) {
          ctx.globalAlpha = char.opacity * 0.5;
          ctx.shadowBlur = 25;
          ctx.fillText(char.char, column.x, char.y);
        }

        ctx.restore();
      });
    });
  }, [theme]);

  const animate = useCallback((currentTime: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制列
    updateColumns(canvas, currentTime);
    drawColumns(ctx);

    animationRef.current = requestAnimationFrame(animate);
  }, [updateColumns, drawColumns]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 重新初始化列
    initializeColumns(canvas);
  }, [initializeColumns]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 初始化画布大小和列
    resizeCanvas();

    // 初始化时间
    lastTimeRef.current = performance.now();

    // 开始动画
    animate();

    // 监听窗口大小变化
    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [animate, resizeCanvas]);

  return { canvasRef };
};
