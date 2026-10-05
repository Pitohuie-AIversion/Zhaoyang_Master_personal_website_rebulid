import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import * as pdfParse from 'pdf-parse';

// Supabase client setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

// PDF Processing Service
export class PDFResumeProcessor {
  constructor() {
    this.supabase = supabase;
  }

  /**
   * 处理PDF文件并提取文本内容
   */
  async processPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse.default(dataBuffer);
      
      return {
        text: data.text,
        pages: data.numpages,
        info: data.info
      };
    } catch (error) {
      console.error('PDF处理错误:', error);
      throw new Error(`PDF处理失败: ${error.message}`);
    }
  }

  /**
   * 将PDF信息保存到数据库
   */
  async savePDFInfo(filename, pdfData) {
    try {
      const { data, error } = await this.supabase
        .from('pdf_resumes')
        .insert([{
          filename,
          text_content: pdfData.text,
          page_count: pdfData.pages,
          metadata: pdfData.info,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('保存PDF信息错误:', error);
      throw error;
    }
  }

  /**
   * 从数据库获取PDF信息
   */
  async getPDFInfo(filename) {
    try {
      const { data, error } = await this.supabase
        .from('pdf_resumes')
        .select('*')
        .eq('filename', filename)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('获取PDF信息错误:', error);
      throw error;
    }
  }
}

// Resume Sync Service
export class ResumeSyncService {
  constructor() {
    this.supabase = supabase;
  }

  /**
   * 同步简历文件信息到数据库
   */
  async syncResumeFiles() {
    try {
      const resumeDir = path.join(process.cwd(), 'resume');
      const files = fs.readdirSync(resumeDir);
      const pdfFiles = files.filter(file => file.endsWith('.pdf'));

      const results = [];
      for (const filename of pdfFiles) {
        const filePath = path.join(resumeDir, filename);
        const stats = fs.statSync(filePath);
        
        const { error } = await this.supabase
          .from('resume_files')
          .upsert({
            filename,
            file_size: stats.size,
            last_modified: stats.mtime,
            file_path: `/resume/${filename}`,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'filename'
          });

        if (error) throw error;
        results.push({ filename, status: 'synced' });
      }

      return results;
    } catch (error) {
      console.error('简历文件同步错误:', error);
      throw error;
    }
  }

  /**
   * 获取简历文件列表
   */
  async getResumeFiles() {
    try {
      const { data, error } = await this.supabase
        .from('resume_files')
        .select('*')
        .order('last_modified', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('获取简历文件错误:', error);
      throw error;
    }
  }
}

// Secure Key Manager
export class SecureKeyManager {
  constructor() {
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
      throw new Error('缺少密钥加密密钥');
    }
    return crypto.createHash('sha256').update(secret).digest();
  }

  /**
   * 加密API密钥
   */
  encryptApiKey(apiKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * 解密API密钥
   */
  decryptApiKey(encryptedKey) {
    const [ivHex, encrypted] = encryptedKey.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * 安全地获取API密钥
   */
  async getApiKey(serviceName) {
    try {
      // 检查缓存
      const cacheKey = `api_key_${serviceName}`;
      const cached = this.keyCache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        return cached.key;
      }

      // 从数据库获取
      const { data, error } = await this.supabase
        .from('api_keys')
        .select('encrypted_key')
        .eq('service_name', serviceName)
        .single();

      if (error) throw error;
      if (!data) return null;

      // 解密密钥
      const decryptedKey = this.decryptApiKey(data.encrypted_key);
      
      // 缓存密钥
      this.keyCache.set(cacheKey, {
        key: decryptedKey,
        expiry: Date.now() + this.cacheExpiry
      });

      return decryptedKey;
    } catch (error) {
      console.error('获取API密钥错误:', error);
      return null;
    }
  }

  /**
   * 安全地存储API密钥
   */
  async storeApiKey(serviceName, apiKey) {
    try {
      const encryptedKey = this.encryptApiKey(apiKey);
      
      const { data, error } = await this.supabase
        .from('api_keys')
        .upsert({
          service_name: serviceName,
          encrypted_key: encryptedKey,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'service_name'
        });

      if (error) throw error;
      
      // 清除缓存
      const cacheKey = `api_key_${serviceName}`;
      this.keyCache.delete(cacheKey);
      
      return data;
    } catch (error) {
      console.error('存储API密钥错误:', error);
      throw error;
    }
  }
}

// Security Logger and Middleware
export class SecurityLogger {
  constructor() {
    this.suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,  // XSS脚本注入
      /javascript:/gi,                   // JavaScript协议
      /on\w+\s*=/gi,                     // 事件处理器
      /union\s+select/gi,               // SQL注入
      /drop\s+table/gi,                 // SQL删除表
      /insert\s+into/gi,                 // SQL插入
      /delete\s+from/gi,                 // SQL删除
      /update\s+\w+\s+set/gi,           // SQL更新
      /\.\.\//g,                         // 路径遍历
      /\/etc\/passwd/g,                  // Unix密码文件
      /\/windows\/system32/gi,          // Windows系统文件
      /<iframe/gi,                      // iframe注入
      /<object/gi,                      // object标签
      /<embed/gi,                       // embed标签
      /eval\s*\(/gi,                     // eval函数
      /base64_decode/gi,               // base64解码
      /__proto__/gi,                     // 原型污染
      /constructor/gi,                   // 构造函数
      /prototype/gi                      // 原型链
    ];
  }

  /**
   * 检测可疑请求
   */
  detectSuspiciousActivity(req) {
    const suspiciousActivities = [];
    const requestData = {
      url: req.url,
      query: JSON.stringify(req.query),
      body: JSON.stringify(req.body),
      headers: JSON.stringify(req.headers),
      userAgent: req.get('User-Agent') || ''
    };

    // 检查每个数据字段
    Object.entries(requestData).forEach(([field, data]) => {
      this.suspiciousPatterns.forEach((pattern, index) => {
        if (pattern.test(data)) {
          suspiciousActivities.push({
            type: this.getAttackType(index),
            field: field,
            pattern: pattern.toString(),
            data: data.substring(0, 200) // 限制日志长度
          });
        }
      });
    });

    return suspiciousActivities;
  }

  /**
   * 获取攻击类型
   */
  getAttackType(patternIndex) {
    const attackTypes = [
      'XSS_SCRIPT', 'XSS_JAVASCRIPT', 'XSS_EVENT', 'SQL_UNION', 'SQL_DROP',
      'SQL_INSERT', 'SQL_DELETE', 'SQL_UPDATE', 'PATH_TRAVERSAL', 'FILE_ACCESS',
      'WINDOWS_FILE', 'IFRAME_INJECTION', 'OBJECT_INJECTION', 'EMBED_INJECTION',
      'EVAL_INJECTION', 'BASE64_DECODE', 'PROTO_POLLUTION', 'CONSTRUCTOR_ACCESS',
      'PROTOTYPE_ACCESS'
    ];
    return attackTypes[patternIndex] || 'UNKNOWN';
  }

  /**
   * 安全日志中间件
   */
  middleware() {
    return (req, res, next) => {
      const suspiciousActivities = this.detectSuspiciousActivity(req);
      
      if (suspiciousActivities.length > 0) {
        console.warn('🚨 检测到可疑活动:', {
          ip: req.ip,
          url: req.url,
          activities: suspiciousActivities,
          timestamp: new Date().toISOString()
        });

        // 记录到数据库（异步）
        this.logSecurityEvent(req, suspiciousActivities).catch(console.error);
      }

      next();
    };
  }

  /**
   * 记录安全事件到数据库
   */
  async logSecurityEvent(req, activities) {
    try {
      if (!supabase) return;

      const { error } = await supabase
        .from('security_logs')
        .insert([{
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.get('User-Agent') || 'unknown',
          request_url: req.url,
          request_method: req.method,
          threat_types: activities.map(a => a.type),
          details: activities,
          risk_level: activities.length > 3 ? 'HIGH' : activities.length > 1 ? 'MEDIUM' : 'LOW',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      console.log('✅ 安全事件已记录');
    } catch (error) {
      console.error('记录安全事件失败:', error);
    }
  }
}

// 安全响应头中间件
export const securityHeaders = (req, res, next) => {
  // 安全响应头
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // CSP 头部
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.zhaoyangmu.cloud " + (process.env.VITE_SUPABASE_URL || "https://auoxidsodyvjcjzfthot.supabase.co") + "; " +
    "style-src 'self' 'unsafe-inline'; " +
    "script-src 'self'; " +
    "font-src 'self'; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "frame-ancestors 'none'"
  );
  
  next();
};

// 请求大小限制中间件
export const requestSizeLimit = (req, res, next) => {
  const contentLength = req.headers['content-length'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    return res.status(413).json({
      error: 'Request entity too large',
      maxSize: '10MB',
      received: contentLength
    });
  }
  
  next();
};

// 创建全局安全日志实例
const securityLoggerInstance = new SecurityLogger();

// 导出安全中间件函数
export const securityLogger = securityLoggerInstance.middleware();

// 默认导出兼容中间件
export default function securityMiddleware() {
  return {
    securityLogger,
    securityHeaders,
    requestSizeLimit
  };
}
