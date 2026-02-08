import fs from 'fs';
import path from 'path';

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function collectKeys(obj, prefix = '', keys = new Set()) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const k of Object.keys(obj)) {
      const nextPrefix = prefix ? `${prefix}.${k}` : k;
      keys.add(nextPrefix);
      collectKeys(obj[k], nextPrefix, keys);
    }
  } else if (Array.isArray(obj)) {
    keys.add(prefix);
  }
  return keys;
}

function diffSets(a, b) {
  const missingInA = [...b].filter(k => !a.has(k));
  const missingInB = [...a].filter(k => !b.has(k));
  return { missingInA, missingInB };
}

function validateJSONStructure() {
  const root = process.cwd();
  const enPath = path.join(root, 'src/locales/en.json');
  const zhPath = path.join(root, 'src/locales/zh.json');
  const en = readJSON(enPath);
  const zh = readJSON(zhPath);

  const enKeys = collectKeys(en);
  const zhKeys = collectKeys(zh);
  const { missingInA: missingInEn, missingInB: missingInZh } = diffSets(enKeys, zhKeys);

  console.log('=== i18n JSON 结构校验 ===');
  console.log(`English keys: ${enKeys.size}, Chinese keys: ${zhKeys.size}`);
  if (missingInEn.length > 0) {
    console.log(`⚠️  英文缺失键 (${missingInEn.length}):`);
    console.log(missingInEn.slice(0, 50).join('\n'));
  }
  if (missingInZh.length > 0) {
    console.log(`⚠️  中文缺失键 (${missingInZh.length}):`);
    console.log(missingInZh.slice(0, 50).join('\n'));
  }
  if (missingInEn.length === 0 && missingInZh.length === 0) {
    console.log('✅ en/zh 键集合一致');
  }
}

function scanHardcodedText() {
  const srcDir = path.join(process.cwd(), 'src');
  const exts = new Set(['.tsx', '.ts', '.jsx', '.js']);
  const suspicious = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (exts.has(path.extname(entry.name))) {
        const content = fs.readFileSync(full, 'utf8');
        const lines = content.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const regex = />\s*([^<{][^<]{1,})\s*</g;
          let m;
          while ((m = regex.exec(line)) !== null) {
            const text = m[1].trim();
            if (text.length < 2 || /^[\d\s\-_.,!@#$%^&*()+={}|\\:;"'<>?/~`]*$/.test(text)) continue;
            if (line.includes('t(') || line.includes('{t(')) continue;
            suspicious.push({ file: full, line: i + 1, snippet: text });
          }
        }
      }
    }
  }

  console.log('\n=== JSX 硬编码文案扫描（启发式） ===');
  try {
    walk(srcDir);
    if (suspicious.length === 0) {
      console.log('✅ 未发现疑似硬编码文本');
    } else {
      console.log(`⚠️  发现疑似硬编码文本 ${suspicious.length} 处，示例前十：`);
      for (const s of suspicious.slice(0, 10)) {
        console.log(`- ${s.file}:${s.line} ==> "${s.snippet}"`);
      }
    }
  } catch (e) {
    console.log('扫描过程中出现错误：', e.message);
  }
}

function main() {
  validateJSONStructure();
  scanHardcodedText();
}

main();
