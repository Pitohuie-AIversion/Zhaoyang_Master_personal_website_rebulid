import React from 'react';
import { useTranslation } from './TranslationProvider';

const TranslationTest: React.FC = () => {
  const { language, toggleLanguage, t } = useTranslation();
  
  const testKeys = [
    'common.loading',
    'navigation.home',
    'navigation.research',
    'particleField.title',
    'particleField.features.realtime',
    'particleField.settings.particles',
    'home.hero.greeting',
    'home.hero.name',
    'footer.personalInfo.name',
    'footer.personalInfo.nameEn'
  ];
  
  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Translation System Test</h1>
      
      <div className="mb-6">
        <button 
          onClick={toggleLanguage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Switch Language (Current: {language})
        </button>
      </div>
      
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Translation Key Tests:</h2>
        {testKeys.map(key => {
          const value = t(key);
          const isMissing = value === key;
          
          return (
            <div key={key} className={`p-3 rounded border ${isMissing ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-green-300 bg-green-50 dark:bg-green-900/20'}`}>
              <div className="font-mono text-sm text-gray-600 dark:text-gray-400">{key}</div>
              <div className={`font-medium ${isMissing ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {isMissing ? 'MISSING: ' : ''}{value}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <h3 className="font-semibold mb-2">System Info:</h3>
        <div>Current Language: {language}</div>
        <div>Translation Function: {typeof t}</div>
      </div>
    </div>
  );
};

export default TranslationTest;