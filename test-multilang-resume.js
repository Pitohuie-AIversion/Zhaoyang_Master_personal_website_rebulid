import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

// Test configuration
const TEST_URLS = {
  local: 'http://localhost:5173',
  production: 'https://zhaoyang-master-personal-website-rebulid.vercel.app'
};

const RESUME_FILES = {
  chinese: '/cn_resume.pdf',
  english: '/en_resume.pdf'
};

// Test function for PDF download
function testResumeDownload(baseUrl, language, filePath) {
  return new Promise((resolve, reject) => {
    const url = baseUrl + filePath;
    console.log(`\n🧪 Testing ${language} resume download from: ${url}`);
    
    const protocol = baseUrl.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      console.log(`📊 Status Code: ${res.statusCode}`);
      console.log(`📋 Content-Type: ${res.headers['content-type']}`);
      console.log(`📏 Content-Length: ${res.headers['content-length']}`);
      console.log(`💾 Content-Disposition: ${res.headers['content-disposition'] || 'Not set'}`);
      
      if (res.statusCode === 200) {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const isValidPDF = buffer.slice(0, 4).toString() === '%PDF';
          
          console.log(`✅ Download successful!`);
          console.log(`📄 File size: ${buffer.length} bytes`);
          console.log(`🔍 Valid PDF header: ${isValidPDF ? 'Yes' : 'No'}`);
          
          if (isValidPDF) {
            // Save test file
            const testFileName = `test-${language}-${Date.now()}.pdf`;
            fs.writeFileSync(testFileName, buffer);
            console.log(`💾 Test file saved as: ${testFileName}`);
            
            resolve({
              success: true,
              size: buffer.length,
              contentType: res.headers['content-type'],
              contentDisposition: res.headers['content-disposition'],
              testFile: testFileName
            });
          } else {
            reject(new Error(`Invalid PDF file - header: ${buffer.slice(0, 20).toString()}`));
          }
        });
      } else if (res.statusCode === 404) {
        reject(new Error(`File not found at ${url}`));
      } else {
        reject(new Error(`HTTP ${res.statusCode} error`));
      }
    });
    
    req.on('error', (err) => {
      reject(new Error(`Request failed: ${err.message}`));
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout after 10 seconds'));
    });
  });
}

// Main test function
async function runMultiLanguageTests() {
  console.log('🌍 Starting Multi-Language Resume Download Tests\n');
  
  const results = {
    local: {},
    production: {}
  };
  
  // Test local environment
  console.log('🏠 Testing Local Environment...\n');
  try {
    results.local.chinese = await testResumeDownload(TEST_URLS.local, 'Chinese', RESUME_FILES.chinese);
    results.local.english = await testResumeDownload(TEST_URLS.local, 'English', RESUME_FILES.english);
    console.log('✅ Local tests passed!\n');
  } catch (error) {
    console.log(`❌ Local tests failed: ${error.message}\n`);
    results.local.error = error.message;
  }
  
  // Test production environment
  console.log('🌐 Testing Production Environment...\n');
  try {
    results.production.chinese = await testResumeDownload(TEST_URLS.production, 'Chinese', RESUME_FILES.chinese);
    results.production.english = await testResumeDownload(TEST_URLS.production, 'English', RESUME_FILES.english);
    console.log('✅ Production tests passed!\n');
  } catch (error) {
    console.log(`❌ Production tests failed: ${error.message}\n`);
    results.production.error = error.message;
  }
  
  // Generate report
  console.log('📊 MULTI-LANGUAGE RESUME DOWNLOAD TEST REPORT');
  console.log('=' .repeat(50));
  
  console.log('\n🏠 LOCAL ENVIRONMENT:');
  if (results.local.error) {
    console.log(`❌ Failed: ${results.local.error}`);
  } else {
    console.log(`✅ Chinese Resume: ${results.local.chinese.size} bytes, Content-Type: ${results.local.chinese.contentType}`);
    console.log(`✅ English Resume: ${results.local.english.size} bytes, Content-Type: ${results.local.english.contentType}`);
  }
  
  console.log('\n🌐 PRODUCTION ENVIRONMENT:');
  if (results.production.error) {
    console.log(`❌ Failed: ${results.production.error}`);
  } else {
    console.log(`✅ Chinese Resume: ${results.production.chinese.size} bytes, Content-Type: ${results.production.chinese.contentType}`);
    console.log(`✅ English Resume: ${results.production.english.size} bytes, Content-Type: ${results.production.english.contentType}`);
  }
  
  console.log('\n🔍 SUMMARY:');
  const localSuccess = !results.local.error;
  const productionSuccess = !results.production.error;
  
  if (localSuccess && productionSuccess) {
    console.log('🎉 ALL TESTS PASSED! Both environments serve multi-language resumes correctly.');
  } else if (localSuccess) {
    console.log('⚠️  Local environment works, but production has issues.');
  } else {
    console.log('❌ Multi-language resume downloads need attention.');
  }
  
  // Cleanup test files
  console.log('\n🧹 Cleaning up test files...');
  const testFiles = fs.readdirSync('.').filter(file => file.startsWith('test-') && file.endsWith('.pdf'));
  testFiles.forEach(file => {
    fs.unlinkSync(file);
    console.log(`🗑️  Removed: ${file}`);
  });
  
  return results;
}

// Run tests
runMultiLanguageTests().catch(console.error);