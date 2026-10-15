import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Palette, Monitor } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';

interface ParticleHeroSectionProps {
  showStats: boolean;
  onToggleStats: () => void;
}

export const ParticleHeroSection: React.FC<ParticleHeroSectionProps> = ({
  showStats,
  onToggleStats,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-12">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
        {t('particleField.mainTitle')}
      </h1>
      <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
        {t('particleField.description')}
      </p>

      {/* 特性标签 */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {[
          'WebGL 2.0',
          'Perlin Noise',
          t('particleField.features.realtime'),
          t('particleField.features.interactive'),
          t('particleField.features.responsive'),
        ].map((feature, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-white/10 text-white/90 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          to="/particle-field/demo"
          className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Play className="w-5 h-5 inline mr-2 group-hover:animate-pulse" />
          {t('particleField.startExperience')}
        </Link>

        <Link
          to="/particle-field/settings"
          className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
        >
          <Palette className="w-5 h-5 inline mr-2" />
          {t('particleField.customize')}
        </Link>

        <button
          type="button"
          onClick={onToggleStats}
          aria-pressed={showStats}
          className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
        >
          <Monitor className="w-5 h-5 inline mr-2" />
          {t('particleField.toggleStats')}
        </button>
      </div>
    </div>
  );
};
