// Check the exact structure around the research section
import { readFileSync } from 'fs';

const content = readFileSync('./src/locales/en.json', 'utf8');

console.log('🔍 Examining research section structure...\n');

// Find the research section and what comes after
const lines = content.split('\n');
let researchStartLine = -1;
let researchEndLine = -1;
let inResearch = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('"research": {')) {
    researchStartLine = i + 1;
    inResearch = true;
    braceCount = 1;
    continue;
  }
  
  if (inResearch) {
    // Count braces to find the end of research section
    for (const char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
    
    if (braceCount === 0) {
      researchEndLine = i + 1;
      inResearch = false;
      
      // Check what comes after
      console.log(`Research section ends at line ${researchEndLine}`);
      console.log(`Last few lines of research section:`);
      for (let j = Math.max(0, i - 5); j <= i; j++) {
        console.log(`${j + 1}: ${lines[j]}`);
      }
      
      console.log('\nWhat comes after research section:');
      for (let j = i + 1; j < Math.min(lines.length, i + 10); j++) {
        console.log(`${j + 1}: ${lines[j]}`);
      }
      
      break;
    }
  }
}

// Now let's check if there's a structural break
console.log('\n🔍 Checking for structural breaks...');

// Look for the pattern that might indicate multiple root objects
const contentStr = content.substring(researchEndLine * 50); // Get content after research
const nextSectionMatch = contentStr.match(/^\s*"(\w+)":\s*{/m);

if (nextSectionMatch) {
  console.log(`Next section found: "${nextSectionMatch[1]}"`);
  
  // Check if it's properly integrated
  const beforeNext = content.substring(0, contentStr.indexOf(nextSectionMatch[0]) + (researchEndLine * 50));
  const lastFewLines = beforeNext.split('\n').slice(-10);
  
  console.log('\nContent before next section:');
  lastFewLines.forEach((line, idx) => {
    console.log(`${researchEndLine - 10 + idx + 1}: ${line}`);
  });
}