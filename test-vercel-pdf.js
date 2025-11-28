#!/usr/bin/env node

// 测试Vercel环境中PDF文件的访问
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vercel生产环境URL
const VERCEL_URL = 'https://zhaoyang-mou-website.vercel.app';
// 本地测试URL
const LOCAL_URL = 'http://localhost:3000';

// 测试的PDF文件路径
const pdfFiles = [
  '/cn_resume.pdf',
  '/en_resume.pdf',
  '/resume.pdf'
];

async function testPdfAccess(baseUrl, environment) {
  console.log(`\n🧪 测试 ${environment} 环境的PDF访问...`);
  
  for (const pdfPath of pdfFiles) {
    const url = baseUrl + pdfPath;
    console.log(`\n📄 测试: ${url}`);
    
    try {
      // 使用Promise包装HTTP请求
      const response = await new Promise((resolve, reject) => {
        const protocol = baseUrl.startsWith('https') ? https : http;
        
        const req = protocol.get(url, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: data,
              dataLength: data.length
            });
          });
        });
        
        req.on('error', reject);
        req.setTimeout(10000, () => {
          req.abort();
          reject(new Error('Request timeout'));
        });
      });
      
      console.log(`   状态码: ${response.statusCode}`);
      console.log(`   内容类型: ${response.headers['content-type'] || '未知'}`);
      console.log(`   内容长度: ${response.headers['content-length'] || response.dataLength} 字节`);
      console.log(`   数据类型: ${typeof response.data}`);
      
      // 检查内容类型
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/pdf')) {
        console.log(`   ✅ 正确的PDF内容类型`);
      } else if (contentType && contentType.includes('text/html')) {
        console.log(`   ❌ 返回HTML而不是PDF`);
        console.log(`   前100字符: ${response.data.substring(0, 100)}`);
      } else {
        console.log(`   ⚠️  意外的内容类型: ${contentType}`);
      }
      
      // 检查文件头
      if (response.data && response.data.length > 0) {
        const firstBytes = response.data.substring(0, 10);
        if (firstBytes.includes('%PDF')) {
          console.log(`   ✅ 检测到PDF文件头`);
        } else if (firstBytes.includes('<')) {
          console.log(`   ❌ 检测到HTML标记`);
        } else {
          console.log(`   🔍 文件头: ${firstBytes.replace(/\n/g, ' ')}`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ 错误: ${error.message}`);
    }
  }
}

// 检查本地文件
function checkLocalFiles() {
  console.log('\n📁 检查本地PDF文件...');
  
  const publicDir = path.join(__dirname, 'public');
  const resumeDir = path.join(__dirname, 'resume');
  
  [publicDir, resumeDir].forEach(dir => {
    console.log(`\n📂 目录: ${path.relative(__dirname, dir)}`);
    
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const firstBytes = fs.readFileSync(filePath, 'utf8', 0, 10);
        
        console.log(`   📄 ${file} (${stats.size} 字节)`);
        console.log(`      修改时间: ${stats.mtime.toISOString()}`);
        console.log(`      文件头: ${firstBytes.substring(0, 20).replace(/\n/g, ' ')}`);
      });
    } else {
      console.log(`   ❌ 目录不存在`);
    }
  });
}

// 检查Vercel配置
function checkVercelConfig() {
  console.log('\n⚙️  检查Vercel配置...');
  
  const vercelConfigPath = path.join(__dirname, 'vercel.json');
  
  if (fs.existsSync(vercelConfigPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      
      console.log('   📋 重写规则:');
      if (config.rewrites) {
        config.rewrites.forEach(rule => {
          console.log(`      ${rule.source} → ${rule.destination}`);
        });
      }
      
      console.log('   📋 头部配置:');
      if (config.headers) {
        config.headers.forEach(header => {
          console.log(`      ${header.source}:`);
          if (header.headers) {
            header.headers.forEach(h => {
              console.log(`        ${h.key}: ${h.value}`);
            });
          }
        });
      }
      
    } catch (error) {
      console.log(`   ❌ 配置文件解析错误: ${error.message}`);
    }
  } else {
    console.log(`   ❌ vercel.json 不存在`);
  }
}

// 主函数
async function main() {
  console.log('🔍 Vercel PDF下载功能调试工具');
  console.log('=' .repeat(50));
  
  // 检查本地文件
  checkLocalFiles();
  
  // 检查Vercel配置
  checkVercelConfig();
  
  // 测试本地环境
  await testPdfAccess(LOCAL_URL, '本地');
  
  // 测试生产环境（如果有的话）
  console.log('\n📝 注意：生产环境测试需要实际部署的URL');
  console.log('   请替换 VERCEL_URL 为实际的Vercel部署地址');
  
  console.log('\n✅ 测试完成！');
}

// 运行测试
main().catch(error => {
  console.error('测试失败:', error);
  process.exit(1);
});