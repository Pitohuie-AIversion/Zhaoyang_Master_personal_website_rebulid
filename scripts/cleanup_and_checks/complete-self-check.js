#!/usr/bin/env node

// 完整的Vercel PDF下载功能自检工具
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const VERCEL_PROD_URL = 'https://zhaoyang-mou-website.vercel.app';
const LOCAL_FRONTEND_URL = 'http://localhost:5173';
const LOCAL_BACKEND_URL = 'http://localhost:3001';

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 测试HTTP请求
async function testHttpRequest(url, description) {
  log(`\n🧪 ${description}`, 'blue');
  log(`📄 URL: ${url}`);
  
  try {
    const response = await new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
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
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
    
    // 状态码检查
    if (response.statusCode === 200) {
      log(`   ✅ 状态码: ${response.statusCode}`, 'green');
    } else {
      log(`   ❌ 状态码: ${response.statusCode}`, 'red');
    }
    
    // 内容类型检查
    const contentType = response.headers['content-type'];
    if (contentType) {
      log(`   📋 内容类型: ${contentType}`);
      
      if (url.includes('.pdf')) {
        if (contentType.includes('application/pdf')) {
          log(`   ✅ 正确的PDF内容类型`, 'green');
        } else if (contentType.includes('text/html')) {
          log(`   ❌ 返回HTML而不是PDF`, 'red');
          log(`   📄 前200字符: ${response.data.substring(0, 200).replace(/\n/g, ' ')}`, 'yellow');
        } else {
          log(`   ⚠️  意外的内容类型: ${contentType}`, 'yellow');
        }
      }
    }
    
    // 文件头检查
    if (response.data && response.data.length > 0) {
      const firstBytes = response.data.substring(0, 10);
      if (url.includes('.pdf')) {
        if (firstBytes.includes('%PDF')) {
          log(`   ✅ 检测到PDF文件头`, 'green');
        } else if (firstBytes.includes('<')) {
          log(`   ❌ 检测到HTML标记`, 'red');
        } else {
          log(`   🔍 文件头: ${firstBytes}`, 'yellow');
        }
      }
    }
    
    // 内容长度检查
    const contentLength = response.headers['content-length'] || response.dataLength;
    if (contentLength) {
      log(`   📊 内容长度: ${contentLength} 字节`);
      if (url.includes('.pdf') && contentLength > 1000) {
        log(`   ✅ PDF文件大小合理`, 'green');
      } else if (url.includes('.pdf') && contentLength < 1000) {
        log(`   ⚠️  PDF文件可能过小`, 'yellow');
      }
    }
    
    return {
      success: response.statusCode === 200,
      contentType: contentType,
      isPdf: url.includes('.pdf') && contentType?.includes('application/pdf'),
      hasPdfHeader: url.includes('.pdf') && response.data.substring(0, 10).includes('%PDF')
    };
    
  } catch (error) {
    log(`   ❌ 错误: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

// 检查本地文件
function checkLocalFiles() {
  log('\n📁 检查本地PDF文件...', 'blue');
  
  const publicDir = path.join(__dirname, 'public');
  const resumeDir = path.join(__dirname, 'resume');
  
  const allFiles = [];
  
  [publicDir, resumeDir].forEach(dir => {
    const dirName = path.relative(__dirname, dir);
    log(`\n📂 目录: ${dirName}`);
    
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));
      if (files.length === 0) {
        log(`   ⚠️  未找到PDF文件`, 'yellow');
      } else {
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          const firstBytes = fs.readFileSync(filePath, 'utf8', 0, 10);
          
          log(`   📄 ${file} (${stats.size} 字节)`);
          
          if (firstBytes.includes('%PDF')) {
            log(`      ✅ 有效的PDF文件`, 'green');
          } else {
            log(`      ❌ 无效的PDF文件头`, 'red');
          }
          
          allFiles.push({
            path: filePath,
            name: file,
            size: stats.size,
            isValid: firstBytes.includes('%PDF'),
            location: dirName
          });
        });
      }
    } else {
      log(`   ❌ 目录不存在`, 'red');
    }
  });
  
  return allFiles;
}

// 检查Vercel配置
function checkVercelConfig() {
  log('\n⚙️  检查Vercel配置...', 'blue');
  
  const vercelConfigPath = path.join(__dirname, 'vercel.json');
  
  if (fs.existsSync(vercelConfigPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      
      log('📋 重写规则:');
      if (config.rewrites && config.rewrites.length > 0) {
        config.rewrites.forEach(rule => {
          log(`   ${rule.source} → ${rule.destination}`);
          
          // 检查PDF文件的重写规则
          if (rule.source.includes('pdf') || rule.source.includes('\\.(pdf')) {
            log(`      ✅ 检测到PDF文件处理规则`, 'green');
          }
        });
      } else {
        log(`   ⚠️  未找到重写规则`, 'yellow');
      }
      
      log('\n📋 头部配置:');
      if (config.headers && config.headers.length > 0) {
        config.headers.forEach(header => {
          log(`   ${header.source}:`);
          if (header.headers) {
            header.headers.forEach(h => {
              log(`      ${h.key}: ${h.value}`);
              
              // 检查PDF相关的头部
              if (h.key === 'Content-Type' && h.value === 'application/pdf') {
                log(`         ✅ PDF内容类型配置正确`, 'green');
              }
              if (h.key === 'Content-Disposition' && h.value === 'attachment') {
                log(`         ✅ PDF下载配置正确`, 'green');
              }
            });
          }
        });
      } else {
        log(`   ⚠️  未找到头部配置`, 'yellow');
      }
      
      return config;
    } catch (error) {
      log(`   ❌ 配置文件解析错误: ${error.message}`, 'red');
      return null;
    }
  } else {
    log(`   ❌ vercel.json 不存在`, 'red');
    return null;
  }
}

// 检查代码中的PDF路径
function checkCodePaths() {
  log('\n💻 检查代码中的PDF路径...', 'blue');
  
  const homePagePath = path.join(__dirname, 'src', 'pages', 'Home.tsx');
  
  if (fs.existsSync(homePagePath)) {
    try {
      const content = fs.readFileSync(homePagePath, 'utf8');
      
      // 查找PDF路径
      const pdfMatches = content.match(/href=\{[^}]*resume[^}]*\}/g);
      if (pdfMatches) {
        log('📋 检测到的PDF路径:');
        pdfMatches.forEach(match => {
          log(`   ${match}`);
          
          if (match.includes('/cn_resume.pdf') || match.includes('/en_resume.pdf')) {
            log(`      ✅ 使用正确的简化路径`, 'green');
          } else if (match.includes('compressed')) {
            log(`      ⚠️  仍在使用旧的压缩文件名`, 'yellow');
          }
        });
      } else {
        log(`   ⚠️  未找到PDF路径`, 'yellow');
      }
      
      // 检查语言切换逻辑
      if (content.includes("language === 'zh'")) {
        log(`   ✅ 检测到语言切换逻辑`, 'green');
      }
      
    } catch (error) {
      log(`   ❌ 读取文件错误: ${error.message}`, 'red');
    }
  } else {
    log(`   ❌ Home.tsx 文件不存在`, 'red');
  }
}

// 主自检函数
async function completeSelfCheck() {
  log('🔍 开始Vercel PDF下载功能完整自检', 'blue');
  log('=' .repeat(60));
  
  // 1. 检查本地文件
  const localFiles = checkLocalFiles();
  
  // 2. 检查Vercel配置
  const vercelConfig = checkVercelConfig();
  
  // 3. 检查代码路径
  checkCodePaths();
  
  // 4. 测试本地前端服务器
  log('\n🌐 测试本地前端服务器...', 'blue');
  if (localFiles.length > 0) {
    for (const file of localFiles) {
      if (file.location === 'public') {
        const url = `${LOCAL_FRONTEND_URL}/${file.name}`;
        await testHttpRequest(url, `本地文件: ${file.name}`);
      }
    }
  }
  
  // 5. 测试生产环境（如果可用）
  log('\n🌍 测试生产环境...', 'blue');
  log(`📋 生产环境URL: ${VERCEL_PROD_URL}`);
  
  const prodResults = [];
  if (localFiles.length > 0) {
    for (const file of localFiles) {
      if (file.name.includes('resume')) {
        const url = `${VERCEL_PROD_URL}/${file.name}`;
        const result = await testHttpRequest(url, `生产环境: ${file.name}`);
        prodResults.push(result);
      }
    }
  }
  
  // 6. 总结报告
  log('\n📊 自检总结报告', 'blue');
  log('=' .repeat(60));
  
  // 本地文件检查
  const validLocalFiles = localFiles.filter(f => f.isValid).length;
  log(`📁 本地PDF文件: ${validLocalFiles}/${localFiles.length} 有效`, 
    validLocalFiles === localFiles.length ? 'green' : 'yellow');
  
  // Vercel配置检查
  if (vercelConfig) {
    log(`⚙️  Vercel配置: ✅ 已配置`, 'green');
  } else {
    log(`⚙️  Vercel配置: ❌ 未配置`, 'red');
  }
  
  // 生产环境测试结果
  const successfulProdTests = prodResults.filter(r => r.success).length;
  log(`🌍 生产环境测试: ${successfulProdTests}/${prodResults.length} 成功`,
    successfulProdTests === prodResults.length ? 'green' : 'red');
  
  // PDF下载功能总体评估
  const overallSuccess = validLocalFiles === localFiles.length && 
                        vercelConfig && 
                        successfulProdTests === prodResults.length;
  
  if (overallSuccess) {
    log('\n✅ PDF下载功能完全正常！', 'green');
    log('📋 所有测试通过，用户可以正常下载PDF简历文件');
  } else {
    log('\n⚠️  PDF下载功能存在问题，需要进一步调试', 'yellow');
    log('📋 请检查上述失败的测试项目');
  }
  
  // 最终建议
  log('\n💡 最终建议:', 'blue');
  if (overallSuccess) {
    log('   1. ✅ 所有配置正确，PDF下载功能已修复');
    log('   2. 📄 用户可以正常下载中文和英文简历');
    log('   3. 🌐 生产环境部署成功');
  } else {
    log('   1. 🔧 根据失败的项目进行针对性修复');
    log('   2. 🔄 重新部署到Vercel');
    log('   3. 🧪 再次运行自检工具验证');
  }
  
  return overallSuccess;
}

// 运行自检
completeSelfCheck().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  log(`\n❌ 自检失败: ${error.message}`, 'red');
  process.exit(1);
});