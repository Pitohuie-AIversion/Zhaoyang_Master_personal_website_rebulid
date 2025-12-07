const fs = require('fs');
const path = require('path');

const zhPath = path.join(__dirname, '../src/locales/zh.json');
const enPath = path.join(__dirname, '../src/locales/en.json');

const zh = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Helper to flatten object to map: path -> value
function flatten(obj, prefix = '') {
  let map = {};
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(map, flatten(obj[key], fullKey));
    } else {
      map[fullKey] = obj[key];
    }
  }
  return map;
}

const enFlat = flatten(en);
const enKeys = Object.keys(enFlat);

// Build a map of leaf keys to potential full paths in EN
// e.g. 'title' -> ['home.title', 'academic.title', ...]
const leafMap = {};
for (const key of enKeys) {
  const leaf = key.split('.').pop();
  if (!leafMap[leaf]) leafMap[leaf] = [];
  leafMap[leaf].push(key);
}

function findEnValue(zhKey, zhValue) {
  // 1. Exact match
  if (enFlat[zhKey]) return enFlat[zhKey];

  // 2. Try swapping 'research' <-> 'academic'
  let tryKey = zhKey;
  if (zhKey.startsWith('research.')) {
    tryKey = zhKey.replace('research.', 'academic.');
    if (enFlat[tryKey]) return enFlat[tryKey];
  } else if (zhKey.startsWith('academic.')) {
    tryKey = zhKey.replace('academic.', 'research.');
    if (enFlat[tryKey]) return enFlat[tryKey];
  }

  // 3. Try removing root prefix (e.g. 'about.' might be in 'academic.about.' or just 'about.')
  // Actually, zh 'about' might be en 'research' (title="About Me")
  if (zhKey.startsWith('about.')) {
     // try academic.about
     tryKey = 'academic.' + zhKey;
     if (enFlat[tryKey]) return enFlat[tryKey];
     // try research (en.research has 'introduction' etc)
     tryKey = zhKey.replace('about.', 'research.');
     if (enFlat[tryKey]) return enFlat[tryKey];
  }
  
  if (zhKey.startsWith('publications.')) {
     tryKey = 'academic.' + zhKey;
     if (enFlat[tryKey]) return enFlat[tryKey];
     tryKey = 'research.' + zhKey;
     if (enFlat[tryKey]) return enFlat[tryKey];
  }

  if (zhKey.startsWith('projects.')) {
     tryKey = 'research.' + zhKey;
     if (enFlat[tryKey]) return enFlat[tryKey];
  }

  // 4. Try leaf match if unique or if context matches
  // This is risky, skipping for now to avoid wrong translations.

  // 5. Special manual mappings
  if (zhKey === 'about.title') return "About Me";
  
  // Fallback
  // If the value is a string, return [EN] + zhValue (or just zhValue if looks like code)
  if (typeof zhValue === 'string') {
     // If it's a code-like key (no spaces, short), keep it
     if (!zhValue.includes(' ') && zhValue.length < 20) return zhValue;
     // If it contains Chinese, prefix [EN]
     if (/[\u4e00-\u9fa5]/.test(zhValue)) return `[EN] ${zhValue}`;
     return zhValue;
  }
  return zhValue;
}

function restructure(zhObj, prefix = '') {
  if (Array.isArray(zhObj)) {
    // For arrays, we just return them. 
    // Ideally we should map array items too if they are objects, 
    // but usually locale arrays are simple strings or static lists.
    // Let's check if EN has this array at the mapped path.
    const enVal = findEnValue(prefix, zhObj);
    if (Array.isArray(enVal)) return enVal;
    return zhObj;
  }

  if (typeof zhObj === 'object' && zhObj !== null) {
    const newObj = {};
    for (const key in zhObj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      newObj[key] = restructure(zhObj[key], fullKey);
    }
    return newObj;
  }

  return findEnValue(prefix, zhObj);
}

const newEn = restructure(zh);

// Write to file
fs.writeFileSync(enPath, JSON.stringify(newEn, null, 2), 'utf8');
console.log('Successfully restructured en.json to match zh.json structure.');
