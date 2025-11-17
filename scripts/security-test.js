/**
 * 安全测试验证脚本
 * 用于验证所有安全增强措施是否正确实施
 */

import https from 'https';
import http from 'http';

// 测试配置
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5173', // 开发环境
  apiUrl: 'http://localhost:3001',
  productionBaseUrl: 'https://zhaoyangmu.cloud',
  productionApiUrl: 'https://zhaoyangmu.cloud'
};

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

/**
 * 测试安全头
 */
async function testSecurityHeaders(url) {
  console.log(`\n${colors.blue}🔒 测试安全头: ${url}${colors.reset}`);
  
  return new Promise((resolve) => {
    http.get(url, (res) => {
      const headers = res.headers;
      const tests = [
        {
          name: 'X-Content-Type-Options',
          expected: 'nosniff',
          actual: headers['x-content-type-options']
        },
        {
          name: 'X-Frame-Options', 
          expected: 'DENY',
          actual: headers['x-frame-options']
        },
        {
          name: 'X-XSS-Protection',
          expected: '1; mode=block',
          actual: headers['x-xss-protection']
        },
        {
          name: 'Content-Security-Policy',
          expected: 'default-src \'self\'',
          actual: headers['content-security-policy']
        },
        {
          name: 'Referrer-Policy',
          expected: 'strict-origin-when-cross-origin',
          actual: headers['referrer-policy']
        },
        {
          name: 'Permissions-Policy',
          expected: 'geolocation=()',
          actual: headers['permissions-policy']
        }
      ];
      
      let passed = 0;
      tests.forEach(test => {
        if (test.actual && test.actual.includes(test.expected.replace(/'/g, ''))) {
          console.log(`${colors.green}✅ ${test.name}: ${test.actual}${colors.reset}`);
          passed++;
        } else {
          console.log(`${colors.red}❌ ${test.name}: 期望 ${test.expected}, 实际 ${test.actual || '缺失'}${colors.reset}`);
        }
      });
      
      console.log(`${colors.yellow}📊 安全头测试: ${passed}/${tests.length} 通过${colors.reset}`);
      resolve({ passed, total: tests.length });
    }).on('error', (err) => {
      console.log(`${colors.red}❌ 连接失败: ${err.message}${colors.reset}`);
      resolve({ passed: 0, total: 6 });
    });
  });
}

/**
 * 测试API限流
 */
async function testRateLimiting() {
  console.log(`\n${colors.blue}🚦 测试API限流${colors.reset}`);
  
  const testEndpoint = `${TEST_CONFIG.apiUrl}/api/chat/message`;
  const results = [];
  
  // 快速发送5个请求来测试限流
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms间隔
    
    try {
      const response = await fetch(testEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `测试消息 ${i}`,
          sessionId: 'test-session'
        })
      });
      
      results.push({
        request: i + 1,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      console.log(`请求 ${i + 1}: ${response.status} ${response.statusText}`);
      
    } catch (error) {
      results.push({
        request: i + 1,
        error: error.message,
        status: 'NETWORK_ERROR'
      });
      console.log(`请求 ${i + 1}: 网络错误 - ${error.message}`);
    }
  }
  
  const rateLimitedRequests = results.filter(r => r.status === 429).length;
  console.log(`${colors.yellow}📊 限流测试: ${rateLimitedRequests}/5 请求被限流${colors.reset}`);
  
  return { rateLimitedRequests, total: 5 };
}

/**
 * 测试文件上传安全
 */
