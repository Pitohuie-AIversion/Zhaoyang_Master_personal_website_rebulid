import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual JSON parsing to find the break point
function manualJSONParse() {
  console.log('=== Manual JSON Parsing Test ===');
  
  const enPath = path.join(__dirname, 'src/locales/en.json');
  const enContent = fs.readFileSync(enPath, 'utf8');
  
  // Try to parse smaller chunks to find where it breaks
  const lines = enContent.split('\n');
  
  console.log('Total lines:', lines.length);
  
  // Try parsing chunks progressively
  let chunkSize = 100;
  let lastSuccessfulChunk = 0;
  
  for (let i = 1; i <= lines.length; i += chunkSize) {
    const chunk = lines.slice(0, i).join('\n');
    
    // Add closing braces if needed to make valid JSON
    let testJSON = chunk;
    if (!chunk.trim().endsWith('}')) {
      testJSON = chunk + '\n}';
    }
    
    try {
      const parsed = JSON.parse(testJSON);
      const keys = Object.keys(parsed);
      console.log(`Lines 1-${i}: Found ${keys.length} keys - ${keys.join(', ')}`);
      lastSuccessfulChunk = i;
    } catch (error) {
      console.log(`Lines 1-${i}: Parse failed - ${error.message}`);
      break;
    }
  }
  
  console.log('\n=== Checking around the break point ===');
  // Look more carefully around the break point
  const startLine = Math.max(0, lastSuccessfulChunk - 10);
  const endLine = Math.min(lines.length, lastSuccessfulChunk + 20);
  
  console.log(`Lines ${startLine + 1} to ${endLine + 1}:`);
  for (let i = startLine; i < endLine; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
  
  // Try to find unmatched braces
  console.log('\n=== Brace Matching Analysis ===');
  let openBraces = 0;
  let closeBraces = 0;
  
  for (let i = 0; i < Math.min(lines.length, 200); i++) {
    const line = lines[i];
    openBraces += (line.match(/\{/g) || []).length;
    closeBraces += (line.match(/\}/g) || []).length;
    
    if (i > 190) { // Show last few lines of first 200
      console.log(`${i + 1}: ${line} (braces: ${openBraces - closeBraces})`);
    }
  }
  
  console.log(`After 200 lines: Open braces: ${openBraces}, Close braces: ${closeBraces}, Net: ${openBraces - closeBraces}`);
}

manualJSONParse();