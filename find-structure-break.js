// Find the exact structural break
import { readFileSync } from 'fs';

const content = readFileSync('./src/locales/en.json', 'utf8');

console.log('🔍 Analyzing JSON structure...\n');

let braceCount = 0;
let inString = false;
let escapeNext = false;
let lineNumber = 1;
let rootObjectEnded = false;
let rootObjectEndLine = 0;
let rootObjectEndPosition = 0;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  const prevChar = i > 0 ? content[i-1] : '';
  
  if (char === '\n') lineNumber++;
  
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
    
    // Check if we have a complete JSON object
    if (braceCount === 0 && char === '}') {
      console.log(`Root object ends at position ${i} (line ${lineNumber})`);
      rootObjectEnded = true;
      rootObjectEndLine = lineNumber;
      rootObjectEndPosition = i;
      
      // Check what comes after
      const remaining = content.substring(i + 1).trim();
      if (remaining && !remaining.startsWith('//') && !remaining.startsWith('/*')) {
        console.log('Remaining content after root object:', remaining.substring(0, 200));
        console.log('This suggests there are multiple root objects!');
      }
      break;
    }
  }
}

// Now let's check what sections exist after the root object end
if (rootObjectEnded) {
  console.log(`\n📋 Content after line ${rootObjectEndLine}:`);
  const remainingContent = content.substring(rootObjectEndPosition + 1);
  const remainingLines = remainingContent.split('\n');
  
  console.log('First 20 lines after root object:');
  for (let i = 0; i < Math.min(20, remainingLines.length); i++) {
    const lineNum = rootObjectEndLine + i + 1;
    console.log(`${lineNum}: ${remainingLines[i]}`);
  }
  
  // Look for section headers
  console.log('\n🔍 Looking for section headers after root object:');
  const sectionMatches = remainingContent.match(/^\s*"(\w+)":\s*{/gm);
  if (sectionMatches) {
    console.log('Found sections:', sectionMatches.map(match => match.match(/"(\w+)"/)[1]));
  }
}