async function testFileUploadSecurity() {
  console.log(`\n${colors.blue}📁 测试文件上传安全${colors.reset}`);
  
  const testEndpoint = `${TEST_CONFIG.apiUrl}/api/upload/files`;
  
  // 测试1: 上传不允许的文件类型
  try {
    const formData = new FormData();
    const blob = new Blob(['test content'], { type: 'text/html' });
    formData.append('files', blob, 'test.html');
    
    const response = await fetch(testEndpoint, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json().catch(() => ({ error: 'No JSON response' }));
    console.log(`不允许的文件类型: ${response.status} - ${result.error || result.message || '未知错误'}`);
    
  } catch (error) {
    console.log(`不允许的文件类型测试失败: ${error.message}`);
  }
  
  // 测试2: 文件大小限制
  try {
    const formData = new FormData();
    // 创建6MB的文件（超过5MB限制）
    const largeContent = new Uint8Array(6 * 1024 * 1024).fill(65); // 6MB的A
    const blob = new Blob([largeContent], { type: 'application/pdf' });
    formData.append('files', blob, 'large.pdf');
    
    const response = await fetch(testEndpoint, {
      method: 'POST',
      body: formData
    });
    
    console.log(`大文件上传: ${response.status} ${response.statusText}`);
    
  } catch (error) {
    console.log(`大文件测试失败: ${error.message}`);
  }
}

/**
 * 测试CORS配置
 */
async function testCORSConfiguration() {
  console.log(`\n${colors.blue}🌐 测试CORS配置${colors.reset}`);
  
  const testEndpoint = `${TEST_CONFIG.apiUrl}/api/health`;
  
  try {
    const response = await fetch(testEndpoint, {
      method: 'GET',
      headers: {
        'Origin': 'https://malicious-site.com' // 测试恶意来源
      }
    });
    
    const corsHeader = response.headers.get('Access-Control-Allow-Origin');
    console.log(`CORS头: ${corsHeader || '无CORS头'}`);
    
    if (!corsHeader || corsHeader !== 'https://malicious-site.com') {
      console.log(`${colors.green}✅ CORS配置正确，阻止了恶意来源${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ CORS配置可能有问题${colors.reset}`);
    }
    
  } catch (error) {
    console.log(`CORS测试失败: ${error.message}`);
  }
}

/**
 * 测试安全日志功能
 */
async function testSecurityLogging() {
  console.log(`\n${colors.blue}📝 测试安全日志功能${colors.reset}`);
  
  const maliciousPayloads = [
    '<script>alert("xss")</script>',
    ' UNION SELECT * FROM users--',
    '../../../etc/passwd',
    'javascript:alert(1)'
  ];
  
  for (const payload of maliciousPayloads) {
    try {
      const response = await fetch(`${TEST_CONFIG.apiUrl}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: payload,
          sessionId: 'test-security'
        })
      });
      
      console.log(`恶意载荷测试: ${payload.substring(0, 30)}... - ${response.status}`);
      
    } catch (error) {
      console.log(`安全日志测试失败: ${error.message}`);
    }
  }
}

/**
 * 运行所有安全测试
 */
async function runSecurityTests() {
  console.log(`${colors.blue}🛡️ 开始安全测试验证${colors.reset}`);
  console.log('='.repeat(50));
  
  const results = {
    headers: await testSecurityHeaders(TEST_CONFIG.baseUrl),
    rateLimit: await testRateLimiting(),
    fileUpload: await testFileUploadSecurity(),
    cors: await testCORSConfiguration(),
    securityLogging: await testSecurityLogging()
  };
  
  console.log('\n' + '='.repeat(50));
  console.log(`${colors.blue}📊 安全测试总结${colors.reset}`);
  
  const totalTests = 5;
  const passedTests = Object.values(results).filter(r => 
    (r.passed !== undefined && r.passed > 0) || 
    (r.rateLimitedRequests !== undefined) ||
    (r.status === 200 || r.status === 403)
  ).length;
  
  console.log(`${colors.yellow}总体进度: ${passedTests}/${totalTests} 测试类别完成${colors.reset}`);
  
  if (passedTests === totalTests) {
    console.log(`${colors.green}✅ 所有安全测试通过！${colors.reset}`);
  } else {
    console.log(`${colors.red}⚠️ 部分测试需要关注，请查看详细结果${colors.reset}`);
  }
  
  return results;
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  runSecurityTests().catch(console.error);
}

export { runSecurityTests, testSecurityHeaders, testRateLimiting, testFileUploadSecurity, testCORSConfiguration, testSecurityLogging };