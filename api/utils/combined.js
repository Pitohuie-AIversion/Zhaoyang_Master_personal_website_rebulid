/**
 * 合并的工具函数文件 - 减少Vercel函数数量
 * 包含所有工具函数和辅助类
 */

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

/**
 * 安全密钥管理器
 * 提供API密钥的安全存储、检索和使用统计
 */
export class SecureKeyManager {
  constructor(supabase) {
    this.supabase = supabase;
    this.keyCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5分钟缓存
    this.encryptionKey = this.deriveEncryptionKey();
  }

  /**
   * 从环境变量派生加密密钥
   */
  deriveEncryptionKey() {
    const secret = process.env.KEY_ENCRYPTION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) {
      throw new Error('No encryption secret available');
    }
    return crypto.createHash('sha256').update(secret).digest();
  }

  /**
   * 加密API密钥
   */
  encryptKey(apiKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * 解密API密钥
   */
  decryptKey(encryptedData) {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * 获取API密钥（带缓存）
   */
  async getApiKey(keyName) {
    // 检查缓存
    const cached = this.keyCache.get(keyName);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.key;
    }

    try {
      // 从Supabase获取加密密钥
      const { data, error } = await this.supabase
        .rpc('get_api_key', { p_key_name: keyName });

      if (error) {
        throw new Error(`Failed to retrieve API key: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error(`API key '${keyName}' not found or inactive`);
      }

      const keyData = data[0];
      if (!keyData.is_active) {
        throw new Error(`API key '${keyName}' is inactive`);
      }

      // 解密密钥
      const decryptedKey = this.decryptKey(keyData.key_value);
      
      // 缓存密钥
      this.keyCache.set(keyName, {
        key: decryptedKey,
        timestamp: Date.now()
      });

      // 更新使用统计（异步）
      this.updateKeyUsage(keyName, 'get_api_key', 'RPC', 200)
        .catch(err => console.error('Failed to update key usage:', err));

      return decryptedKey;
    } catch (error) {
      console.error('Error retrieving API key:', error);
      throw error;
    }
  }

  /**
   * 更新API密钥使用统计
   */
  async updateKeyUsage(keyName, endpoint, method, statusCode, responseTimeMs = null, errorMessage = null, ipAddress = null, userAgent = null) {
    try {
      const { error } = await this.supabase
        .rpc('update_api_key_usage', {
          p_key_name: keyName,
          p_session_id: null,
          p_endpoint: endpoint,
          p_method: method,
          p_status_code: statusCode,
          p_response_time_ms: responseTimeMs,
          p_error_message: errorMessage,
          p_ip_address: ipAddress,
          p_user_agent: userAgent
        });

      if (error) {
        console.error('Failed to update API key usage:', error);
      }
    } catch (error) {
      console.error('Error updating API key usage:', error);
    }
  }

  /**
   * 安全地存储或更新API密钥
   */
  async storeApiKey(keyName, apiKey, description = '', metadata = {}) {
    try {
      // 加密密钥
      const encryptedKey = this.encryptKey(apiKey);
      
      // 检查是否已存在
      const { data: existing } = await this.supabase
        .from('api_keys')
        .select('id')
        .eq('key_name', keyName)
        .single();

      if (existing) {
        // 更新现有密钥
        const { error } = await this.supabase
          .from('api_keys')
          .update({
            encrypted_key: encryptedKey,
            description: description,
            updated_at: new Date().toISOString(),
            metadata: metadata
          })
          .eq('key_name', keyName);

        if (error) {
          throw new Error(`Failed to update API key: ${error.message}`);
        }

        console.log(`API key '${keyName}' updated successfully`);
      } else {
        // 创建新密钥
        const { error } = await this.supabase
          .from('api_keys')
          .insert({
            key_name: keyName,
            encrypted_key: encryptedKey,
            description: description,
            is_active: true,
            metadata: metadata
          });

        if (error) {
          throw new Error(`Failed to create API key: ${error.message}`);
        }

        console.log(`API key '${keyName}' created successfully`);
      }

      // 清除缓存
      this.keyCache.delete(keyName);
      
      return true;
    } catch (error) {
      console.error('Error storing API key:', error);
      throw error;
    }
  }

  /**
   * 轮换API密钥（安全更新）
  async rotateApiKey(keyName, newApiKey) {
    try {
      // 先停用旧密钥
      await this.supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('key_name', keyName);

      // 创建新密钥记录
      const newKeyName = `${keyName}_rotated_${Date.now()}`;
      await this.storeApiKey(newKeyName, newApiKey, `Rotated from ${keyName}`);

      console.log(`API key '${keyName}' rotated successfully`);
      return newKeyName;
    } catch (error) {
      console.error('Error rotating API key:', error);
      throw error;
    }
  }

  /**
   * 获取API密钥使用统计
   */
  async getKeyUsageStats(keyName = null) {
    try {
      let query = this.supabase
        .from('api_keys')
        .select(`
          key_name,
          description,
          is_active,
          usage_count,
          last_used_at,
          created_at,
          metadata
        `);

      if (keyName) {
        query = query.eq('key_name', keyName);
      }

      const { data, error } = await query.order('usage_count', { ascending: false });

      if (error) {
        throw new Error(`Failed to retrieve usage stats: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error retrieving usage stats:', error);
      throw error;
    }
  }

  /**
   * 清除缓存（用于密钥更新后）
   */
  clearCache(keyName = null) {
    if (keyName) {
      this.keyCache.delete(keyName);
    } else {
      this.keyCache.clear();
    }
  }

  /**
   * 验证API密钥格式
   */
  validateApiKeyFormat(apiKey, service) {
    const patterns = {
      openai: /^sk-[a-zA-Z0-9]{48}$/,
      anthropic: /^sk-ant-[a-zA-Z0-9]{40,}$/,
      google: /^AIza[0-9A-Za-z_-]{35}$/
    };

    const pattern = patterns[service];
    if (!pattern) {
      return true; // 未知服务，不验证格式
    }

    return pattern.test(apiKey);
  }
}

/**
 * 通用工具函数
 */
export const utils = {
  /**
   * 生成随机字符串
   */
  generateRandomString(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * 验证邮箱格式
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 验证手机号格式
   */
  validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },

  /**
   * 安全地获取嵌套对象属性
   */
  safeGet(obj, path, defaultValue = null) {
    try {
      return path.split('.').reduce((o, p) => o && o[p], obj) || defaultValue;
    } catch {
      return defaultValue;
    }
  },

  /**
   * 深度克隆对象
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const cloned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key]);
        }
      }
      return cloned;
    }
  },

  /**
   * 防抖函数
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 节流函数
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * 格式化日期时间
   */
  formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },

  /**
   * 计算文件大小（带单位）
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * 清理HTML标签
   */
  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  },

  /**
   * 生成UUID
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * 验证URL格式
   */
  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * 获取客户端IP地址
   */
  getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    const remoteAddress = req.connection?.remoteAddress;
    
    return forwarded?.split(',')[0] || realIp || remoteAddress || 'unknown';
  },

  /**
   * 安全地解析JSON
   */
  safeJsonParse(str, defaultValue = null) {
    try {
      return JSON.parse(str);
    } catch {
      return defaultValue;
    }
  },

  /**
   * 等待指定时间
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

export default {
  SecureKeyManager,
  utils
};