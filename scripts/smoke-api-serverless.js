import { createServer } from 'node:http';

process.env.NODE_ENV = 'test';
process.env.USE_LOCAL_PROXY = 'false';
process.env.VERCEL = '1';

const { default: handler } = await import('../api/index.js');
const server = createServer((req, res) => handler(req, res));

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});

try {
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Unable to determine serverless smoke-test address.');
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;
  const healthResponse = await fetch(`${baseUrl}/api/health`, {
    signal: AbortSignal.timeout(2_000),
  });
  const health = await healthResponse.json();

  if (!healthResponse.ok || health.status !== 'ok') {
    throw new Error(`Serverless health endpoint failed: ${healthResponse.status} ${JSON.stringify(health)}`);
  }

  const metricsResponse = await fetch(`${baseUrl}/api/metrics`, {
    signal: AbortSignal.timeout(2_000),
  });
  const metrics = await metricsResponse.text();

  if (!metricsResponse.ok || !metrics.includes('# TYPE http_requests_total counter')) {
    throw new Error(`Serverless metrics endpoint failed: HTTP ${metricsResponse.status}`);
  }

  console.log(JSON.stringify({
    adapter: 'vercel',
    health: health.status,
    metrics: 'ok',
  }));
} finally {
  await new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  });
}
