import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

const HOST = '127.0.0.1';
const STARTUP_TIMEOUT_MS = 10_000;

function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.once('error', reject);
    server.listen(0, HOST, () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : null;
      server.close(error => {
        if (error) reject(error);
        else if (port) resolve(port);
        else reject(new Error('Unable to allocate a smoke-test port.'));
      });
    });
  });
}

async function waitForHealth(url, child, stderr) {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`API exited before becoming healthy (code ${child.exitCode}).\n${stderr()}`);
    }

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1_000) });
      if (response.ok) return response.json();
    } catch (_error) {
      // The server may still be starting; retry until the deadline.
    }

    await new Promise(resolve => setTimeout(resolve, 250));
  }

  throw new Error(`API did not become healthy within ${STARTUP_TIMEOUT_MS}ms.\n${stderr()}`);
}

async function stopChild(child) {
  if (child.exitCode !== null) return;

  child.kill('SIGTERM');
  await Promise.race([
    new Promise(resolve => child.once('exit', resolve)),
    new Promise(resolve => setTimeout(resolve, 3_000)),
  ]);

  if (child.exitCode === null) child.kill('SIGKILL');
}

const port = await getAvailablePort();
const baseUrl = `http://${HOST}:${port}`;
const child = spawn(process.execPath, ['api/index.js'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    NODE_ENV: 'test',
    PORT: String(port),
    USE_LOCAL_PROXY: 'false',
    VERCEL: '',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let stderr = '';
child.stderr.setEncoding('utf8');
child.stderr.on('data', chunk => {
  stderr = `${stderr}${chunk}`.slice(-8_000);
});

try {
  const health = await waitForHealth(`${baseUrl}/api/health`, child, () => stderr);
  if (health.status !== 'ok') {
    throw new Error(`Unexpected health status: ${JSON.stringify(health)}`);
  }

  const metricsResponse = await fetch(`${baseUrl}/api/metrics`, {
    signal: AbortSignal.timeout(2_000),
  });
  const metrics = await metricsResponse.text();

  if (!metricsResponse.ok || !metrics.includes('# TYPE http_requests_total counter')) {
    throw new Error(`Prometheus endpoint is invalid (HTTP ${metricsResponse.status}).`);
  }

  console.log(JSON.stringify({
    health: health.status,
    metrics: 'ok',
    port,
  }));
} finally {
  await stopChild(child);
}
