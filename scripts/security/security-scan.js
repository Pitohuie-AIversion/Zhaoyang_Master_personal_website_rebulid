import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

// Configuration
const CONFIG = {
  // Directories to ignore
  ignoredDirs: [
    'node_modules',
    '.git',
    '.cache',
    '.pytest_cache',
    'dist',
    'dist-ssr',
    '.vercel',
    'coverage',
    'logs'
  ],
  // Files to ignore
  ignoredFiles: [
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.env.example',
    '.env',
    'scripts/security/security-scan.js', // Ignore self
    'scripts/security/setup-secure-keys.js' // Contains encryption logic, not leaks
  ],
  // Patterns to search for
  patterns: [
    {
      name: 'Generic API Key',
      regex: /(api_key|apikey|secret|token)["']?\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/i,
      severity: 'HIGH'
    },
    {
      name: 'Hardcoded Password',
      regex: /password["']?\s*[:=]\s*['"][^'"]{6,}['"]/i,
      severity: 'HIGH'
    },
    {
      name: 'AWS Key',
      regex: /AKIA[0-9A-Z]{16}/,
      severity: 'CRITICAL'
    },
    {
      name: 'Private Key',
      regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
      severity: 'CRITICAL'
    },
    {
      name: 'Supabase Service Key',
      regex: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/,
      severity: 'CRITICAL'
    },
    {
      name: 'OpenAI Key',
      regex: /\bsk-(?:proj-)?[a-zA-Z0-9_-]{20,}\b/,
      severity: 'CRITICAL'
    },
    {
      name: 'GitHub Token',
      regex: /\bgh[pousr]_[a-zA-Z0-9]{36,}\b/,
      severity: 'CRITICAL'
    },
    {
      name: 'Google API Key',
      regex: /\bAIza[a-zA-Z0-9_-]{35}\b/,
      severity: 'CRITICAL'
    }
  ]
};

const binaryExtensions = new Set([
  '.docx', '.gif', '.ico', '.jpeg', '.jpg', '.pdf', '.png', '.webp',
]);

let issuesFound = 0;

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check line by line for better reporting
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Skip comments (simple check)
      if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('#')) {
        return;
      }

      CONFIG.patterns.forEach(pattern => {
        if (pattern.regex.test(line)) {
          // Double check if it's a placeholder
          if (line.includes('your-') || line.includes('replace-') || line.includes('EXAMPLE') || line.includes('process.env')) {
            return;
          }

          console.error(`\x1b[31m[FAIL]\x1b[0m ${pattern.name} found in ${path.relative(rootDir, filePath)}:${index + 1}`);
          // Never echo the matching line: CI logs must not amplify a leaked secret.
          issuesFound++;
        }
      });
    });
  } catch (error) {
    console.warn(`Could not read file ${filePath}: ${error.message}`);
  }
}

function scanDirectory(dir) {
  let files;
  try {
    files = fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    console.warn(`Skipping unreadable directory ${path.relative(rootDir, dir)}: ${error.code || error.message}`);
    return;
  }

  files.forEach(entry => {
    const file = entry.name;
    const fullPath = path.join(dir, file);

    if (entry.isSymbolicLink()) {
      return;
    }

    if (entry.isDirectory()) {
      if (!CONFIG.ignoredDirs.includes(file)) {
        scanDirectory(fullPath);
      }
    } else {
      const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
      if (!CONFIG.ignoredFiles.includes(file)
        && !CONFIG.ignoredFiles.includes(relativePath)
        && !file.endsWith('.map')
        && !binaryExtensions.has(path.extname(file).toLowerCase())) {
        scanFile(fullPath);
      }
    }
  });
}

console.log('🔒 Starting Security Scan...');
console.log(`📂 Root Directory: ${rootDir}`);
scanDirectory(rootDir);

if (issuesFound > 0) {
  console.log(`\n\x1b[31m❌ Scan failed! Found ${issuesFound} potential security issues.\x1b[0m`);
  process.exit(1);
} else {
  console.log('\n\x1b[32m✅ Scan passed! No obvious secrets found.\x1b[0m');
}
