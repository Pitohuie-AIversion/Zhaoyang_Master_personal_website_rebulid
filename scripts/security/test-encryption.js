import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// 测试加密解密
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const encryptionKey = crypto.createHash('sha256').update(process.env.SUPABASE_SERVICE_ROLE_KEY).digest();

function encryptKey(apiKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decryptKey(encryptedData) {
  const parts = encryptedData.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

async function testEncryption() {
  try {
    // 测试基本加密解密
    const testKey = 'sk-test123456789';
    const encrypted = encryptKey(testKey);
    const decrypted = decryptKey(encrypted);
    console.log('✅ Basic encryption test:', decrypted === testKey ? 'PASSED' : 'FAILED');
    
    // 检查数据库中的密钥
    const { data, error } = await supabase
      .rpc('get_api_key', { p_key_name: 'openai_api_key' });
    
    if (error) {
      console.error('❌ Database error:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️ No API key found in database');
      
      // 存储新的API密钥
      const openaiKey = process.env.OPENAI_API_KEY;
      if (openaiKey && openaiKey !== 'your-openai-api-key-here') {
        const encryptedKey = encryptKey(openaiKey);
        
        const { error: insertError } = await supabase
          .from('api_keys')
          .insert({
            key_name: 'openai_api_key',
            encrypted_key: encryptedKey,
            description: 'OpenAI API Key for GPT-4 integration',
            is_active: true
          });
        
        if (insertError) {
          console.error('❌ Failed to store API key:', insertError);
        } else {
          console.log('✅ API key stored successfully');
        }
      } else {
        console.log('⚠️ No OpenAI API key in environment');
      }
    } else {
      console.log('✅ Found API key in database');
      const keyData = data[0];
      
      try {
        const decrypted = decryptKey(keyData.key_value);
        console.log('✅ Decryption test:', decrypted.substring(0, 10) + '...');
      } catch (decryptError) {
        console.error('❌ Decryption failed:', decryptError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEncryption();