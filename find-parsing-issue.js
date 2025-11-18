// Find the exact parsing issue
import { readFileSync } from 'fs';

const content = readFileSync('./src/locales/en.json', 'utf8');

console.log('🔍 Finding exact parsing issue...\n');

// Try to parse with more detailed error reporting
try {
  const data = JSON.parse(content);
  console.log('✅ JSON parses successfully');
  console.log('Keys found:', Object.keys(data));
} catch (error) {
  console.log('❌ JSON parsing error:', error.message);
  
  // Try to find where it might be cutting off
  const lines = content.split('\n');
  
  // Look for potential issues
  console.log('\n🔍 Looking for structural issues...');
  
  // Check for multiple root objects by looking for top-level patterns
  const topLevelPattern = /^\s*"(\w+)":\s*{/gm;
  const matches = [...content.matchAll(topLevelPattern)];
  
  console.log('Top-level sections found:');
  matches.forEach((match, index) => {
    const lineNum = content.substring(0, match.index).split('\n').length;
    console.log(`${index + 1}. "${match[1]}" at line ${lineNum}`);
  });
  
  // Try to manually trace the structure
  console.log('\n📊 Manual structure trace:');
  let braceCount = 0;
  let inString = false;
  let escapeNext = false;
  let lineNum = 1;
  let foundSections = [];
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const prevChar = i > 0 ? content[i-1] : '';
    
    if (char === '\n') lineNum++;
    
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
      continue;
    }
    
    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      
      // Look for top-level keys
      if (braceCount === 1) {
        // Check if we're at a top-level key
        const remaining = content.substring(i);
        const keyMatch = remaining.match(/^\s*{\s*"(\w+)":/);
        if (keyMatch && foundSections.length < 10) { // Limit to avoid too much output
          foundSections.push({key: keyMatch[1], position: i, line: lineNum});
        }
      }
      
      // Check if we complete the root object
      if (braceCount === 0 && char === '}') {
        console.log(`Root object completes at line ${lineNum}, position ${i}`);
        console.log(`Sections found so far: ${foundSections.map(s => s.key).join(', ')}`);
        
        // Check what comes after
        const remaining = content.substring(i + 1).trim();
        if (remaining && !remaining.startsWith('//') && !remaining.startsWith('/*')) {
          console.log(`Remaining content: "${remaining.substring(0, 100)}..."`);
        }
        break;
      }
    }
  }
}