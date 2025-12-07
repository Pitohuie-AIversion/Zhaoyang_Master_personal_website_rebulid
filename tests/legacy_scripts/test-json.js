import fs from 'fs';
const content = fs.readFileSync('./src/locales/en.json', 'utf8');

// Check what's at position 79268
console.log('File length:', content.length);
console.log('Character at position 79268:', JSON.stringify(content[79268]));
console.log('Content around position 79268:');
console.log(content.substring(79260, 79280));

// Check if there are any extra characters at the end
console.log('\nLast 20 characters:');
console.log(JSON.stringify(content.substring(content.length - 20)));

// Check for any hidden characters or BOM
console.log('\nFirst few character codes:');
for (let i = 79260; i < 79280 && i < content.length; i++) {
  console.log(`Position ${i}: "${content[i]}" (code: ${content.charCodeAt(i)})`);
}