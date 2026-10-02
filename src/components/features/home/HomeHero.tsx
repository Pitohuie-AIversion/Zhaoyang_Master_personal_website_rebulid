import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { ScrollReveal } from '../../animations/InteractiveEffects';
import { ResponsiveContainer } from '../../common/ResponsiveEnhancements';
import LazyImage from '../../common/LazyImage';
import profileImage from '../../../assets/me_Nero_AI_Image_Upscaler_Photo_Face.jpeg';
import type { TranslationFn } from './homeData';

interface HomeHeroProps {
  t: TranslationFn;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ t }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-16 pt-28 dark:from-gray-950 dark:via-slate-950 dark:to-blue-950 sm:pt-32 lg:pb-24 lg:pt-36 theme-transition">
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-blue-950/10" />
      <ResponsiveContainer maxWidth="xl" padding="md" className="relative z-30">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Text Content - Spans 7 columns - Primary Focus */}
          <div className="order-1 lg:col-span-7">
            <SimpleMotion
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ScrollReveal direction="up" delay={0.2}>
                <h1 className="mb-5 break-words text-4xl font-bold leading-[1.08] tracking-tight text-primary-dark theme-transition sm:text-5xl lg:text-6xl">
                  {t('home.hero.name')}
                  {t('home.hero.nameEn') && t('home.hero.name') !== t('home.hero.nameEn') && (
                    <span className="mt-2 block text-2xl font-medium tracking-normal text-secondary-dark theme-transition sm:text-3xl lg:text-4xl">
                      {t('home.hero.nameEn')}
                    </span>
                  )}
                </h1>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.4}>
                <h2 className="mb-6 max-w-2xl text-lg font-semibold leading-relaxed text-blue-700 dark:text-blue-300 sm:text-xl">
                  {t('home.hero.title')}
                </h2>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.6}>
                <p className="mb-8 max-w-2xl text-base leading-8 text-secondary-dark theme-transition sm:text-lg">
                  {t('home.hero.description')}
                </p>
              </ScrollReveal>

              {/* Tags as visual anchors */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-10">
                {[
                  'transformerNeuralOperator',
                  'cfdSimulation',
                  'underwaterRobotics',
                  'bionicPerception',
                  'mechanicalDesign'
                ].map((tagKey) => (
                  <span
                    key={tagKey}
                    className="px-3 py-1 bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium backdrop-blur-sm"
                  >
                    {t(`home.hero.tags.${tagKey}`)}
                  </span>
                ))}
              </div>

              <ScrollReveal direction="up" delay={0.8}>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    to="/research"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus-visible:outline-none"
                  >
                    {t('home.hero.buttons.research')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/projects"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white/60 px-6 py-3.5 font-semibold text-slate-800 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-slate-900 focus-visible:outline-none"
                  >
                    {t('home.hero.buttons.projects')}
                  </Link>
                </div>
              </ScrollReveal>
            </SimpleMotion>
          </div>

          {/* Image - Spans 5 columns - Secondary Anchor */}
          <div className="order-2 flex justify-center lg:col-span-5 lg:justify-end">
            <SimpleMotion
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-6 opacity-20 blur-sm"></div>
                <LazyImage
                  src={profileImage}
                  alt={t('home.hero.name')}
                  priority
                  width={384}
                  height={384}
                  className="relative z-10 h-72 w-full max-w-sm rounded-3xl border-4 border-white object-cover object-top shadow-2xl shadow-blue-950/20 dark:border-slate-800 sm:h-80 lg:h-96 lg:w-96"
                />
              </div>
            </SimpleMotion>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Background Grid Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" className="text-blue-900 dark:text-white" />
        </svg>
      </div>
    </section>
  );
};
