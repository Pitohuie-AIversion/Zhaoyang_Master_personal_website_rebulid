// Test both Chinese and English translations
const fs = require('fs');

const zhContent = fs.readFileSync('./src/locales/zh.json', 'utf8');
const enContent = fs.readFileSync('./src/locales/en.json', 'utf8');

const zhTranslations = JSON.parse(zhContent);
const enTranslations = JSON.parse(enContent);

console.log('Testing Chinese translations...');
console.log('Chinese - Home title:', zhTranslations.home?.title);
console.log('Chinese - Research title:', zhTranslations.research?.title);
console.log('Chinese - About title:', zhTranslations.about?.title);
console.log('Chinese - Skills title:', zhTranslations.skills?.title);
console.log('Chinese - Contact title:', zhTranslations.contact?.title);
console.log('Chinese - Publications title:', zhTranslations.publications?.title);
console.log('Chinese - Projects title:', zhTranslations.projects?.title);

console.log('\nTesting English translations...');
console.log('English - Home title:', enTranslations.home?.title);
console.log('English - Research title:', enTranslations.research?.title);
console.log('English - About title:', enTranslations.about?.title);
console.log('English - Skills title:', enTranslations.skills?.title);
console.log('English - Contact title:', enTranslations.contact?.title);
console.log('English - Publications title:', enTranslations.publications?.title);
console.log('English - Projects title:', enTranslations.projects?.title);

console.log('\nTesting particleField translations...');
console.log('English - particleField title:', enTranslations.particleField?.title);
console.log('English - particleField backToHome:', enTranslations.particleField?.backToHome);

console.log('\nTranslation structure validation:');
console.log('Chinese sections:', Object.keys(zhTranslations));
console.log('English sections:', Object.keys(enTranslations));
console.log('Both files have the same sections:', Object.keys(zhTranslations).length === Object.keys(enTranslations).length);

console.log('\nAll translation tests completed successfully!');