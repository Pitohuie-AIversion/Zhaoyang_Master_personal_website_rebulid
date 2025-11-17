import fs from 'fs';
import path from 'path';

function readJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

function walkDir(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, filelist);
    } else {
      filelist.push(fullPath);
    }
  });
  return filelist;
}

function extractTranslationKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const keys = new Set();
  const regex = /\bt\(\s*['"]([^'"\)]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  return Array.from(keys);
}

function hasKey(obj, dottedKey) {
  const parts = dottedKey.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) {
      cur = cur[p];
    } else {
      return false;
    }
  }
  return cur !== undefined && cur !== null;
}

function getType(obj, dottedKey) {
  const parts = dottedKey.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) {
      cur = cur[p];
    } else {
      return 'missing';
    }
  }
  if (Array.isArray(cur)) return 'array';
  return typeof cur;
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function logSection(title) {
  console.log(`\n=== ${title} ===`);
}

const root = process.cwd();
const zhPath = path.join(root, 'src', 'locales', 'zh.json');
const enPath = path.join(root, 'src', 'locales', 'en.json');
const zh = readJson(zhPath);
const en = readJson(enPath);

const srcDir = path.join(root, 'src');
const files = walkDir(srcDir).filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'));

let keys = [];
files.forEach((f) => {
  const ks = extractTranslationKeysFromFile(f);
  keys.push(...ks);
});
keys = uniq(keys);

const missingZh = [];
const missingEn = [];
const typeMismatches = [];

keys.forEach((key) => {
  const zhHas = hasKey(zh, key);
  const enHas = hasKey(en, key);
  if (!zhHas) missingZh.push(key);
  if (!enHas) missingEn.push(key);
  if (zhHas && enHas) {
    const tZh = getType(zh, key);
    const tEn = getType(en, key);
    if (tZh !== tEn) {
      typeMismatches.push({ key, zh: tZh, en: tEn });
    }
  }
});

logSection('翻译键扫描结果');
console.log(`总键数: ${keys.length}`);
console.log(`中文缺失: ${missingZh.length}`);
console.log(`英文缺失: ${missingEn.length}`);
console.log(`类型不一致: ${typeMismatches.length}`);

if (missingZh.length) {
  logSection('中文缺失键');
  missingZh.slice(0, 50).forEach((k) => console.log(k));
}
if (missingEn.length) {
  logSection('英文缺失键');
  missingEn.slice(0, 50).forEach((k) => console.log(k));
}
if (typeMismatches.length) {
  logSection('类型不一致');
  typeMismatches.slice(0, 50).forEach((m) => console.log(`${m.key} zh=${m.zh} en=${m.en}`));
}

const criticalKeys = [
  'particleField.backToHome',
  'particleField.title',
  'particleField.toggleStats',
  'particleField.demo',
  'particleField.settings',
  'particleField.mainTitle',
  'particleField.description',
  'particleField.features.realtime',
  'particleField.features.interactive',
  'particleField.features.responsive',
  'particleField.technicalFeatures',
  'particleField.tech.performance',
  'particleField.tech.performanceDesc',
  'particleField.tech.interaction',
  'particleField.tech.interactionDesc',
  'particleField.tech.visual',
  'particleField.tech.visualDesc',
  'particleField.tech.adaptive',
  'particleField.tech.adaptiveDesc',
  'particleField.performanceStats',
  'particleField.particles',
  'particleField.frameTime',
  'particleField.memory',
  'particleField.settings.title',
  'particleField.settings.particles',
  'particleField.settings.postProcess',
  'particleField.settings.interaction',
  'particleField.settings.presets',
  'footer.personalInfo.name',
  'footer.personalInfo.nameEn',
  'footer.personalInfo.description'
];

const criticalMissing = [];
criticalKeys.forEach((key) => {
  if (!hasKey(zh, key) || !hasKey(en, key)) {
    criticalMissing.push(key);
  }
});

logSection('关键键检查');
if (criticalMissing.length === 0) {
  console.log('所有关键键在中英文中均存在');
} else {
  console.log('缺失关键键:');
  criticalMissing.forEach((k) => console.log(k));
}

logSection('关键键存在性详细');
criticalKeys.forEach((key) => {
  const zhHas = hasKey(zh, key);
  const enHas = hasKey(en, key);
  console.log(`${key} zh=${zhHas} en=${enHas} zhType=${getType(zh, key)} enType=${getType(en, key)}`);
});

const result = {
  totalKeys: keys.length,
  missingZhCount: missingZh.length,
  missingEnCount: missingEn.length,
  typeMismatchCount: typeMismatches.length,
  criticalMissingCount: criticalMissing.length
};

logSection('结果摘要');
console.log(JSON.stringify(result, null, 2));

if (criticalMissing.length || missingZh.length || missingEn.length) {
  process.exitCode = 1;
}
