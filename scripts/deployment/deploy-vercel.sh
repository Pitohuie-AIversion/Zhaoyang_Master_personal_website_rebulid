#!/bin/bash

# Vercel部署脚本 - 修复PDF下载问题
echo "🚀 开始部署到Vercel并修复PDF问题..."

# 检查Vercel CLI是否安装
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI未安装，请先安装: npm i -g vercel"
    exit 1
fi

# 显示当前配置
echo "📋 当前Vercel配置:"
cat vercel.json | grep -A 5 -B 5 "pdf"

# 检查PDF文件
echo "📁 检查PDF文件:"
ls -la public/*.pdf
ls -la resume/*.pdf

# 复制PDF文件到正确的位置
echo "📋 确保PDF文件在正确位置..."
if [ ! -d "public" ]; then
    mkdir public
fi

# 复制最新的简历文件
cp resume/cn_Resume_compressed-1-2.pdf public/cn_resume.pdf
cp resume/en_Resume_compressed.pdf public/en_resume.pdf

echo "✅ PDF文件已更新到public目录"

# 检查Git状态
echo "📊 Git状态:"
git status

# 添加更改
echo "📥 添加更改到Git..."
git add public/*.pdf
git add vercel.json
git add src/pages/Home.tsx

# 提交更改
echo "💾 提交更改..."
git commit -m "修复Vercel PDF下载功能: 更新配置文件和文件路径"

# 推送到GitHub
echo "🚀 推送到GitHub..."
git push origin master

# 部署到Vercel
echo "🌐 部署到Vercel..."
vercel --prod

echo "✅ 部署完成！"
echo "📄 测试PDF下载链接:"
echo "   - 中文简历: https://your-domain.vercel.app/cn_resume.pdf"
echo "   - 英文简历: https://your-domain.vercel.app/en_resume.pdf"
echo ""
echo "🔍 如果仍然有问题，请检查:"
echo "   1. Vercel控制台中的构建日志"
echo "   2. 确认PDF文件在构建输出中"
echo "   3. 检查Vercel重写规则是否生效"