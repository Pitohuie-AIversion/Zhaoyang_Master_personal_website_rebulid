import { spawnSync } from 'node:child_process';

const severityOrder = ['info', 'low', 'moderate', 'high', 'critical'];
const minimumSeverity = 'high';

const exceptions = new Map([
  ['GHSA-qwww-vcr4-c8h2', {
    expires: '2026-10-31',
    reason: 'The advisory only affects unstable React Server Components APIs; this Vite SPA uses the declarative browser router and no RSC APIs.',
  }],
]);

const auditArgs = [
  'audit',
  '--omit=dev',
  '--json',
  '--registry=https://registry.npmjs.org',
];
const isWindows = process.platform === 'win32';
const command = isWindows ? (process.env.ComSpec || 'cmd.exe') : 'npm';
const commandArgs = isWindows
  ? ['/d', '/s', '/c', `npm.cmd ${auditArgs.join(' ')}`]
  : auditArgs;
const result = spawnSync(command, commandArgs, {
  encoding: 'utf8',
  shell: false,
});

if (result.error) {
  console.error(`Unable to run npm audit: ${result.error.message}`);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch (_error) {
  console.error('npm audit did not return valid JSON.');
  if (result.stderr) console.error(result.stderr.trim());
  process.exit(1);
}

const findings = [];
for (const vulnerability of Object.values(report.vulnerabilities || {})) {
  for (const advisory of vulnerability.via || []) {
    if (typeof advisory !== 'object') continue;
    if (severityOrder.indexOf(advisory.severity) < severityOrder.indexOf(minimumSeverity)) continue;

    const advisoryId = advisory.url?.split('/').pop() || String(advisory.source);
    findings.push({
      advisoryId,
      packageName: advisory.dependency || vulnerability.name,
      severity: advisory.severity,
      title: advisory.title,
      url: advisory.url,
    });
  }
}

const today = new Date().toISOString().slice(0, 10);
const blocking = [];

for (const finding of findings) {
  const exception = exceptions.get(finding.advisoryId);
  if (!exception || exception.expires < today) {
    blocking.push(finding);
    continue;
  }

  console.warn(`[accepted until ${exception.expires}] ${finding.advisoryId}: ${exception.reason}`);
}

const counts = report.metadata?.vulnerabilities || {};
console.log(`Production audit: ${counts.total || 0} total (${counts.high || 0} high, ${counts.critical || 0} critical).`);

if (blocking.length > 0) {
  console.error(`Found ${blocking.length} unaccepted ${minimumSeverity}-or-higher advisory(s):`);
  for (const finding of blocking) {
    console.error(`- [${finding.severity}] ${finding.packageName}: ${finding.title} (${finding.url})`);
  }
  process.exit(1);
}

console.log('No unaccepted high or critical production advisories found.');
