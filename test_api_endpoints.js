import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://auoxidsodyvjcjzfthot.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1b3hpZHNvZHl2amNqemZ0aG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQyMjg2OCwiZXhwIjoyMDc0OTk4ODY4fQ.8lx_biGkWo9NYJiSqFCQHXjFEB8eKzp8jvAGZwtsVQ4'
);

async function testAPIEndpoints() {
  console.log('=== API端点功能测试 ===\n');

  const baseUrl = 'http://localhost:3001';

  // 测试的端点
  const endpoints = [
    {
      name: '健康检查',
      path: '/api/health',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: '学术内容统计',
      path: '/api/academics/stats',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: '学术内容列表',
      path: '/api/academics/all?type=all&page=1&limit=5',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: '联系信息统计',
      path: '/api/contact/stats',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: '联系信息列表',
      path: '/api/contact/messages?page=1&limit=5',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: '联系表单提交',
      path: '/api/contact/submit',
      method: 'POST',
      body: {
        name: 'API测试用户',
        email: 'api-test@example.com',
        subject: 'API功能测试',
        message: '这是一条API端点功能测试消息',
        status: 'new'
      },
      expectedStatus: 201
    }
  ];

  for (const endpoint of endpoints) {
    console.log(`\n--- ${endpoint.name} ---`);
    console.log(`端点: ${endpoint.path}`);
    console.log(`方法: ${endpoint.method}`);

    try {
      const options = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }

      const response = await fetch(baseUrl + endpoint.path, options);
      
      console.log(`状态码: ${response.status}`);
      
      if (response.status === endpoint.expectedStatus) {
        console.log('✅ 状态码符合预期');
      } else {
        console.log(`❌ 状态码不符合预期，期望: ${endpoint.expectedStatus}`);
      }

      const data = await response.json().catch(() => null);
      
      if (data) {
        console.log('响应数据预览:');
        console.log(JSON.stringify(data, null, 2).substring(0, 200) + '...');
      }

      // 特殊检查
      if (endpoint.name.includes('学术内容统计')) {
        if (data && data.stats && data.stats.overview) {
          console.log('✅ 统计数据结构正常');
          console.log(`   论文数: ${data.stats.overview.totalPublications}`);
          console.log(`   专利数: ${data.stats.overview.totalPatents}`);
          console.log(`   项目数: ${data.stats.overview.totalProjects}`);
          console.log(`   奖项数: ${data.stats.overview.totalAwards}`);
        } else {
          console.log('⚠️  统计数据结构异常');
        }
      }

      if (endpoint.name.includes('联系信息统计')) {
        if (data && data.stats) {
          console.log('✅ 联系信息统计正常');
          console.log(`   总消息数: ${data.stats.total}`);
          console.log(`   新消息: ${data.stats.byStatus.new}`);
          console.log(`   已读: ${data.stats.byStatus.read}`);
        } else {
          console.log('⚠️  联系信息统计异常');
        }
      }

      // 清理测试数据
      if (endpoint.name.includes('联系表单提交') && data && data.data) {
        console.log('🧹 清理测试数据...');
        try {
          const deleteResponse = await fetch(baseUrl + `/api/contact/messages/${data.data.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          if (deleteResponse.ok) {
            console.log('✅ 测试数据已清理');
          }
        } catch (error) {
          console.log('⚠️  清理测试数据失败:', error.message);
        }
      }

    } catch (error) {
      console.log(`❌ 请求失败: ${error.message}`);
    }

    // 添加延迟避免过快请求
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n=== 额外检查 ===\n');

  // 检查数据库连接状态
  console.log('数据库连接状态:');
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log(`❌ 数据库连接失败: ${error.message}`);
    } else {
      console.log('✅ 数据库连接正常');
    }
  } catch (error) {
    console.log(`❌ 数据库连接错误: ${error.message}`);
  }

  console.log('\n✅ API端点功能测试完成');
}

testAPIEndpoints().catch(console.error);