import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the exact JSON syntax error
function findJSONError() {
  console.log('=== Finding JSON Syntax Error ===');
  
  const enPath = path.join(__dirname, 'src/locales/en.json');
  const enContent = fs.readFileSync(enPath, 'utf8');
  
  // Try to parse the JSON and get detailed error info
  try {
    const parsed = JSON.parse(enContent);
    console.log('✅ JSON parsing successful');
    console.log('Top-level keys:', Object.keys(parsed));
    return;
  } catch (error) {
    console.error('❌ JSON parsing failed:', error.message);
    console.error('Error name:', error.name);
    
    // Try to find the error location
    const errorMessage = error.message;
    console.log('Full error message:', errorMessage);
    
    // Look for position information
    const positionMatch = errorMessage.match(/position (\d+)/);
    if (positionMatch) {
      const position = parseInt(positionMatch[1]);
      console.log('Error at character position:', position);
      
      // Show context around the error
      const start = Math.max(0, position - 100);
      const end = Math.min(enContent.length, position + 100);
      const context = enContent.slice(start, end);
      
      console.log('Context around error:');
      console.log('...' + context + '...');
      
      // Find line number
      const lines = enContent.slice(0, position).split('\n');
      const errorLine = lines.length;
      console.log('Error around line:', errorLine);
      
      // Show line context
      const allLines = enContent.split('\n');
      const lineContext = allLines.slice(Math.max(0, errorLine - 3), Math.min(allLines.length, errorLine + 3));
      console.log('Line context:');
      lineContext.forEach((line, idx) => {
        console.log(`${errorLine - 2 + idx}: ${line}`);
      });
    }
  }
}

findJSONError();