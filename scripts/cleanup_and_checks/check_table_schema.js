import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
