import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detailed JSON structure analysis
function analyzeJSONStructure() {
  console.log('=== Detailed JSON Structure Analysis ===');
  
  try {
    // Test English JSON
    const enPath = path.join(__dirname, 'src/locales/en.json');
    const enContent = fs.readFileSync(enPath, 'utf8');
    
    console.log('English file size:', enContent.length, 'characters');
    
    // Try to parse and check for issues
    let enData;
    try {
      enData = JSON.parse(enContent);
      console.log('✅ English JSON parsing successful');
    } catch (parseError) {
      console.error('❌ English JSON parsing failed:', parseError.message);
      
      // Try to find the exact error location
      const lines = enContent.split('\n');
      console.log('File has', lines.length, 'lines');
      
      // Check for common JSON issues
      const braceCount = (enContent.match(/\{/g) || []).length;
      const closeBraceCount = (enContent.match(/\}/g) || []).length;
      console.log('Opening braces:', braceCount, 'Closing braces:', closeBraceCount);
      
      if (braceCount !== closeBraceCount) {
        console.log('❌ Mismatched braces detected!');
      }
      
      return;
    }
    
    console.log('English top-level sections:', Object.keys(enData));
    
    // Check each section
    Object.keys(enData).forEach(section => {
      console.log(`Section "${section}" type:`, typeof enData[section]);
      if (typeof enData[section] === 'object') {
        console.log(`  Keys in ${section}:`, Object.keys(enData[section]).length);
      }
    });
    
    // Test Chinese JSON
    const zhPath = path.join(__dirname, 'src/locales/zh.json');
    const zhContent = fs.readFileSync(zhPath, 'utf8');
    const zhData = JSON.parse(zhContent);
    
    console.log('\nChinese top-level sections:', Object.keys(zhData));
    
    // Compare sections
    const enSections = Object.keys(enData);
    const zhSections = Object.keys(zhData);
    
    console.log('\n=== Section Comparison ===');
    console.log('English sections:', enSections.length);
    console.log('Chinese sections:', zhSections.length);
    
    const missingInEn = zhSections.filter(section => !enSections.includes(section));
    const missingInZh = enSections.filter(section => !zhSections.includes(section));
    
    if (missingInEn.length > 0) {
      console.log('Missing in English:', missingInEn);
    }
    if (missingInZh.length > 0) {
      console.log('Missing in Chinese:', missingInZh);
    }
    
    // Test specific particleField keys
    console.log('\n=== ParticleField Key Test ===');
    if (enData.particleField) {
      console.log('English particleField keys:', Object.keys(enData.particleField));
      
      const testKeys = [
        'backToHome',
        'mainTitle', 
        'features',
        'settings',
        'shortcuts'
      ];
      
      testKeys.forEach(key => {
        const exists = enData.particleField[key] !== undefined;
        console.log(`  ${key}: ${exists ? '✅' : '❌'}`);
      });
    } else {
      console.log('❌ particleField section missing in English');
    }
    
    if (zhData.particleField) {
      console.log('Chinese particleField keys:', Object.keys(zhData.particleField));
    } else {
      console.log('❌ particleField section missing in Chinese');
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run analysis
analyzeJSONStructure();