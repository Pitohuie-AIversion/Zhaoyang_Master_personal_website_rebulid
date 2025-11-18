// Debug JSON parsing issue
import { readFileSync } from 'fs';

const content = readFileSync('./src/locales/en.json', 'utf8');

console.log('📊 File analysis:');
console.log('- Total characters:', content.length);
console.log('- Total lines:', content.split('\n').length);

// Try to parse the JSON
try {
  const data = JSON.parse(content);
  console.log('\n✅ JSON parsing successful');
  console.log('Number of top-level keys:', Object.keys(data).length);
  console.log('Top-level keys:', Object.keys(data));
  
  // Let's check if there are any issues with the data structure
  console.log('\n🔍 Detailed key analysis:');
  for (const key of Object.keys(data)) {
    const value = data[key];
    console.log(`- ${key}: ${typeof value} (${Array.isArray(value) ? 'array' : typeof value})`);
  }
  
} catch (error) {
  console.log('\n❌ JSON parsing failed:', error.message);
  
  // Try to find the exact error location
  try {
    // Use a more forgiving JSON parser to get better error info
    const lines = content.split('\n');
    console.log('\n📍 Checking around potential error areas...');
    
    // Look for common JSON syntax issues
    const issues = [];
    
    // Check for trailing commas
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.match(/^},?\s*$/)) {
        // This could be a trailing comma issue
        console.log(`Line ${i + 1}: Potential trailing comma issue: ${line}`);
      }
    }
    
    // Check for unclosed braces
    let openBraces = 0;
    let openBrackets = 0;
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
        if (char === '{') openBraces++;
        if (char === '}') openBraces--;
        if (char === '[') openBrackets++;
        if (char === ']') openBrackets--;
      }
    }
    
    console.log(`Final brace count: ${openBraces}`);
    console.log(`Final bracket count: ${openBrackets}`);
    
  } catch (debugError) {
    console.log('Debug error:', debugError.message);
  }
}