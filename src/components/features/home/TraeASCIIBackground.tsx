import React, { useEffect, useRef, useCallback } from 'react';

interface TraeASCIIBackgroundProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  theme?: 'green' | 'blue' | 'matrix';
  speed?: number;
}

const TraeASCIIBackground: React.FC<TraeASCIIBackgroundProps> = ({
  className = '',
  intensity = 'medium',
  theme = 'green',
  speed = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const columnsRef = useRef<Array<{
    x: number;
    characters: Array<{
      y: number;
      char: string;
      opacity: number;
      brightness: number;
      isHead: boolean;
    }>;
    speed: number;
    lastSpawn: number;
    spawnDelay: number;
  }>>([]);
  const lastTimeRef = useRef<number>(0);

  // 扩展字符集 - 包含日文片假名和特殊ASCII字符
  const matrixChars = [
    // 数字
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    // 英文字母
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z',
    // 日文片假名 (Matrix风格)
    'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ', 'ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ',
    'ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ', 'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ',
    'ﾊ', 'ﾋ', 'ﾌ', 'ﾍ', 'ﾎ', 'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ',
    'ﾔ', 'ﾕ', 'ﾖ', 'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ', 'ﾜ', 'ﾝ',
    // 扩展ASCII字符
    '│', '┤', '┐', '└', '┴', '┬', '├', '─', '┼', '┘', '┌',
    '≡', '±', '∞', '∆', '∑', '∏', '∫', '√', '∂', '∇',
    // 特殊符号
    '#', '*', '+', '-', '|', '/', '\\', '=', '<', '>',
    '.', ':', ';', '~', '^', '&', '%', '$', '@', '!',
    '¿', '¡', '©', '®', '™', '°', '±', '÷', '×', '§'
  ];

  // 主题配色 - 优化的Matrix风格渐变
  const themes = {
    green: {
      primary: '#00ff41',
      secondary: '#008f11', 
      tertiary: '#003d00',
      fade: '#001a00',
      glow: '#00ff41',
      bright: '#66ff66'
    },
    blue: {
      primary: '#00d4ff',
      secondary: '#0088cc',
      tertiary: '#003366', 
      fade: '#001122',
      glow: '#00d4ff',
      bright: '#66ddff'
    },
    matrix: {
      primary: '#00ff00',
      secondary: '#00cc00',
      tertiary: '#008800',
      fade: '#004400',
      glow: '#00ff00',
      bright: '#88ff88'
    }
  };

  // 强度配置
  const intensityConfig = {
    low: { charCount: 50, spawnRate: 0.3 },
    medium: { charCount: 100, spawnRate: 0.5 },
    high: { charCount: 200, spawnRate: 0.8 }
  };

  const getRandomChar = useCallback(() => {
    return matrixChars[Math.floor(Math.random() * matrixChars.length)];
  }, [matrixChars]);

  const createColumn = useCallback((canvas: HTMLCanvasElement, x: number) => {
    return {
      x,
      characters: [],
      speed: (Math.random() * 3 + 2) * speed,
      lastSpawn: 0,
      spawnDelay: Math.random() * 100 + 50
    };
  }, [speed]);

  const initializeColumns = useCallback((canvas: HTMLCanvasElement) => {
    const columns = columnsRef.current;
    columns.length = 0;
    
    const columnWidth = 20; // 列宽度
    const columnCount = Math.floor(canvas.width / columnWidth);
    
    for (let i = 0; i < columnCount; i++) {
      columns.push(createColumn(canvas, i * columnWidth + columnWidth / 2));
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
          isHead: true
        });
        column.lastSpawn = 0;
        column.spawnDelay = Math.random() * 200 + 100;
      }
    });
    
    lastTimeRef.current = currentTime;
  }, [intensity, getRandomChar, intensityConfig]);

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
        let color;
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

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default TraeASCIIBackground;

// 预设配置组件 - 优化的Matrix风格
export const TraeMatrixBackground: React.FC<Omit<TraeASCIIBackgroundProps, 'theme'>> = (props) => (
  <TraeASCIIBackground {...props} theme="matrix" intensity="high" />
);

export const TraeCyberBackground: React.FC<Omit<TraeASCIIBackgroundProps, 'theme'>> = (props) => (
  <TraeASCIIBackground {...props} theme="blue" intensity="medium" />
);

export const TraeHackerBackground: React.FC<Omit<TraeASCIIBackgroundProps, 'theme'>> = (props) => (
  <TraeASCIIBackground {...props} theme="green" intensity="medium" />
);