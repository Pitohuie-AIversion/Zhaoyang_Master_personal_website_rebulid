import React from 'react';
import { Building } from 'lucide-react';
import { LazyMagneticButtonComponent as MagneticButton } from '../../animations/LazyAnimations';
import type { CollaborationType } from '../../../services/contactService';

interface CollaborationTypeSelectorProps {
  title: string;
  types: CollaborationType[];
  selectedType: string;
  onSelect: (typeId: string) => void;
}

export const CollaborationTypeSelector: React.FC<CollaborationTypeSelectorProps> = ({
  title,
  types,
  selectedType,
  onSelect,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
        <Building className="w-5 h-5 mr-2 text-blue-600" />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {types.map((type) => {
          const isSelected = selectedType === type.id;
          return (
            <MagneticButton
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left group ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
              }`}
            >
              <div className="flex items-center mb-3">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-800/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30'
                  } transition-colors duration-300`}
                >
                  <span
                    className={`text-lg sm:text-xl ${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    } transition-colors duration-300 flex-shrink-0`}
                  >
                    {type.icon}
                  </span>
                </div>
                <span className="ml-3 font-semibold text-sm sm:text-base lg:text-lg text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight break-words flex-1 min-w-0">
                  {type.title}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {type.description}
              </p>
            </MagneticButton>
          );
        })}
      </div>
    </div>
  );
};
