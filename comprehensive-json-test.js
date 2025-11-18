// Comprehensive JSON structure test
import { readFileSync } from 'fs';

try {
  const content = readFileSync('./src/locales/en.json', 'utf8');
  const data = JSON.parse(content);
  
  console.log('✅ JSON parsing successful');
  console.log('Total top-level keys:', Object.keys(data).length);
  console.log('All top-level keys:', Object.keys(data).sort());
  
  // Check each expected section
  const expectedSections = [
    'common', 'navigation', 'home', 'publications', 'research', 
    'about', 'projects', 'skills', 'contact', 'footer', 'seo', 'particleField', 'blog'
  ];
  
  console.log('\n📋 Section verification:');
  for (const section of expectedSections) {
    const exists = !!data[section];
    console.log(`${exists ? '✅' : '❌'} ${section}: ${exists ? 'Found' : 'Missing'}`);
  }
  
  // Check specific nested keys that were problematic
  console.log('\n🔍 Detailed checks:');
  
  // Check footer.personalInfo
  if (data.footer) {
    console.log(`footer.personalInfo: ${data.footer.personalInfo ? 'Found' : 'Missing'}`);
    if (data.footer.personalInfo) {
      console.log(`  - name: ${data.footer.personalInfo.name || 'Missing'}`);
      console.log(`  - nameEn: ${data.footer.personalInfo.nameEn || 'Missing'}`);
    }
  }
  
  // Check particleField
  if (data.particleField) {
    console.log(`particleField structure: ${typeof data.particleField}`);
    if (data.particleField.settings) {
      console.log(`  - settings: Found (${Object.keys(data.particleField.settings).length} keys)`);
    }
  }
  
  // Check seo
  if (data.seo) {
    console.log(`seo structure: ${typeof data.seo}`);
    if (data.seo.pages) {
      console.log(`  - pages: Found`);
    }
  }
  
} catch (error) {
  console.log('❌ JSON parsing failed:', error.message);
  console.log('Stack:', error.stack);
}