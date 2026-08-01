import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectFile = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('production site integrity', () => {
  it('publishes only the canonical production domain in discovery files', () => {
    const robots = projectFile('public/robots.txt');
    const sitemap = projectFile('public/sitemap.xml');
    const rss = projectFile('public/rss.xml');

    expect(robots).toContain('Sitemap: https://www.zhaoyangmu.cloud/sitemap.xml');
    expect(sitemap).toContain('<loc>https://www.zhaoyangmu.cloud/</loc>');
    expect(rss).toContain('<link>https://www.zhaoyangmu.cloud</link>');
    expect(`${robots}\n${sitemap}\n${rss}`).not.toContain('zhaoyang-mou.com');
  });

  it('keeps verified publication identifiers in user-facing data', () => {
    const searchableSources = [
      projectFile('src/locales/zh.json'),
      projectFile('src/locales/en.json'),
      projectFile('src/pages/Research.tsx'),
      projectFile('src/services/searchService.ts'),
    ].join('\n');

    expect(searchableSources).toContain('10.1063/5.0245680');
    expect(searchableSources).toContain('10.1109/LRA.2025.3543139');
    expect(searchableSources).not.toContain('10.1063/5.0187644');
    expect(searchableSources).not.toContain('10.1109/LRA.2025.10891552');
  });
});
