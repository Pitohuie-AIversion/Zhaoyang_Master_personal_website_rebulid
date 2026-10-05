import { describe, expect, it } from 'vitest';
import { searchService } from '../services/searchService';
import { validateContactForm } from '../services/contactService';
import zhLocale from '../locales/zh.json';
import enLocale from '../locales/en.json';

describe('user experience and service validation', () => {
  it('searches successfully for key terms including DamFormer and Transformer', async () => {
    await searchService.initialize();
    
    const damformerResults = await searchService.search('damformer');
    expect(damformerResults.length).toBeGreaterThan(0);
    expect(damformerResults.some(r => r.title.toLowerCase().includes('dam') || r.description.toLowerCase().includes('damformer'))).toBe(true);

    const robotResults = await searchService.search('robot');
    expect(robotResults.length).toBeGreaterThan(0);

    const cfdResults = await searchService.search('CFD');
    expect(cfdResults.length).toBeGreaterThan(0);
  });

  it('validates contact form with localized error messages', () => {
    const zhT = (key: string) => {
      const keys = key.split('.');
      let val: unknown = zhLocale;
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = (val as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      return typeof val === 'string' ? val : key;
    };

    const emptyErrors = validateContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    }, zhT);

    expect(emptyErrors.name).toBeTruthy();
    expect(emptyErrors.name).not.toContain('Please enter');
    expect(emptyErrors.email).toBeTruthy();
  });

  it('provides real informative chat assistant content without dummy placeholders', () => {
    expect(zhLocale.common.chat.projectsIntro).not.toBe('projects Intro');
    expect(zhLocale.common.chat.researchIntro).not.toBe('research Intro');
    expect(zhLocale.common.chat.contactIntro).toContain('153');
    expect(zhLocale.common.relatedLinks).toBe('相关链接');

    expect(enLocale.common.chat.projectsIntro).not.toBe('projects Intro');
    expect(enLocale.common.chat.researchIntro).not.toBe('research Intro');
    expect(enLocale.common.chat.contactIntro).toContain('153');
    expect(enLocale.common.relatedLinks).toBe('Related Links');
  });

  it('maintains proper bilingual identity across English and Chinese configurations', () => {
    expect(zhLocale.home.hero.name).toBe('牟昭阳');
    expect(zhLocale.home.hero.nameEn).toBe('Zhaoyang Mu');

    expect(enLocale.home.hero.name).toBe('Zhaoyang Mu');
    expect(enLocale.home.hero.nameEn).toBe('牟昭阳');
  });

  it('provides proper localized publication modal fields and citation copy capability', () => {
    expect(zhLocale.publications.modal.authors).toBe('作者');
    expect(zhLocale.publications.modal.year).toBe('年份');
    expect(zhLocale.publications.modal.copyCitation).toBe('复制引用');
    expect(enLocale.publications.modal.copyCitation).toBe('Copy Citation');
  });
});

