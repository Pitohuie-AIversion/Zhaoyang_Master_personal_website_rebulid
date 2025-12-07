// Find the exact structural break point
import { readFileSync } from 'fs';

const content = readFileSync('./src/locales/en.json', 'utf8');

console.log('🔍 Finding structural break...\n');

// Let's manually parse and find where it breaks
let braceCount = 0;
let inString = false;
let escapeNext = false;
let lineNumber = 1;
let charPosition = 0;
let currentKey = '';
let inKey = false;
let topLevelKeys = [];

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  const prevChar = i > 0 ? content[i-1] : '';
  
  if (char === '\n') {
    lineNumber++;
    charPosition = 0;
  } else {
    charPosition++;
  }
  
  if (escapeNext) {
    escapeNext = false;
    continue;
  }
  
  if (char === '\\' && inString) {
    escapeNext = true;
    continue;
  }
  
  if (char === '"' && prevChar !== '\\') {
    inString = !inString;
    if (!inString && inKey) {
      // End of key
      if (braceCount === 1) {
        topLevelKeys.push(currentKey);
        console.log(`Found top-level key: "${currentKey}" at line ${lineNumber}`);
      }
      currentKey = '';
      inKey = false;
    } else if (inString && braceCount === 1 && prevChar === ':') {
      // Start of a key at top level
      inKey = true;
    }
    continue;
  }
  
  if (inString && inKey) {
    currentKey += char;
  }
  
  if (!inString) {
    if (char === '{') braceCount++;
    if (char === '}') braceCount--;
    
    // Check if we have a complete JSON object
    if (braceCount === 0 && char === '}') {
      console.log(`\n🚨 Root object ends at position ${i} (line ${lineNumber})`);
      console.log(`Found ${topLevelKeys.length} top-level keys: ${topLevelKeys.join(', ')}`);
      
      // Check what comes after
      const remaining = content.substring(i + 1).trim();
      if (remaining) {
        console.log(`Remaining content: "${remaining.substring(0, 50)}..."`);
        console.log('This indicates multiple root objects!');
      }
      break;
    }
  }
}

// Now let's check if we can find the sections that should be there
console.log('\n📋 Searching for missing sections...');
const sections = ['about', 'projects', 'skills', 'contact', 'footer', 'seo', 'particleField', 'blog'];

for (const section of sections) {
  const regex = new RegExp(`^\\s*"${section}":\\s*{`, 'gm');
  const matches = content.match(regex);
  if (matches) {
    console.log(`✅ Found "${section}" section in file`);
  } else {
    console.log(`❌ Missing "${section}" section`);
  }
}