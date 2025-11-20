import express from 'express';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const router = express.Router();

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// 简单的加密/解密函数（用于测试）
function encryptApiKey(apiKey) {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync('test-encryption-key', 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decryptApiKey(encryptedKey) {
  const [ivHex, encrypted] = encryptedKey.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = crypto.scryptSync('test-encryption-key', 'salt', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 测试安全密钥管理
export const testSecurityEndpoint = async (req, res) => {
  try {
    console.log('🔐 测试安全密钥管理系统...');
    
    // 1. 检查数据库连接
    const { data: testData, error: testError } = await supabase
      .from('api_keys')
      .select('key_name')
      .limit(1);
    
    if (testError) {
      throw new Error(`数据库连接失败: ${testError.message}`);
    }
    
    console.log('✅ 数据库连接正常');
    
    // 2. 检查是否存在 openai_api_key
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key_name', 'openai_api_key')
      .single();
    
    if (keyError || !keyData) {
      console.log('⚠️ openai_api_key 不存在，创建测试密钥');
      
      // 创建测试密钥
      const testApiKey = 'sk-test-123456789-abcdef';
      const encryptedKey = encryptApiKey(testApiKey);
      
      const { data: newKey, error: insertError } = await supabase
        .from('api_keys')
        .insert({
          key_name: 'openai_api_key',
          encrypted_key: encryptedKey,
          description: '测试OpenAI API密钥',
          is_active: true,
          metadata: { service: 'openai', test: true }
        });
      
      if (insertError) {
        throw new Error(`创建密钥失败: ${insertError.message}`);
      }
      
      console.log('✅ 测试密钥已创建');
    } else {
      console.log('✅ 找到现有密钥:', keyData.key_name);
      console.log('   描述:', keyData.description);
      console.log('   状态:', keyData.is_active ? '活跃' : '非活跃');
      console.log('   使用次数:', keyData.usage_count);
      
      // 尝试解密
      try {
        const decryptedKey = decryptApiKey(keyData.encrypted_key);
        console.log('✅ 密钥解密成功');
        console.log('   密钥格式:', decryptedKey.startsWith('sk-') ? '正确' : '可能无效');
      } catch (decryptError) {
        console.log('❌ 密钥解密失败:', decryptError.message);
      }
    }
    
    // 3. 测试函数调用
    const { data: funcData, error: funcError } = await supabase
      .rpc('get_api_key_info', { p_key_name: 'openai_api_key' });
    
    if (funcError) {
      console.log('⚠️ 函数调用失败:', funcError.message);
    } else if (funcData && funcData.length > 0) {
      console.log('✅ 函数调用成功:', funcData[0]);
    }
    
    res.json({
      success: true,
      message: '安全密钥管理系统测试完成',
      details: {
        database_connected: true,
        key_exists: !!keyData,
        key_info: keyData ? {
          name: keyData.key_name,
          description: keyData.description,
          is_active: keyData.is_active,
          usage_count: keyData.usage_count,
          created_at: keyData.created_at
        } : null
      }
    });
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      details: '安全密钥管理系统测试失败'
    });
  }
};

// 保持向后兼容性
router.get('/test-key-management', testSecurityEndpoint);
export default router;
