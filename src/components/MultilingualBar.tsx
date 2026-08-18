import React from 'react';
import { 
  Globe, 
  ChevronRight, 
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/translations';
import { t } from '../utils/localization';

interface MultilingualBarProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenLanguageModal: () => void;
}

export const MultilingualBar: React.FC<MultilingualBarProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenLanguageModal,
}) => {
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        
        {/* Left Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {t('activeLanguage', currentLanguage)}:
              </span>
              <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {currentLangObj.nativeName} ({currentLangObj.name})
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {t('speakOrType', currentLanguage)}
            </p>
          </div>
        </div>

        {/* Right Action: Language Center Dialog Button */}
        <button
          onClick={onOpenLanguageModal}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shadow-2xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>{t('multilingualCenter', currentLanguage)}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* Language Chips Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 mt-2.5 border-t border-slate-100 no-scrollbar pb-0.5">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#0b2545] text-white font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              {isActive && <Check className="w-3 h-3 text-amber-400" />}
              <span className="text-xs">{lang.nativeName}</span>
              <span className={`text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                ({lang.name})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
