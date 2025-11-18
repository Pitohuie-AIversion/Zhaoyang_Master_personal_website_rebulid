import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// Supabase配置
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 缺少Supabase配置');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 测试数据
const testData = {
  name: '测试用户',
  email: 'test@example.com',
  subject: '功能测试',
  message: '这是一条测试消息，用于验证联系表单提交功能是否正常工作。',
  phone: '12345678901',
  company: '测试公司',
  collaboration_type: 'technical_consulting',
  budget_range: '100k-500k',
  timeline: '1-3个月',
  status: 'new'
};

async function testContactSubmission() {
  console.log('🧪 开始测试联系表单提交...\n');
  
  try {
    // 方法1：直接通过Supabase插入
    console.log('📤 方法1：直接插入数据库');
    const { data: directData, error: directError } = await supabase
      .from('contact_messages')
      .insert([testData])
      .select();
    
    if (directError) {
      console.error('❌ 直接插入失败:', directError.message);
    } else {
      console.log('✅ 直接插入成功:', JSON.stringify(directData, null, 2));
    }
    
    // 方法2：通过API接口测试
    console.log('\n📡 方法2：通过API接口测试');
    const apiData = {
      name: 'API测试用户',
      email: 'api-test@example.com',
      subject: 'API功能测试',
      message: '这是通过API接口提交的测试消息。',
      phone: '98765432109',
      company: 'API测试公司',
      collaborationType: 'academic_research',
      budget: '500k-1m',
      timeline: '3-6个月',
      status: 'new'
    };
    
    const response = await fetch('http://localhost:3001/api/contact/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API提交成功:', JSON.stringify(result, null, 2));
    } else {
      console.error('❌ API提交失败:', result);
    }
    
    // 查询所有联系信息
    console.log('\n📋 当前所有联系信息：');
    const { data: allContacts, error: queryError } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (queryError) {
      console.error('❌ 查询失败:', queryError.message);
    } else {
      console.log(`📊 共找到 ${allContacts.length} 条联系信息：`);
      allContacts.forEach((contact, index) => {
        console.log(`\n${index + 1}. ${contact.name} (${contact.email})`);
        console.log(`   主题: ${contact.subject}`);
        console.log(`   时间: ${new Date(contact.created_at).toLocaleString('zh-CN')}`);
        console.log(`   状态: ${contact.status}`);
        if (contact.collaboration_type) {
          console.log(`   合作类型: ${contact.collaboration_type}`);
        }
        if (contact.budget_range) {
          console.log(`   预算范围: ${contact.budget_range}`);
        }
      });
    }
    
    console.log('\n🎉 测试完成！');
    
  } catch (error) {
    console.error('💥 测试过程中出现错误:', error.message);
  }
}

// 运行测试
testContactSubmission();