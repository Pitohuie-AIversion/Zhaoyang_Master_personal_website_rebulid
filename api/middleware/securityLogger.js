/**
 * 安全日志中间件
 * 检测和记录可疑请求活动
 */

const securityLogger = (req, res, next) => {
  // 定义可疑模式
  const suspiciousPatterns = [
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
    /<object/gi,                      // object标签注入
    /eval\s*\(/gi,                     // eval函数调用
    /document\.cookie/gi,              // Cookie访问
    /window\.location/gi,              // 重定向尝试
    /base64_decode/gi,                // Base64解码（PHP）
    /__proto__/g,                     // 原型污染
    /constructor/g,                   // 构造函数攻击
    /process\.env/g,                   // 环境变量访问
    /require\s*\(/g,                   // Node.js模块加载
    /fs\.readFile/g,                   // 文件系统访问
    /child_process/g                   // 子进程创建
  ];

  // 检测内容
  const contentToCheck = [
    req.url,
    req.headers['user-agent'] || '',
    req.headers['referer'] || '',
    JSON.stringify(req.body || {}),
    req.query ? JSON.stringify(req.query) : ''
  ].join(' ');

  // 检测可疑模式
  const detectedThreats = [];
  suspiciousPatterns.forEach((pattern, index) => {
    if (pattern.test(contentToCheck)) {
      const threatNames = [
        'XSS_SCRIPT', 'JS_PROTOCOL', 'EVENT_HANDLER', 'SQL_UNION',
        'SQL_DROP', 'SQL_INSERT', 'SQL_DELETE', 'SQL_UPDATE',
        'PATH_TRAVERSAL', 'UNIX_PASSWORD', 'WINDOWS_SYSTEM',
        'IFRAME_INJECT', 'OBJECT_INJECT', 'EVAL_FUNCTION',
        'COOKIE_ACCESS', 'LOCATION_REDIRECT', 'BASE64_DECODE',
        'PROTO_POLLUTION', 'CONSTRUCTOR_ATTACK', 'ENV_ACCESS',
        'MODULE_REQUIRE', 'FILE_SYSTEM', 'CHILD_PROCESS'
      ];
      detectedThreats.push(threatNames[index] || `PATTERN_${index}`);
    }
  });

  // 记录安全日志
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    referer: req.headers['referer'],
    threats: detectedThreats,
    riskLevel: detectedThreats.length > 0 ? 'HIGH' : 'LOW'
  };

  // 如果有威胁，记录详细日志
  if (detectedThreats.length > 0) {
    console.warn(`[SECURITY_ALERT] ${logData.riskLevel} risk detected from ${logData.ip}:`, {
      threats: detectedThreats,
      url: logData.url,
      userAgent: logData.userAgent
    });

    // 高风险请求可以在这里添加额外的处理
    if (detectedThreats.length >= 3) {
      // 可以在这里添加IP封锁逻辑
      console.error(`[SECURITY_BLOCK] Multiple threats detected, consider blocking IP: ${logData.ip}`);
    }
  }

  // 记录正常访问日志（开发环境）
  if (process.env.NODE_ENV !== 'production' && detectedThreats.length === 0) {
    console.log(`[ACCESS] ${logData.method} ${logData.url} from ${logData.ip}`);
  }

  // 添加安全信息到请求对象
  req.security = {
    threats: detectedThreats,
    riskLevel: logData.riskLevel,
    isSuspicious: detectedThreats.length > 0
  };

  next();
};

/**
 * 安全响应头中间件
 */
export const securityHeaders = (req, res, next) => {
  // 防止点击劫持
  res.setHeader('X-Frame-Options', 'DENY');
  
  // 防止MIME类型嗅探
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS保护
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // 禁用服务器头信息
  res.removeHeader('X-Powered-By');
  
  // 安全传输
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  
  next();
};

/**
 * 请求大小限制中间件
 */
export const requestSizeLimit = (maxSize = '1mb') => {
  return (req, res, next) => {
    const maxBytes = typeof maxSize === 'string' ? 
      parseInt(maxSize) * 1024 * 1024 : maxSize;
    
    let bodySize = 0;
    
    req.on('data', (chunk) => {
      bodySize += chunk.length;
      if (bodySize > maxBytes) {
        req.destroy();
        res.status(413).json({ 
          error: 'Request entity too large',
          maxSize: maxSize
        });
      }
    });
    
    next();
  };
};

/**
 * IP黑名单检查中间件
 */
export const ipBlacklistCheck = (blacklist = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (blacklist.includes(clientIP)) {
      console.warn(`[SECURITY_BLOCK] Blocked request from blacklisted IP: ${clientIP}`);
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Your IP address has been blocked'
      });
    }
    
    next();
  };
};

export default securityLogger;