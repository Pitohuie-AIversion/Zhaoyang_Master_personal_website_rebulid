import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug the exact JSON parsing issue
function debugJSONParsing() {
  console.log('=== Debugging JSON Parsing Issue ===');
  
  const enPath = path.join(__dirname, 'src/locales/en.json');
  const enContent = fs.readFileSync(enPath, 'utf8');
  
  console.log('File size:', enContent.length, 'characters');
  
  // Parse the JSON
  const enData = JSON.parse(enContent);
  
  console.log('Parsed successfully!');
  console.log('Type of parsed data:', typeof enData);
  console.log('Is array?', Array.isArray(enData));
  console.log('Is object?', typeof enData === 'object' && !Array.isArray(enData));
  
  const allKeys = Object.keys(enData);
  console.log('Total keys found:', allKeys.length);
  console.log('Keys:', allKeys);
  
  // Check if there are nested objects that might be causing issues
  allKeys.forEach(key => {
    const value = enData[key];
    console.log(`${key}: ${typeof value} ${Array.isArray(value) ? '(array)' : ''}`);
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      console.log(`  Keys in ${key}:`, Object.keys(value).length);
    }
  });
  
  // Check specifically for particleField
  console.log('\n=== Checking particleField ===');
  if (enData.particleField) {
    console.log('✅ particleField exists');
    console.log('particleField type:', typeof enData.particleField);
    console.log('particleField keys:', Object.keys(enData.particleField));
  } else {
    console.log('❌ particleField does NOT exist');
    
    // Let's see what's actually in the object
    console.log('Available sections:');
    allKeys.forEach(key => {
      console.log(`- ${key}`);
    });
  }
  
  // Try to manually check if particleField is somewhere in the file
  console.log('\n=== Manual search for particleField ===');
  const particleFieldIndex = enContent.indexOf('"particleField"');
  if (particleFieldIndex !== -1) {
    console.log('Found "particleField" at character position:', particleFieldIndex);
    const context = enContent.slice(Math.max(0, particleFieldIndex - 50), particleFieldIndex + 100);
    console.log('Context:', context);
  } else {
    console.log('"particleField" not found in file');
  }
}

debugJSONParsing();