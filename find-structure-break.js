import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the exact break point in JSON structure
function findStructureBreak() {
  console.log('=== Finding Structure Break ===');
  
  const enPath = path.join(__dirname, 'src/locales/en.json');
  const enContent = fs.readFileSync(enPath, 'utf8');
  
  // Split into lines and find where sections should be
  const lines = enContent.split('\n');
  
  console.log('Total lines:', lines.length);
  
  // Look for section transitions
  let sectionStarts = [];
  lines.forEach((line, index) => {
    if (line.trim().match(/^"[a-zA-Z]+"\s*:\s*\{$/)) {
      sectionStarts.push({
        line: index + 1,
        content: line.trim(),
        context: lines.slice(Math.max(0, index-2), Math.min(lines.length, index+3)).join('\n')
      });
    }
  });
  
  console.log('\nSection transitions found:');
  sectionStarts.forEach(section => {
    console.log(`Line ${section.line}: ${section.content}`);
  });
  
  // Check around line 1069 where the issue might be
  console.log('\n=== Checking around line 1069 ===');
  const contextLines = lines.slice(1065, 1075);
  contextLines.forEach((line, index) => {
    console.log(`${1066 + index}: ${line}`);
  });
  
  // Try to parse JSON and catch the exact error
  try {
    JSON.parse(enContent);
    console.log('✅ JSON parsing successful');
  } catch (error) {
    console.error('❌ JSON parsing failed:', error.message);
    
    // Try to extract more context around the error
    const errorMessage = error.message;
    const lineMatch = errorMessage.match(/position (\d+)/);
    if (lineMatch) {
      const position = parseInt(lineMatch[1]);
      console.log('Error around character position:', position);
      
      // Find the line number
      let charCount = 0;
      let errorLine = 0;
      for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1; // +1 for newline
        if (charCount >= position) {
          errorLine = i + 1;
          break;
        }
      }
      
      console.log('Error around line:', errorLine);
      if (errorLine > 0) {
        const context = lines.slice(Math.max(0, errorLine - 3), Math.min(lines.length, errorLine + 3));
        console.log('Context around error:');
        context.forEach((line, idx) => {
          console.log(`${errorLine - 2 + idx}: ${line}`);
        });
      }
    }
  }
}

findStructureBreak();