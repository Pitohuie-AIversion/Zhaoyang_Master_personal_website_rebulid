import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test JSON parsing with detailed error reporting
function testJSONParsing() {
  console.log('=== Testing JSON Parsing ===');
  
  const enPath = path.join(__dirname, 'src/locales/en.json');
  const enContent = fs.readFileSync(enPath, 'utf8');
  
  console.log('File size:', enContent.length, 'characters');
  console.log('Last 100 characters:');
  console.log('"' + enContent.slice(-100) + '"');
  
  try {
    const enData = JSON.parse(enContent);
    console.log('✅ JSON parsing successful');
    console.log('Top-level keys found:', Object.keys(enData));
    
    // Check if particleField exists
    if (enData.particleField) {
      console.log('✅ particleField section found');
      console.log('particleField keys:', Object.keys(enData.particleField));
    } else {
      console.log('❌ particleField section NOT found');
    }
    
    // Check other sections
    const expectedSections = ['about', 'skills', 'contact', 'footer', 'seo', 'projects', 'publications'];
    expectedSections.forEach(section => {
      if (enData[section]) {
        console.log(`✅ ${section} section found`);
      } else {
        console.log(`❌ ${section} section NOT found`);
      }
    });
    
  } catch (error) {
    console.error('❌ JSON parsing failed:', error.message);
    
    // Try to find the error location
    const lines = enContent.split('\n');
    console.log('Total lines:', lines.length);
    
    // Look for potential issues
    const lastFewLines = lines.slice(-10);
    console.log('Last 10 lines:');
    lastFewLines.forEach((line, index) => {
      console.log(`${lines.length - 9 + index}: ${line}`);
    });
  }
}

testJSONParsing();