import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://auoxidsodyvjcjzfthot.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1b3hpZHNvZHl2amNqemZ0aG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQyMjg2OCwiZXhwIjoyMDc0OTk4ODY4fQ.8lx_biGkWo9NYJiSqFCQHXjFEB8eKzp8jvAGZwtsVQ4'
);

async function checkDatabaseStructure() {
  console.log('=== 数据库结构检查 ===\n');

  // 检查所有表
  const tables = ['contact_messages', 'publications', 'patents', 'projects', 'awards'];
  
  for (const table of tables) {
    console.log(`\n--- ${table} 表 ---`);
    
    try {
      // 获取表结构信息
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ 表访问错误: ${error.message}`);
        if (error.code === '42501') {
          console.log('   权限错误：需要检查RLS策略和表权限');
        }
        continue;
      }

      if (data && data.length > 0) {
        console.log('✅ 表存在且可访问');
        console.log(`   记录数: ${data.length} (样本)`);
        
        // 显示字段结构
        const sample = data[0];
        console.log('   字段:');
        Object.keys(sample).forEach(field => {
          const value = sample[field];
          const type = Array.isArray(value) ? 'array' : 
                      value instanceof Date ? 'date' : 
                      typeof value;
          console.log(`   - ${field}: ${type}`);
        });
      } else {
        console.log('✅ 表存在但为空');
        
        // 尝试获取表结构
        const { data: structure, error: structError } = await supabase
          .from(table)
          .select('*');
        
        if (structError) {
          console.log(`   结构查询错误: ${structError.message}`);
        }
      }

    } catch (error) {
      console.log(`❌ 检查失败: ${error.message}`);
    }
  }

  console.log('\n=== 权限检查 ===\n');

  // 检查contact_messages表的权限
  console.log('--- contact_messages 权限 ---');
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        name: '测试用户',
        email: 'test@example.com',
        subject: '权限测试',
        message: '这是一条权限测试消息',
        status: 'new'
      }]);

    if (error) {
      console.log(`❌ 插入权限错误: ${error.message}`);
      if (error.code === '42501') {
        console.log('   需要授予插入权限给service_role');
      }
    } else {
      console.log('✅ 插入权限正常');
      
      // 清理测试数据
      if (data && data[0]) {
        await supabase
          .from('contact_messages')
          .delete()
          .eq('id', data[0].id);
        console.log('   测试数据已清理');
      }
    }
  } catch (error) {
    console.log(`❌ 权限测试失败: ${error.message}`);
  }

  console.log('\n=== 数据完整性检查 ===\n');

  // 检查数据完整性
  const tablesToCheck = ['publications', 'patents', 'projects', 'awards'];
  
  for (const table of tablesToCheck) {
    console.log(`\n--- ${table} 数据完整性 ---`);
    
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ 查询错误: ${error.message}`);
        continue;
      }

      console.log(`✅ 记录总数: ${count || 0}`);

      // 如果有数据，检查样本
      if (count && count > 0) {
        const { data: sample, error: sampleError } = await supabase
          .from(table)
          .select('*')
          .limit(3);

        if (sampleError) {
          console.log(`❌ 样本查询错误: ${sampleError.message}`);
        } else if (sample && sample.length > 0) {
          console.log('   样本数据:');
          sample.forEach((record, index) => {
            console.log(`   [${index + 1}] ${JSON.stringify(record, null, 2).substring(0, 100)}...`);
          });
        }
      }

    } catch (error) {
      console.log(`❌ 数据检查失败: ${error.message}`);
    }
  }

  console.log('\n✅ 数据库结构检查完成');
}

checkDatabaseStructure().catch(console.error);