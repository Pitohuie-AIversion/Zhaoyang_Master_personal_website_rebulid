import React from 'react';
import { render, screen } from '@testing-library/react';
import { TranslationProvider, useTranslation } from '../../components/common/TranslationProvider';
import en from '../../locales/en.json';
import zh from '../../locales/zh.json';

function Harness() {
  const { t } = useTranslation();
  return (
    <div>
      <div data-testid="nav-home">{t('navigation.home')}</div>
      <div data-testid="pf-back">{t('particleField.backToHome')}</div>
      <div data-testid="skills-title">{t('skills.title')}</div>
    </div>
  );
}

describe('i18n language switching via provider initial state', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'en';
  });

  test('renders English texts when language is en', () => {
    localStorage.setItem('language', 'en');
    render(
      <TranslationProvider>
        <Harness />
      </TranslationProvider>
    );

    expect(screen.getByTestId('nav-home').textContent).toBe((en as any).navigation.home);
    expect(screen.getByTestId('pf-back').textContent).toBe((en as any).particleField.backToHome);
    expect(screen.getByTestId('skills-title').textContent).toBe((en as any).skills.title);
  });

  test('renders Chinese texts when language is zh', () => {
    localStorage.setItem('language', 'zh');
    render(
      <TranslationProvider>
        <Harness />
      </TranslationProvider>
    );

    expect(screen.getByTestId('nav-home').textContent).toBe((zh as any).navigation.home);
    expect(screen.getByTestId('pf-back').textContent).toBe((zh as any).particleField.backToHome);
    expect(screen.getByTestId('skills-title').textContent).toBe((zh as any).skills.title);
  });
}
)
