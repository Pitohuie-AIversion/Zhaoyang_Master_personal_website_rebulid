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

  it('provides clean localized common actions, search hints, and social labels', () => {
    expect(zhLocale.common.add).toBe('添加');
    expect(zhLocale.common.edit).toBe('编辑');
    expect(zhLocale.common.save).toBe('保存');
    expect(zhLocale.common.clear).toBe('清除');
    expect(zhLocale.common.searchPlaceholder).toBe('搜索...');
    expect(zhLocale.common.autoScroll).toBe('自动滚动');
    expect(zhLocale.common.keyboard.shortcutsTitle).toBe('快捷键指南');
    expect(zhLocale.common.social.googleScholar).toBe('谷歌学术');

    expect(enLocale.common.add).toBe('Add');
    expect(enLocale.common.edit).toBe('Edit');
    expect(enLocale.common.save).toBe('Save');
    expect(enLocale.common.clear).toBe('Clear');
    expect(enLocale.common.searchPlaceholder).toBe('Search...');
    expect(enLocale.common.autoScroll).toBe('Auto Scroll');
    expect(enLocale.common.keyboard.shortcutsTitle).toBe('Keyboard Shortcuts');
    expect(enLocale.common.social.googleScholar).toBe('Google Scholar');
  });

  it('provides proper contact info and education section titles', () => {
    expect(zhLocale.contact.contactInfo).toBe('联系信息');
    expect(zhLocale.contact.info.email).toContain('@');
    expect(zhLocale.contact.info.phone).toContain('153');
    expect(zhLocale.research.educationSectionTitle).toBe('教育背景');

    expect(enLocale.contact.contactInfo).toBe('Contact Information');
    expect(enLocale.contact.info.email).toContain('@');
    expect(enLocale.contact.info.phone).toContain('153');
    expect(enLocale.research.educationSectionTitle).toBe('Education');
  });

  it('provides proper academic and particle field localization without placeholders', () => {
    // Academic localization
    expect(zhLocale.academic.chatAssistant.title).toBe('智能助手');
    expect(zhLocale.academic.search.placeholder).toBe('搜索论文、专利、项目...');
    expect(zhLocale.academic.filters.publications).toBe('学术论文');
    expect(zhLocale.academic.filters.patents).toBe('发明专利');
    expect(zhLocale.academic.educationItems.master.title).toBe('大连海事大学 - 人工智能硕士');

    expect(enLocale.academic.chatAssistant.title).toBe('AI Assistant');
    expect(enLocale.academic.search.placeholder).toBe('Search papers, patents, projects...');
    expect(enLocale.academic.filters.publications).toBe('Publications');

    // Particle field localization
    expect(zhLocale.particleField.status.ready).toBe('粒子系统已就绪');
    expect(zhLocale.particleField.performance.title).toBe('性能统计');
    expect(zhLocale.particleField.navigation.main).toBe('主显示视图');
    expect(zhLocale.particleField.navigation.settings).toBe('参数配置面板');

    expect(enLocale.particleField.status.ready).toBe('Particle system ready');
    expect(enLocale.particleField.performance.title).toBe('Performance Statistics');
    expect(enLocale.particleField.navigation.main).toBe('Main Display');
    expect(enLocale.particleField.navigation.settings).toBe('Configuration Panel');
  });
});

