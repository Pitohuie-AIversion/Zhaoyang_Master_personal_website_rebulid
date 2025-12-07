import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== 响应式设计功能检查 ===\n');

// 检查主要的CSS和组件文件
const filesToCheck = [
  'src/App.tsx',
  'src/components/Layout/Header.tsx',
  'src/components/Layout/Footer.tsx',
  'src/pages/Home.tsx',
  'src/pages/Research.tsx',
  'src/pages/Projects.tsx',
  'src/pages/Skills.tsx',
  'src/pages/About.tsx',
  'src/pages/Contact.tsx'
];

const responsivePatterns = [
  'sm:',
  'md:',
  'lg:',
  'xl:',
  '2xl:',
  'max-sm:',
  'max-md:',
  'max-lg:',
  'max-xl:',
  'max-2xl:',
  'min-w-',
  'max-w-',
  'w-',
  'h-',
  'flex-',
  'grid-',
  'block',
  'hidden',
  'container',
  'mx-auto',
  'px-',
  'py-'
];

filesToCheck.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`\n--- ${filePath} ---`);
    
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // 统计响应式类
      const classNameMatches = content.match(/className=["']([^"']+)["']/g) || [];
      let totalResponsiveClasses = 0;
      
      classNameMatches.forEach(match => {
        const classes = match.replace(/className=["']([^"']+)["']/, '$1');
        const responsiveClasses = responsivePatterns.filter(pattern => 
          classes.includes(pattern)
        );
        
        if (responsiveClasses.length > 0) {
          totalResponsiveClasses += responsiveClasses.length;
          console.log(`  响应式类: ${classes}`);
        }
      });
      
      // 检查Tailwind配置
      const hasTailwind = content.includes('@tailwind') || 
                         content.includes('tailwind') ||
                         content.includes('className=');
      
      // 检查媒体查询
      const mediaQueries = content.match(/@media\s+\([^)]+\)/g) || [];
      
      console.log(`  Tailwind使用: ${hasTailwind ? '✓' : '✗'}`);
      console.log(`  响应式类总数: ${totalResponsiveClasses}`);
      console.log(`  媒体查询: ${mediaQueries.length}`);
      
      // 检查useEffect中的窗口大小监听
      const hasResizeListener = content.includes('window.innerWidth') || 
                               content.includes('window.innerHeight') ||
                               content.includes('resize') ||
                               content.includes('matchMedia');
      
      console.log(`  窗口大小监听: ${hasResizeListener ? '✓' : '✗'}`);
      
    } catch (error) {
      console.log(`  读取文件失败: ${error.message}`);
    }
  } else {
    console.log(`  文件不存在: ${filePath}`);
  }
});

console.log('\n=== Tailwind配置文件检查 ===');

const tailwindFiles = [
  'tailwind.config.js',
  'tailwind.config.ts',
  'postcss.config.js',
  'postcss.config.ts'
];

tailwindFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${file} 存在`);
    
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const hasScreens = content.includes('screens');
      const hasContainer = content.includes('container');
      
      console.log(`  - 包含screens配置: ${hasScreens ? '✓' : '✗'}`);
      console.log(`  - 包含container配置: ${hasContainer ? '✓' : '✗'}`);
    } catch (error) {
      console.log(`  读取配置文件失败: ${error.message}`);
    }
  } else {
    console.log(`✗ ${file} 不存在`);
  }
});

console.log('\n=== 移动端meta标签检查 ===');

const indexHtmlPath = path.join(__dirname, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  try {
    const content = fs.readFileSync(indexHtmlPath, 'utf8');
    const viewport = content.includes('viewport');
    const mobileOptimized = content.includes('mobile') || content.includes('apple-mobile-web-app');
    
    console.log(`✓ index.html 存在`);
    console.log(`  - viewport meta标签: ${viewport ? '✓' : '✗'}`);
    console.log(`  - 移动端优化: ${mobileOptimized ? '✓' : '✗'}`);
  } catch (error) {
    console.log(`  读取index.html失败: ${error.message}`);
  }
} else {
  console.log('✗ index.html 不存在');
}

console.log('\n✅ 响应式设计功能检查完成');