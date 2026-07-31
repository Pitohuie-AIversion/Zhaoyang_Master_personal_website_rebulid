import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../common/DarkModeProvider';
import { LanguageToggle } from './LanguageToggle';
import { UnifiedButton } from '../common/UnifiedButton';
import { AccessibilityButton } from './AccessibilityEnhancements';
import { Home, Microscope, Briefcase, FileText, Wrench, Mail, Terminal, BookOpen } from 'lucide-react';
import { MobileMenu } from '../common/ResponsiveEnhancements';
import { useTranslation } from '../common/TranslationProvider';
import { SmartSearch } from '../features/search/SmartSearch';
import { useGlobalSearchShortcut } from '../../hooks/useKeyboardShortcut';

// 导航项配置（使用翻译键）
const navigationConfig = [
  { key: 'navigation.home', href: '/', icon: Home },
  { key: 'navigation.research', href: '/research', icon: Microscope },
  { key: 'navigation.projects', href: '/projects', icon: Briefcase },
  { key: 'navigation.publications', href: '/publications', icon: FileText },
  { key: 'navigation.blog', href: '/blog', icon: BookOpen },
  { key: 'navigation.skills', href: '/skills', icon: Wrench },
  { key: 'navigation.contact', href: '/contact', icon: Mail },
  { key: 'navigation.ascii-demo', href: '/ascii-demo', icon: Terminal }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  
  // 全局搜索快捷键
  useGlobalSearchShortcut(() => setIsSearchOpen(true));
  
  // 生成带翻译的导航项
  const navigation = navigationConfig.map(item => {
    const translatedName = t(item.key);
    // console.log(`翻译调试: ${item.key} -> ${translatedText} (当前语言: ${language})`);
    return {
      ...item,
      name: translatedName
    };
  });

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed left-0 right-0 z-[70] transition-all duration-300 top-0 pointer-events-auto ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-950/95 border-b border-gray-200/80 dark:border-gray-800 shadow-sm backdrop-blur-xl'
          : 'bg-white/75 dark:bg-gray-950/70 border-b border-transparent backdrop-blur-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group flex-shrink-0 rounded-lg focus-visible:outline-none"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-600/20 transition-transform group-hover:-rotate-3">
              <img src="/favicon.svg" alt={t('common.logoAlt')} className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-bold tracking-tight text-primary-dark theme-transition">Zhaoyang Mu</div>
              <div className="text-[11px] text-tertiary-dark theme-transition">{t('home.hero.name') as string}</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-0.5 flex-1 justify-center">
            {navigation.map((item) => {
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`relative px-2.5 py-2 rounded-lg text-sm font-medium theme-transition group whitespace-nowrap ${
                    isActive(item.href)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-secondary-dark hover:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{item.name}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* 搜索按钮 */}
              <UnifiedButton
                variant="ghost"
                size="sm"
                icon={<Search className="w-4 h-4" />}
                onClick={() => setIsSearchOpen(true)}
                title={t('common.search')}
                ariaLabel={t('common.search')}
                className="hidden sm:flex"
              />
            <LanguageToggle variant="compact" showText={false} />
            <div className="hidden md:block">
              <AccessibilityButton variant="compact" showText={false} />
            </div>
            <ThemeToggle />
            <UnifiedButton
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              ariaLabel={t('common.menu')}
              className="p-2 w-10 h-10 flex items-center justify-center xl:hidden"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </UnifiedButton>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={navigation.map(item => ({
          ...item,
          isActive: isActive(item.href)
        }))}
      />

      {/* 智能搜索 */}
      <SmartSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </motion.nav>
  );
}
