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

async function checkContactMessages() {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('查询错误:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('目前没有联系信息');
      return;
    }

    console.log('最新的联系信息:');
    console.log('='.repeat(50));
    
    data.forEach((message, index) => {
      console.log(`\n[${index + 1}] ${message.name} - ${message.email}`);
      console.log(`主题: ${message.subject}`);
      console.log(`消息: ${message.message.substring(0, 100)}${message.message.length > 100 ? '...' : ''}`);
      console.log(`状态: ${message.status}`);
      console.log(`时间: ${new Date(message.created_at).toLocaleString('zh-CN')}`);
      
      if (message.collaboration_type) {
        console.log(`合作类型: ${message.collaboration_type}`);
      }
      if (message.company) {
        console.log(`公司: ${message.company}`);
      }
      if (message.phone) {
        console.log(`电话: ${message.phone}`);
      }
      
      console.log('-'.repeat(30));
    });

    console.log(`\n总计: ${data.length} 条消息`);

  } catch (error) {
    console.error('错误:', error);
  }
}

checkContactMessages();
