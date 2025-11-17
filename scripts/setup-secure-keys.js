import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// 加密配置
const ENCRYPTION_KEY = process.env.KEY_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16; // AES块大小

/**
 * 加密API密钥
 */
function encryptApiKey(apiKey) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32); // 32字节密钥用于AES-256
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * 解密API密钥
 */
function decryptApiKey(encryptedKey) {
  const [ivHex, encrypted] = encryptedKey.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32); // 32字节密钥用于AES-256
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * 初始化Supabase客户端
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * 存储API密钥到数据库
 */
async function storeApiKey(keyName, apiKey, description = '', metadata = {}) {
  try {
    const supabase = getSupabaseClient();
    
    // 加密API密钥
    const encryptedKey = encryptApiKey(apiKey);
    
    // 存储到数据库
    const { data, error } = await supabase
      .from('api_keys')
      .upsert({
        key_name: keyName,
        encrypted_key: encryptedKey,
        description: description,
        is_active: true,
        metadata: metadata,
        created_by: null // 系统操作
      }, {
        onConflict: 'key_name'
      });
    
    if (error) {
      throw new Error(`Failed to store API key: ${error.message}`);
    }
    
    console.log(`✅ API密钥 "${keyName}" 已成功存储到数据库`);
    return true;
  } catch (error) {
    console.error('❌ 存储API密钥失败:', error.message);
    return false;
  }
}

/**
 * 从数据库获取API密钥
 */
async function getApiKey(keyName) {
  try {
    const supabase = getSupabaseClient();
    
    // 获取密钥信息
    const { data, error } = await supabase
      .rpc('get_api_key_info', {
        p_key_name: keyName
      });
    
    if (error || !data || data.length === 0) {
      throw new Error('API key not found');
    }
    
    const keyInfo = data[0];
    if (!keyInfo.key_exists || !keyInfo.is_active) {
      throw new Error('API key not found or inactive');
    }
    
    // 获取加密的密钥
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('encrypted_key')
      .eq('key_name', keyName)
      .eq('is_active', true)
      .single();
    
    if (keyError || !keyData) {
      throw new Error('Failed to retrieve encrypted key');
    }
    
    // 解密密钥
    const decryptedKey = decryptApiKey(keyData.encrypted_key);
    
    // 更新使用统计
    await supabase.rpc('update_api_key_usage', {
      p_key_name: keyName,
      p_session_id: 'system_retrieval',
      p_endpoint: '/api/key/retrieve',
      p_method: 'GET',
      p_status_code: 200
    });
    
    return {
      key: decryptedKey,
      usageCount: keyInfo.usage_count,
      lastUsedAt: keyInfo.last_used_at,
      metadata: keyInfo.metadata
    };
  } catch (error) {
    console.error('❌ 获取API密钥失败:', error.message);
    return null;
  }
}

/**
 * 显示使用说明
 */
function showUsage() {
  console.log(`
🔐 API密钥安全管理工具

使用方法:
1. 存储API密钥:
   node scripts/setup-secure-keys.js store <key_name> <api_key> [description]

2. 获取API密钥:
   node scripts/setup-secure-keys.js get <key_name>

3. 加密测试:
   node scripts/setup-secure-keys.js encrypt <text>

示例:
   node scripts/setup-secure-keys.js store openai_api_key sk-xxx "OpenAI GPT-4 API密钥"
   node scripts/setup-secure-keys.js get openai_api_key
   node scripts/setup-secure-keys.js encrypt "test-secret"

注意:
- 确保已设置环境变量: VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE_KEY
- 加密密钥会自动生成并存储在环境变量中
`);
}

/**
 * 主函数
 */
async function main() {
  const command = process.argv[2];
  
  if (!command) {
    showUsage();
    return;
  }
  
  try {
    switch (command) {
      case 'store':
        const keyName = process.argv[3];
        const apiKey = process.argv[4];
        const description = process.argv[5] || '';
        
        if (!keyName || !apiKey) {
          console.error('❌ 请提供密钥名称和API密钥');
          return;
        }
        
        await storeApiKey(keyName, apiKey, description);
        break;
        
      case 'get':
        const getKeyName = process.argv[3];
        if (!getKeyName) {
          console.error('❌ 请提供密钥名称');
          return;
        }
        
        const result = await getApiKey(getKeyName);
        if (result) {
          console.log(`✅ 成功获取密钥信息:`);
          console.log(`   密钥: ${result.key.substring(0, 20)}...`);
          console.log(`   使用次数: ${result.usageCount}`);
          console.log(`   最后使用: ${result.lastUsedAt}`);
          console.log(`   元数据:`, result.metadata);
        } else {
          console.log('❌ 密钥不存在或无效');
        }
        break;
        
      case 'encrypt':
        const text = process.argv[3];
        if (!text) {
          console.error('❌ 请提供要加密的文本');
          return;
        }
        
        const encrypted = encryptApiKey(text);
        console.log(`🔐 加密结果: ${encrypted}`);
        
        const decrypted = decryptApiKey(encrypted);
        console.log(`🔓 解密验证: ${decrypted}`);
        break;
        
      default:
        showUsage();
    }
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  encryptApiKey,
  decryptApiKey,
  storeApiKey,
  getApiKey
};