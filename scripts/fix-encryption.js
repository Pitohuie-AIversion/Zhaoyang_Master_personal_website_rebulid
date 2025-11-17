import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// 测试加密解密
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 使用与keyManager.js相同的密钥派生方法
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

async function reStoreApiKey() {
  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiKey || openaiKey === 'your-openai-api-key-here') {
      console.log('⚠️ No valid OpenAI API key found in environment');
      return;
    }
    
    console.log('🔑 Storing OpenAI API key with correct encryption...');
    
    // 使用正确的加密方法重新存储API密钥
    const encryptedKey = encryptKey(openaiKey);
    
    // 首先删除现有的密钥
    const { error: deleteError } = await supabase
      .from('api_keys')
      .delete()
      .eq('key_name', 'openai_api_key');
    
    if (deleteError) {
      console.error('❌ Failed to delete existing key:', deleteError);
    } else {
      console.log('✅ Deleted existing key');
    }
    
    // 存储新的加密密钥
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
      
      // 测试解密
      const { data, error } = await supabase
        .rpc('get_api_key', { p_key_name: 'openai_api_key' });
      
      if (error) {
        console.error('❌ Failed to retrieve key:', error);
      } else if (data && data.length > 0) {
        try {
          const decrypted = decryptKey(data[0].key_value);
          console.log('✅ Decryption test successful:', decrypted.substring(0, 15) + '...');
        } catch (decryptError) {
          console.error('❌ Decryption failed:', decryptError.message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

reStoreApiKey();