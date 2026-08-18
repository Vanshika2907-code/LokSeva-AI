import React from 'react';
import { 
  ShieldAlert, 
  BarChart3, 
  FileText, 
  Briefcase, 
  MapPin, 
  Sparkles, 
  PhoneCall, 
  Landmark, 
  Globe2, 
  LogOut, 
  Home, 
  Layers, 
  User,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { LanguageCode, UserRole, UserProfile, NavigationTab, IndianState } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/translations';
import { t, locNum } from '../utils/localization';

interface HeaderProps {
  currentRole: UserRole;
  currentUser: UserProfile;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenNewGrievance: () => void;
  onOpenLanguageModal?: () => void;
  onSignOut: () => void;
  selectedState?: IndianState;
  pendingCount?: number;
  slaBreachCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentUser,
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange,
  onOpenNewGrievance,
  onOpenLanguageModal,
  onSignOut,
  selectedState = 'Karnataka',
  pendingCount = 0,
  slaBreachCount = 0,
}) => {
  const user = currentUser;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Official Government Top Bar */}
      <div className="bg-[#0b2545] text-slate-200 border-b border-[#133966] px-4 sm:px-8 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left Government Credentials */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium tracking-wide text-slate-200">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Government Civic Redressal Matrix • National Portal</span>
              <span className="sm:hidden">Govt. of India • LokSeva AI</span>
            </div>
            <span className="hidden md:inline text-slate-400">|</span>
            <div className="hidden md:flex items-center gap-1 text-slate-300">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Citizen Helpline: <strong className="text-white">1916 (Toll Free)</strong></span>
            </div>
          </div>

          {/* Right Status, Language & Exit */}
          <div className="flex items-center gap-2.5">
            {slaBreachCount > 0 && (
              <span className="inline-flex items-center gap-1 text-rose-300 font-semibold text-[11px] bg-rose-950/80 px-2 py-0.5 rounded border border-rose-600/40 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                {locNum(slaBreachCount, currentLanguage)} {t('statsEscalated', currentLanguage)}
              </span>
            )}

            {/* Language Selector Modal Button */}
            {onOpenLanguageModal && (
              <button
                onClick={onOpenLanguageModal}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-100 font-bold transition-all text-xs border border-blue-700/60 cursor-pointer shadow-2xs"
                title="Change Language"
              >
                <Globe2 className="w-3.5 h-3.5 text-cyan-300" />
                <span>{SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.nativeName || 'English'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header / Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Portal Brand & Name */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-xs text-white shrink-0 ${
              currentRole === 'citizen' 
                ? 'bg-blue-900 border border-blue-700' 
                : currentRole === 'officer' 
                ? 'bg-amber-900 border border-amber-700' 
                : 'bg-emerald-900 border border-emerald-700'
            }`}>
              {currentRole === 'citizen' ? (
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
              ) : currentRole === 'officer' ? (
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
              ) : (
                <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#0b2545] font-serif">
                  LOKSEVA
                </span>
                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                  currentRole === 'citizen' 
                    ? 'bg-blue-50 text-blue-900 border-blue-200' 
                    : currentRole === 'officer' 
                    ? 'bg-amber-50 text-amber-900 border-amber-200' 
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                }`}>
                  {currentRole === 'citizen' 
                    ? 'Citizen Portal' 
                    : currentRole === 'officer' 
                    ? `${user.department || 'Officer'} Console` 
                    : 'State Admin Command'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block truncate max-w-xs md:max-w-md font-medium">
                {currentRole === 'citizen' 
                  ? 'File & track municipal grievances in 22 official languages' 
                  : currentRole === 'officer' 
                  ? `Authorized Department Queue • ${user.city || 'Bengaluru'}` 
                  : 'State & National Multi-Department SLA Governance'}
              </p>
            </div>
          </div>

          {/* Dynamic Navigation Views strictly tailored for the Authenticated Portal */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 text-xs">
            
            {/* CITIZEN PORTAL NAVIGATION */}
            {currentRole === 'citizen' && (
              <>
                <button
                  onClick={() => onTabChange('citizen')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'citizen'
                      ? 'bg-[#0b2545] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>My Grievances & Dashboard</span>
                </button>

                <button
                  onClick={() => onTabChange('map')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'map'
                      ? 'bg-[#0b2545] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Neighborhood Map</span>
                </button>
              </>
            )}

            {/* OFFICER PORTAL NAVIGATION */}
            {currentRole === 'officer' && (
              <>
                <button
                  onClick={() => onTabChange('officer')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'officer'
                      ? 'bg-[#0b2545] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Department Queue ({user.department || 'All'})</span>
                </button>

                <button
                  onClick={() => onTabChange('map')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'map'
                      ? 'bg-[#0b2545] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ward GIS Map</span>
                </button>
              </>
            )}

            {/* ADMIN PORTAL NAVIGATION */}
            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => onTabChange('state_portal')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'state_portal'
                      ? 'bg-[#0b2545] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span>State Command Overview</span>
                </button>

                <button
                  onClick={() => onTabChange('admin')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-[#0b2545] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Cross-Dept Analytics</span>
                </button>

                <button
                  onClick={() => onTabChange('map')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'map'
                      ? 'bg-[#0b2545] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Statewide Heatmap</span>
                </button>
              </>
            )}

          </nav>

          {/* Right Controls: Quick Actions, Profile & Exit Portal */}
          <div className="flex items-center gap-3">
            
            {/* Quick Report Button for Citizen */}
            {currentRole === 'citizen' && (
              <button
                id="header-submit-btn"
                onClick={onOpenNewGrievance}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Submit Grievance</span>
              </button>
            )}

            {/* Authenticated User Badge */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-blue-700 font-semibold truncate max-w-[150px]">
                  {currentRole === 'citizen'
                    ? user.email
                    : currentRole === 'officer'
                    ? `${user.badgeId || 'Badge'} • ${user.city || 'City'}`
                    : `${user.badgeId || 'Admin'} • ${user.assignedState || 'State'}`}
                </span>
              </div>

              <div 
                className="w-8 h-8 rounded-full bg-[#0b2545] text-white flex items-center justify-center text-xs font-bold shrink-0 border border-slate-300"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || 'User'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{(user.name || 'U').charAt(0)}</span>
                )}
              </div>
            </div>

            {/* Prominent Exit Portal / Sign Out Button */}
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all cursor-pointer shadow-2xs"
              title="Sign out and return to the main portal login gateway"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Exit Portal</span>
            </button>

          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden items-center justify-between py-2 border-t border-slate-200 text-xs overflow-x-auto gap-1">
          {currentRole === 'citizen' && (
            <>
              <button
                onClick={() => onTabChange('citizen')}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${activeTab === 'citizen' ? 'bg-[#0b2545] text-white' : 'text-slate-600'}`}
              >
                🇮🇳 My Grievances
              </button>
              <button
                onClick={() => onTabChange('map')}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${activeTab === 'map' ? 'bg-[#0b2545] text-white' : 'text-slate-600'}`}
              >
                🗺️ Neighborhood Map
              </button>
            </>
          )}

          {currentRole === 'officer' && (
            <>
              <button
                onClick={() => onTabChange('officer')}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${activeTab === 'officer' ? 'bg-[#0b2545] text-white' : 'text-slate-600'}`}
              >
                🏢 Department Queue
              </button>
              <button
                onClick={() => onTabChange('map')}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${activeTab === 'map' ? 'bg-[#0b2545] text-white' : 'text-slate-600'}`}
              >
                🗺️ Ward GIS Map
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => onTabChange('state_portal')}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${activeTab === 'state_portal' ? 'bg-[#0b2545] text-white' : 'text-slate-600'}`}
              >
                🏛️ State Command
              </button>
              <button
                onClick={() => onTabChange('admin')}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${activeTab === 'admin' ? 'bg-[#0b2545] text-white' : 'text-slate-600'}`}
              >
                📊 Analytics
              </button>
              <button
                onClick={() => onTabChange('map')}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${activeTab === 'map' ? 'bg-[#0b2545] text-white' : 'text-slate-600'}`}
              >
                🗺️ State Map
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
