import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取翻译文件
const zhTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/zh.json'), 'utf8'));
const enTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en.json'), 'utf8'));

console.log('=== 翻译文件结构分析 ===\n');

// 分析中文文件结构
console.log('中文文件顶级结构:');
Object.keys(zhTranslations).forEach(key => {
  const value = zhTranslations[key];
  if (typeof value === 'object' && value !== null) {
    console.log(`- ${key}: ${Array.isArray(value) ? '数组' : '对象'} (${Array.isArray(value) ? value.length : Object.keys(value).length} 项)`);
  } else {
    console.log(`- ${key}: ${typeof value}`);
  }
});

console.log('\n英文文件顶级结构:');
Object.keys(enTranslations).forEach(key => {
  const value = enTranslations[key];
  if (typeof value === 'object' && value !== null) {
    console.log(`- ${key}: ${Array.isArray(value) ? '数组' : '对象'} (${Array.isArray(value) ? value.length : Object.keys(value).length} 项)`);
  } else {
    console.log(`- ${key}: ${typeof value}`);
  }
});

console.log('\n=== 详细内容检查 ===');

// 检查home部分
console.log('\n1. home部分:');
console.log('中文home键:', Object.keys(zhTranslations.home || {}));
console.log('英文home键:', Object.keys(enTranslations.home || {}));

// 检查research部分
console.log('\n2. research部分:');
console.log('中文research键:', Object.keys(zhTranslations.research || {}));
console.log('英文research键:', Object.keys(enTranslations.research || {}));

// 检查about部分
console.log('\n3. about部分:');
console.log('中文about键:', Object.keys(zhTranslations.about || {}));
console.log('英文about键:', Object.keys(enTranslations.about || {}));

// 检查projects部分
console.log('\n4. projects部分:');
console.log('中文projects键:', Object.keys(zhTranslations.projects || {}));
console.log('英文projects键:', Object.keys(enTranslations.projects || {}));

// 检查skills部分
console.log('\n5. skills部分:');
console.log('中文skills键:', Object.keys(zhTranslations.skills || {}));
console.log('英文skills键:', Object.keys(enTranslations.skills || {}));