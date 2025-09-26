import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './DarkModeProvider';
import { LanguageToggle } from './LanguageToggle';
import { Home, Microscope, Briefcase, FileText, Wrench, Mail, Terminal } from 'lucide-react';
import { useResponsive, MobileMenu } from './ResponsiveEnhancements';
import { useTranslation } from './TranslationProvider';

// 导航项配置（使用翻译键）
const navigationConfig = [
  { key: 'nav.home', href: '/', icon: Home },
  { key: 'nav.research', href: '/research', icon: Microscope },
  { key: 'nav.projects', href: '/projects', icon: Briefcase },
  { key: 'nav.publications', href: '/publications', icon: FileText },
  { key: 'nav.skills', href: '/skills', icon: Wrench },
  { key: 'nav.contact', href: '/contact', icon: Mail },
  { key: 'nav.ascii-demo', href: '/ascii-demo', icon: Terminal }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { t } = useTranslation();
  
  // 生成带翻译的导航项
  const navigation = navigationConfig.map(item => ({
    ...item,
    name: t(item.key)
  }));

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
      className={`fixed left-0 right-0 z-50 transition-all duration-300 top-0 ${
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
            className="flex items-center space-x-3 group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ZY</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-semibold text-primary-dark theme-transition">Zhaoyang</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
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

          <div className="flex items-center space-x-3">
            <LanguageToggle variant="compact" showText={false} />
            <ThemeToggle />
            {(isMobile || isTablet) && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 theme-transition"
                aria-label={t('common.menu')}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
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
    </motion.nav>
  );
}