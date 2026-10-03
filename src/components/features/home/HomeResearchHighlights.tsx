import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, Network, Bot, ArrowRight } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { ScrollReveal, HoverCard } from '../../animations/InteractiveEffects';
import { ResponsiveCard } from '../../common/ResponsiveEnhancements';
import type { ResearchHighlight, TranslationFn } from './homeData';

interface HomeResearchHighlightsProps {
  researchHighlights: ResearchHighlight[];
  t: TranslationFn;
}

const researchVisuals = {
  flow: {
    icon: Waves,
    gradient: 'from-blue-600 via-cyan-600 to-sky-400',
    accent: 'bg-cyan-200/30'
  },
  network: {
    icon: Network,
    gradient: 'from-indigo-700 via-blue-600 to-violet-500',
    accent: 'bg-violet-200/25'
  },
  robot: {
    icon: Bot,
    gradient: 'from-slate-800 via-blue-800 to-cyan-600',
    accent: 'bg-blue-200/25'
  }
} as const;

const ResearchVisual = ({ item, index }: { item: ResearchHighlight; index: number }) => {
  const visual = researchVisuals[item.visual];
  const Icon = visual.icon;

  return (
    <div
      className={`relative h-48 md:h-full min-h-48 overflow-hidden bg-gradient-to-br ${visual.gradient}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />
      <div className={`absolute -right-10 -top-12 h-40 w-40 rounded-full blur-2xl ${visual.accent}`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/25 bg-white/10 shadow-2xl backdrop-blur-md">
          <Icon className="h-10 w-10 text-white" strokeWidth={1.5} />
        </div>
      </div>
      <span className="absolute bottom-4 right-5 font-mono text-4xl font-semibold tracking-tighter text-white/25">
        0{index + 1}
      </span>
    </div>
  );
};

export const HomeResearchHighlights: React.FC<HomeResearchHighlightsProps> = ({
  researchHighlights,
  t
}) => {
  return (
    <div className="lg:col-span-8">
      <SimpleMotion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex items-end justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary-dark theme-transition">
            {t('home.researchHighlights.title')}
          </h2>
          <p className="text-secondary-dark theme-transition mt-2 text-sm md:text-base">
            {t('home.researchHighlights.description')}
          </p>
        </div>
        <Link
          to="/research"
          className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          {t('common.viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </SimpleMotion>

      <div className="space-y-8">
        {researchHighlights.map((item, index) => (
          <ScrollReveal key={item.id} direction="up" delay={index * 0.1}>
            <HoverCard>
              <ResponsiveCard
                className="group overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-300"
                padding="none"
              >
                <div className="grid md:grid-cols-5 gap-0">
                  <div className="md:col-span-2 relative overflow-hidden">
                    <ResearchVisual item={item} index={index} />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-md border border-white/20 bg-slate-950/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="md:col-span-3 p-6 flex flex-col justify-center">
                    <Link to={item.link}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    <div className="mt-auto flex translate-x-0 items-center pt-4 text-sm font-medium text-blue-600 opacity-100 transition-all duration-300 dark:text-blue-400 md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
                      {t('common.readMore') || 'Read More'} <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </ResponsiveCard>
            </HoverCard>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-8 md:hidden text-center">
        <Link
          to="/research"
          className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-5 py-3 font-semibold text-primary-dark transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700"
        >
          {t('common.viewAll')}
        </Link>
      </div>
    </div>
  );
};
