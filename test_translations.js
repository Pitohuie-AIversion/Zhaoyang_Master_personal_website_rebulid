// Test script to verify translation functionality
import fs from 'fs';

console.log('🧪 Testing Translation Files...\n');

// Test English translations
try {
  const enTranslations = JSON.parse(fs.readFileSync('./src/locales/en.json', 'utf8'));
  console.log('✅ English JSON structure is valid');
  
  // Check all top-level sections exist
  const expectedSections = [
    'common', 'navigation', 'home', 'academic', 'research', 
    'publications', 'projects', 'about', 'skills', 'contact', 
    'footer', 'seo', 'particleField'
  ];
  
  const actualSections = Object.keys(enTranslations);
  console.log(`📋 Found ${actualSections.length} sections: ${actualSections.join(', ')}`);
  
  // Check if all expected sections are present
  const missingSections = expectedSections.filter(section => !actualSections.includes(section));
  if (missingSections.length > 0) {
    console.log(`⚠️  Missing sections: ${missingSections.join(', ')}`);
  } else {
    console.log('✅ All expected sections are present');
  }
  
  // Check particleField section specifically
  if (enTranslations.particleField) {
    console.log('✅ particleField section found');
    const particleKeys = Object.keys(enTranslations.particleField);
    console.log(`📋 particleField has ${particleKeys.length} keys: ${particleKeys.slice(0, 5).join(', ')}...`);
  }
  
} catch (error) {
  console.log(`❌ English JSON error: ${error.message}`);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test Chinese translations
try {
  const zhTranslations = JSON.parse(fs.readFileSync('./src/locales/zh.json', 'utf8'));
  console.log('✅ Chinese JSON structure is valid');
  
  const zhSections = Object.keys(zhTranslations);
  console.log(`📋 Found ${zhSections.length} sections: ${zhSections.join(', ')}`);
  
  if (zhTranslations.particleField) {
    console.log('✅ particleField section found in Chinese');
  }
  
} catch (error) {
  console.log(`❌ Chinese JSON error: ${error.message}`);
}

console.log('\n🎉 Translation validation complete!');