#!/bin/bash

# 安全验证脚本
# 用于验证所有安全增强措施是否正确实施

echo "🛡️ 开始安全验证测试..."
echo "=================================="

# 检查安全头
echo "🔒 检查安全头配置..."
curl -s -I http://localhost:5173 | grep -E "(X-Content-Type-Options|X-Frame-Options|X-XSS-Protection|Content-Security-Policy|Referrer-Policy|Permissions-Policy|Strict-Transport-Security)"

echo ""
echo "🚦 测试API限流..."
# 快速发送多个请求测试限流
for i in {1..5}; do
    echo "请求 $i:"
    curl -s -X POST http://localhost:3001/api/chat/message \
        -H "Content-Type: application/json" \
        -d '{"message":"测试消息","sessionId":"test-session"}' \
        -w "HTTP状态: %{http_code}\n" -o /dev/null
done

echo ""
echo "📁 测试文件上传限制..."
# 测试不允许的文件类型
echo "测试HTML文件上传:"
curl -s -X POST http://localhost:3001/api/upload/files \
    -F "files=@test.html" \
    -w "HTTP状态: %{http_code}\n" -o /dev/null 2>/dev/null || echo "连接失败"

echo ""
echo "🌐 检查CORS配置..."
curl -s -H "Origin: https://malicious-site.com" \
    -I http://localhost:3001/api/health | grep -i "access-control-allow-origin"

echo ""
echo "📝 测试安全日志..."
# 发送可疑载荷
curl -s -X POST http://localhost:3001/api/chat/message \
    -H "Content-Type: application/json" \
    -d '{"message":"<script>alert(\"xss\")</script>","sessionId":"test"}' \
    -w "HTTP状态: %{http_code}\n" -o /dev/null

echo ""
echo "✅ 基础安全验证完成！"
echo "请检查服务器日志中的安全警告信息"