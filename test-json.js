// Test JSON structure
import { readFileSync } from 'fs';

try {
  const enContent = readFileSync('./src/locales/en.json', 'utf8');
  const enData = JSON.parse(enContent);
  
  console.log('✅ English JSON parsed successfully');
  console.log('Top-level keys:', Object.keys(enData));
  console.log('Total top-level keys:', Object.keys(enData).length);
  
  // Check specific sections
  console.log('\nChecking specific sections:');
  console.log('- footer exists:', !!enData.footer);
  console.log('- particleField exists:', !!enData.particleField);
  console.log('- seo exists:', !!enData.seo);
  console.log('- blog exists:', !!enData.blog);
  
  if (enData.footer) {
    console.log('- footer.personalInfo exists:', !!enData.footer.personalInfo);
  }
  
  if (enData.particleField) {
    console.log('- particleField.settings exists:', !!enData.particleField.settings);
  }
  
} catch (error) {
  console.log('❌ JSON parsing error:', error.message);
  if (error.message.includes('position')) {
    const match = error.message.match(/position (\d+)/);
    if (match) {
      const position = parseInt(match[1]);
      const content = readFileSync('./src/locales/en.json', 'utf8');
      console.log('Error context around position', position, ':');
      console.log(content.substring(Math.max(0, position - 50), position + 50));
    }
  }
}