const suspiciousPatterns = [
  ['XSS_SCRIPT', /<script[^>]*>/i],
  ['XSS_PROTOCOL', /javascript:/i],
  ['SQL_UNION', /union\s+select/i],
  ['SQL_MUTATION', /(?:drop\s+table|insert\s+into|delete\s+from|update\s+\w+\s+set)/i],
  ['PATH_TRAVERSAL', /\.\.\//],
  ['PROTOTYPE_POLLUTION', /(?:__proto__|constructor\s*\[|prototype\s*\[)/i],
];

export function securityLogger(req, _res, next) {
  const requestText = [
    req.originalUrl || req.url || '',
    JSON.stringify(req.query || {}),
    JSON.stringify(req.body || {}),
  ].join('\n');

  const threats = suspiciousPatterns
    .filter(([, pattern]) => pattern.test(requestText))
    .map(([name]) => name);

  if (threats.length > 0) {
    console.warn(JSON.stringify({
      event: 'suspicious_request',
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      threats,
    }));
  }

  next();
}

export function securityHeaders(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy', "default-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  next();
}
