const fs = require('fs');

// 读取翻译文件
const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));

// 递归获取所有键
function getKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

const zhKeys = getKeys(zh);
const enKeys = getKeys(en);

console.log('中文键数量:', zhKeys.length);
console.log('英文键数量:', enKeys.length);

const missingInEn = zhKeys.filter(key => !enKeys.includes(key));
const missingInZh = enKeys.filter(key => !zhKeys.includes(key));

if (missingInEn.length > 0) {
  console.log('\n英文文件中缺失的键:');
  missingInEn.forEach(key => console.log('  -', key));
}

if (missingInZh.length > 0) {
  console.log('\n中文文件中缺失的键:');
  missingInZh.forEach(key => console.log('  -', key));
}

if (missingInEn.length === 0 && missingInZh.length === 0) {
  console.log('\n✅ 中英文翻译文件键结构完全一致');
} else {
  console.log('\n❌ 发现键结构不一致问题');
}

// 检查重复键
function findDuplicateKeys(obj, prefix = '', seen = new Set()) {
  const duplicates = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (seen.has(fullKey)) {
      duplicates.push(fullKey);
    } else {
      seen.add(fullKey);
    }
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      duplicates.push(...findDuplicateKeys(obj[key], fullKey, seen));
    }
  }
  return duplicates;
}

const zhDuplicates = findDuplicateKeys(zh);
const enDuplicates = findDuplicateKeys(en);

if (zhDuplicates.length > 0) {
  console.log('\n中文文件中的重复键:');
  zhDuplicates.forEach(key => console.log('  -', key));
}

if (enDuplicates.length > 0) {
  console.log('\n英文文件中的重复键:');
  enDuplicates.forEach(key => console.log('  -', key));
}