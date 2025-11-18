import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://auoxidsodyvjcjzfthot.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1b3hpZHNvZHl2amNqemZ0aG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQyMjg2OCwiZXhwIjoyMDc0OTk4ODY4fQ.8lx_biGkWo9NYJiSqFCQHXjFEB8eKzp8jvAGZwtsVQ4'
);

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