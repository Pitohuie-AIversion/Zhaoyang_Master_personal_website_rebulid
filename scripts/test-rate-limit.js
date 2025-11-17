// 快速验证脚本 - 测试API限流功能
console.log('🧪 开始API限流验证测试...\n');

// 测试配置
const API_BASE = 'http://localhost:3001';
const TEST_ENDPOINTS = [
  { path: '/api/chat/message', method: 'POST', body: { message: '测试消息', sessionId: 'test-session' } },
  { path: '/api/contact/submit', method: 'POST', body: { name: '测试', email: 'test@example.com', subject: '测试主题', message: '测试内容' } }
];

// 快速发送多个请求测试限流
async function testRateLimit(endpoint, count = 8) {
  console.log(`测试 ${endpoint.path} 限流:`);
  
  for (let i = 1; i <= count; i++) {
    try {
      const response = await fetch(`${API_BASE}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(endpoint.body)
      });
      
      const result = await response.json().catch(() => ({ error: 'No JSON response' }));
      
      console.log(`  请求 ${i}: ${response.status} ${response.statusText}`);
      
      if (response.status === 429) {
        console.log(`  ⚠️  触发限流: ${result.error || 'Too many requests'}`);
        break;
      }
      
      // 短暂延迟避免过快
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.log(`  请求 ${i}: 网络错误 - ${error.message}`);
    }
  }
  console.log('');
}

// 运行测试
async function runTests() {
  console.log('开始限流测试...\n');
  
  for (const endpoint of TEST_ENDPOINTS) {
    await testRateLimit(endpoint);
    // 间隔避免影响下一个测试
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('✅ 限流测试完成！');
}

runTests().catch(console.error);