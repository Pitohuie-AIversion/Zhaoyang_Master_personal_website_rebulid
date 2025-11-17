import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './DarkModeProvider';
import { LanguageToggle } from './LanguageToggle';
import { UnifiedButton } from './UnifiedButton';
import { AccessibilityButton } from './AccessibilityEnhancements';
import { Home, Microscope, Briefcase, FileText, Wrench, Mail, Terminal, BookOpen } from 'lucide-react';
import { useResponsive, MobileMenu } from './ResponsiveEnhancements';
import { useTranslation } from './TranslationProvider';
import { SmartSearch } from './SmartSearch';
import { useGlobalSearchShortcut } from '../hooks/useKeyboardShortcut';
import ZhaoyangASCIIRhythm from './ZhaoyangASCIIRhythm';

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
  const { isMobile, isTablet } = useResponsive();
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
      className={`fixed left-0 right-0 z-50 transition-all duration-300 top-0 pointer-events-auto ${
        scrolled
          ? 'navbar-dark border-b border-primary-dark theme-transition'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group flex-shrink-0"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <img src="/favicon.svg" alt="ZY Logo" className="w-full h-full object-contain" />
            </div>
            {/* ASCII Logo for different screen sizes */}
            <div className="hidden lg:block">
              <div className="h-10 flex items-center overflow-hidden max-w-[140px]">
                <div 
                  className="transform-gpu"
                  style={{
                    transform: 'scale(0.2)',
                    transformOrigin: 'left center'
                  }}
                >
                  <ZhaoyangASCIIRhythm 
                    theme="matrix"
                    rhythmType="pulse"
                    intensity="low"
                    autoPlay={true}
                    showControls={false}
                    transparent={true}
                    className="opacity-85"
                  />
                </div>
              </div>
            </div>
            {/* Simplified ASCII for tablet */}
            <div className="hidden sm:block lg:hidden">
              <div className="h-8 flex items-center overflow-hidden max-w-[200px]">
                <div 
                  className="transform-gpu"
                  style={{
                    transform: 'scale(0.15)',
                    transformOrigin: 'left center'
                  }}
                >
                  <ZhaoyangASCIIRhythm 
                    theme="matrix"
                    rhythmType="pulse"
                    intensity="low"
                    autoPlay={true}
                    showControls={false}
                    transparent={true}
                    className="opacity-80"
                  />
                </div>
              </div>
            </div>
            {/* Text fallback for mobile */}
            <div className="block sm:hidden">
              <div className="text-lg font-semibold text-primary-dark theme-transition">Zhaoyang</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium theme-transition group ${
                    isActive(item.href)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-secondary-dark hover:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4" />
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
              title={t('search.placeholder') || '搜索'}
              className="hidden sm:flex"
            />
            <LanguageToggle variant="compact" showText={false} />
            <AccessibilityButton variant="compact" showText={false} />
            <ThemeToggle />
            {(isMobile || isTablet) && (
              <UnifiedButton
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t('common.menu')}
                className="p-2 w-10 h-10 flex items-center justify-center"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </UnifiedButton>
            )}
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