import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the exact error at character position 3106
function findExactError() {
  console.log('=== Finding Exact Error at Position 3106 ===');
  
  const enPath = path.join(__dirname, 'src/locales/en.json');
  const enContent = fs.readFileSync(enPath, 'utf8');
  
  console.log('Total file size:', enContent.length, 'characters');
  
  // Show context around position 3106
  const errorPos = 3106;
  const start = Math.max(0, errorPos - 50);
  const end = Math.min(enContent.length, errorPos + 50);
  
  console.log('Context around position 3106:');
  console.log('Position:', errorPos);
  console.log('Character at position:', JSON.stringify(enContent[errorPos]));
  console.log('Context:');
  console.log('...' + enContent.slice(start, end) + '...');
  
  // Find the line number for this position
  const lines = enContent.slice(0, errorPos).split('\n');
  const errorLine = lines.length;
  console.log('Error is on line:', errorLine);
  
  // Show line context
  const allLines = enContent.split('\n');
  console.log('Line context:');
  for (let i = Math.max(0, errorLine - 3); i < Math.min(allLines.length, errorLine + 3); i++) {
    console.log(`${i + 1}: ${allLines[i]}`);
  }
  
  // Check what comes right before position 3106
  console.log('\nWhat comes right before position 3106:');
  const before = enContent.slice(errorPos - 10, errorPos + 1);
  console.log('Before:', JSON.stringify(before));
  
  // Check if there's a syntax issue
  console.log('\nChecking for common JSON syntax issues:');
  
  // Look for trailing commas
  const beforeText = enContent.slice(errorPos - 20, errorPos);
  if (beforeText.includes(',')) {
    console.log('Found comma before error position');
    console.log('Text before:', JSON.stringify(beforeText));
  }
  
  // Look for unmatched quotes
  const quoteCount = (beforeText.match(/"/g) || []).length;
  console.log('Quote count in preceding text:', quoteCount);
  
  // Try to parse just the beginning up to the error
  const testChunk = enContent.slice(0, errorPos);
  try {
    // Try to parse as JSON (this might fail, but gives us info)
    JSON.parse(testChunk);
    console.log('Chunk up to error position parses successfully');
  } catch (error) {
    console.log('Chunk up to error position fails:', error.message);
  }
}

findExactError();