import React, { useState } from 'react';
import { 
  Globe, 
  Check, 
  Sparkles, 
  X, 
  ShieldCheck,
  Zap,
  Languages
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/translations';
import { t, locNum } from '../utils/localization';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState<'languages' | 'civic_dictionary'>('languages');

  if (!isOpen) return null;

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-900 font-bold">
              <Globe className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#0b2545] font-serif">{t('multilingualCenter', currentLanguage)}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-blue-900 rounded border border-blue-200">
                  {locNum(12, currentLanguage)} {t('selectLanguage', currentLanguage)}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {t('activeLanguage', currentLanguage)}: <strong className="text-blue-900 font-bold">{currentLangObj.nativeName} ({currentLangObj.name})</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 bg-slate-50/50 text-xs">
          <button
            onClick={() => setActiveTab('languages')}
            className={`pb-3 font-bold px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'languages'
                ? 'border-[#0b2545] text-[#0b2545]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{t('selectLanguage', currentLanguage)}</span>
          </button>

          <button
            onClick={() => setActiveTab('civic_dictionary')}
            className={`pb-3 font-bold px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'civic_dictionary'
                ? 'border-[#0b2545] text-[#0b2545]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Civic Terminology Glossary</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 bg-white">
          
          {/* TAB 1: LANGUAGES GRID */}
          {activeTab === 'languages' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-700" />
                  Select your preferred official language for state & municipal interactions
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Speech Model: {currentLangObj.speechCode}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(lang.code);
                        onClose();
                      }}
                      className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-200 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-slate-900 tracking-wide font-serif">
                          {lang.nativeName}
                        </span>
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-900">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">{lang.name}</span>
                          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">{lang.speechCode}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {t('submitGrievance', lang.code)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CIVIC DICTIONARY & AI LOCALIZATION PREVIEW */}
          {activeTab === 'civic_dictionary' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                {t('activeLanguage', currentLanguage)}: <strong className="text-blue-900 font-bold">{currentLangObj.name} ({currentLangObj.nativeName})</strong>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase">{t('appTitle', currentLanguage)}</span>
                  <p className="text-sm font-bold text-slate-900">{t('appTitle', currentLanguage)}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase">{t('appSubtitle', currentLanguage)}</span>
                  <p className="text-xs font-medium text-slate-700">{t('appSubtitle', currentLanguage)}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase">{t('submitGrievance', currentLanguage)}</span>
                  <p className="text-sm font-bold text-blue-900">{t('submitGrievance', currentLanguage)}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase">{t('trackStatus', currentLanguage)}</span>
                  <p className="text-sm font-bold text-blue-900">{t('trackStatus', currentLanguage)}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase">{t('voiceInput', currentLanguage)}</span>
                  <p className="text-xs font-medium text-slate-700">{t('voiceInput', currentLanguage)}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase">{t('similarIssueFound', currentLanguage)}</span>
                  <p className="text-xs font-medium text-amber-800">{t('similarIssueFound', currentLanguage)}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Gemini 3.7 Multilingual Civic Redressal</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0b2545] hover:bg-[#133966] text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
          >
            {t('saveChanges', currentLanguage)}
          </button>
        </div>

      </div>
    </div>
  );
};
