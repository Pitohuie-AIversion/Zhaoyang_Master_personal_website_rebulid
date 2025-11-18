import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test JSON structure validation
function testJSONStructure() {
  console.log('Testing JSON structure validation...');
  
  try {
    // Test English JSON
    const enPath = path.join(__dirname, 'src/locales/en.json');
    const enContent = fs.readFileSync(enPath, 'utf8');
    const enData = JSON.parse(enContent);
    
    console.log('✅ English JSON is valid');
    console.log('English top-level keys:', Object.keys(enData));
    
    // Test Chinese JSON
    const zhPath = path.join(__dirname, 'src/locales/zh.json');
    const zhContent = fs.readFileSync(zhPath, 'utf8');
    const zhData = JSON.parse(zhContent);
    
    console.log('✅ Chinese JSON is valid');
    console.log('Chinese top-level keys:', Object.keys(zhData));
    
    // Compare structure
    const enKeys = Object.keys(enData);
    const zhKeys = Object.keys(zhData);
    
    console.log('\nStructure comparison:');
    console.log('English keys count:', enKeys.length);
    console.log('Chinese keys count:', zhKeys.length);
    
    // Check for missing keys
    const missingInEn = zhKeys.filter(key => !enKeys.includes(key));
    const missingInZh = enKeys.filter(key => !zhKeys.includes(key));
    
    if (missingInEn.length > 0) {
      console.log('⚠️  Missing in English:', missingInEn);
    }
    if (missingInZh.length > 0) {
      console.log('⚠️  Missing in Chinese:', missingInZh);
    }
    
    if (missingInEn.length === 0 && missingInZh.length === 0) {
      console.log('✅ Both files have matching structure');
    }
    
    return true;
  } catch (error) {
    console.error('❌ JSON validation failed:', error.message);
    return false;
  }
}

// Test specific translation keys
function testTranslationKeys() {
  console.log('\nTesting specific translation keys...');
  
  try {
    const enPath = path.join(__dirname, 'src/locales/en.json');
    const zhPath = path.join(__dirname, 'src/locales/zh.json');
    
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const zhData = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
    
    // Test particleField keys
    const testKeys = [
      'particleField.backToHome',
      'particleField.mainTitle',
      'particleField.features.realtime',
      'particleField.settings.particles',
      'particleField.settings.postProcess'
    ];
    
    testKeys.forEach(key => {
      const enValue = getNestedValue(enData, key);
      const zhValue = getNestedValue(zhData, key);
      
      if (enValue && zhValue) {
        console.log(`✅ ${key}: EN="${enValue}", ZH="${zhValue}"`);
      } else {
        console.log(`❌ ${key}: EN=${enValue ? '✓' : '✗'}, ZH=${zhValue ? '✓' : '✗'}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Translation key test failed:', error.message);
  }
}

// Helper function to get nested values
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Run tests
console.log('=== Language Switching Validation ===');
const jsonValid = testJSONStructure();
if (jsonValid) {
  testTranslationKeys();
}
console.log('\n=== Test Complete ===');