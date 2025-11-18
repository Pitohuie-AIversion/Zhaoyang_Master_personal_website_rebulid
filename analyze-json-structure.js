// Find JSON structure issues
import { readFileSync } from 'fs';

try {
  const content = readFileSync('./src/locales/en.json', 'utf8');
  
  // Try to parse the JSON
  let data;
  try {
    data = JSON.parse(content);
    console.log('✅ JSON parses successfully');
    console.log('Top-level keys:', Object.keys(data));
  } catch (parseError) {
    console.log('❌ JSON parse error:', parseError.message);
    
    // Find the position where parsing fails
    if (parseError.message.includes('position')) {
      const match = parseError.message.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1]);
        console.log('Error at position:', position);
        console.log('Line number:', content.substring(0, position).split('\n').length);
        
        // Show context around error
        const start = Math.max(0, position - 200);
        const end = Math.min(content.length, position + 200);
        console.log('Context around error:');
        console.log(content.substring(start, end));
      }
    }
    process.exit(1);
  }
  
  // Check for multiple root objects by looking for patterns
  console.log('\n🔍 Checking for structural issues:');
  
  // Look for patterns that suggest multiple root objects
  const lines = content.split('\n');
  let braceCount = 0;
  let inString = false;
  let escapeNext = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const prevChar = i > 0 ? content[i-1] : '';
    
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
        console.log(`Potential root object ending at position ${i} (line ${content.substring(0, i).split('\n').length})`);
        
        // Check what comes after
        const remaining = content.substring(i + 1).trim();
        if (remaining && !remaining.startsWith('//') && !remaining.startsWith('/*')) {
          console.log('Remaining content after this point:', remaining.substring(0, 100) + '...');
        }
      }
    }
  }
  
} catch (error) {
  console.log('❌ File reading error:', error.message);
}