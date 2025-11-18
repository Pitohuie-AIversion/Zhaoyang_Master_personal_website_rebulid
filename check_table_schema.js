import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://auoxidsodyvjcjzfthot.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1b3hpZHNvZHl2amNqemZ0aG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQyMjg2OCwiZXhwIjoyMDc0OTk4ODY4fQ.8lx_biGkWo9NYJiSqFCQHXjFEB8eKzp8jvAGZwtsVQ4'
);

async function checkContactTableSchema() {
  console.log('=== 联系信息表结构检查 ===\n');

  try {
    // 获取表结构信息
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ 查询错误: ${error.message}`);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ 表存在且可访问');
      console.log('\n当前表结构:');
      
      const sample = data[0];
      const fields = Object.keys(sample);
      
      fields.forEach(field => {
        const value = sample[field];
        const type = Array.isArray(value) ? 'array' : 
                    value instanceof Date ? 'date' : 
                    typeof value;
        console.log(`   - ${field}: ${type}`);
      });

      // 检查缺失的字段
      console.log('\n=== 缺失字段检查 ===');
      const requiredFields = [
        'ip_address',
        'user_agent', 
        'referrer',
        'budget_range',
        'collaboration_type'
      ];

      const missingFields = requiredFields.filter(field => !fields.includes(field));
      
      if (missingFields.length > 0) {
        console.log('❌ 缺失字段:');
        missingFields.forEach(field => console.log(`   - ${field}`));
        
        console.log('\n=== 修复建议 ===');
        console.log('需要执行以下SQL语句来添加缺失字段:');
        console.log(`\nALTER TABLE contact_messages
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT,
ADD COLUMN IF NOT EXISTS budget_range TEXT,
ADD COLUMN IF NOT EXISTS collaboration_type TEXT;`);
      } else {
        console.log('✅ 所有必需字段都存在');
      }

      // 检查现有数据
      console.log('\n=== 数据样本检查 ===');
      const { count, error: countError } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.log(`❌ 计数错误: ${countError.message}`);
      } else {
        console.log(`✅ 总记录数: ${count}`);
      }

    } else {
      console.log('✅ 表存在但为空');
    }

  } catch (error) {
    console.log(`❌ 检查失败: ${error.message}`);
  }

  console.log('\n=== 建议操作 ===');
  console.log('1. 登录Supabase控制台');
  console.log('2. 打开SQL编辑器');
  console.log('3. 执行上述ALTER TABLE语句');
  console.log('4. 重新测试API端点');
}

checkContactTableSchema().catch(console.error);