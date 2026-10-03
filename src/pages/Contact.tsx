import React from 'react';
import { useTranslation } from '../components/common/TranslationProvider';
import { ContactSEO } from '../components/seo/SEOOptimization';
import { SimpleMotion } from '../components/animations/SimpleMotion';
import { useResponsive } from '../components/common/ResponsiveEnhancements';
import { 
  LazyAnimationContainerComponent as AnimationContainer,
  LazyFloatingElementComponent as FloatingElement,
  LazyGradientTextComponent as GradientText
} from '../components/animations/LazyAnimations';
import { ResponsiveContainer } from '../components/common/ResponsiveEnhancements';
import { 
  ContactInfoCards, 
  SocialLinks, 
  ContactForm 
} from '../components/features/contact';

export default function Contact() {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();

  return (
    <div className="min-h-screen relative theme-transition">
      <ContactSEO />
      
      {/* 浮动装饰元素 */}
      <FloatingElement 
        className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 dark:bg-blue-800/30 rounded-full pointer-events-none"
        duration={6}
      >
        <div />
      </FloatingElement>
      <FloatingElement 
        className="absolute top-40 right-20 w-16 h-16 bg-indigo-200/30 dark:bg-indigo-800/30 rounded-full pointer-events-none"
        duration={8}
      >
        <div />
      </FloatingElement>
      <FloatingElement
        className="absolute top-20 right-10 text-blue-500/20 dark:text-blue-400/20 pointer-events-none"
        duration={4}
      >
        <div className="w-8 h-8 rounded-full bg-current opacity-20" />
      </FloatingElement>
      <FloatingElement
        className="absolute bottom-32 left-8 text-purple-500/20 dark:text-purple-400/20 pointer-events-none"
        duration={5}
      >
        <div className="w-6 h-6 rounded-full bg-current opacity-20" />
      </FloatingElement>
      
      {/* 页面主体内容 */}
      <ResponsiveContainer 
        maxWidth="xl" 
        padding="lg"
        className="relative z-10"
        style={{ paddingTop: isMobile ? '100px' : '140px', paddingBottom: '80px' }}
      >
        <AnimationContainer>
          <SimpleMotion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="mb-8">
              <GradientText
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight break-words"
                gradient="from-blue-600 via-purple-600 to-pink-600"
              >
                {t('contact.title') as string}
              </GradientText>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed break-words">
              {t('contact.description') as string}
            </p>
          </SimpleMotion>
        </AnimationContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto">
          {/* 左侧：联系信息与学术社交链接 */}
          <section className="space-y-6 order-2 lg:order-1">
            <SimpleMotion
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-6">
                <ContactInfoCards />
                <SocialLinks />
              </div>
            </SimpleMotion>
          </section>

          {/* 右侧：联系表单 */}
          <section className="space-y-6 order-1 lg:order-2">
            <SimpleMotion
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ContactForm />
            </SimpleMotion>
          </section>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
