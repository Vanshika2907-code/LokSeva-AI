import React, { useState, useEffect } from 'react';
import { 
  Complaint, 
  UserRole, 
  UserProfile, 
  LanguageCode, 
  NavigationTab,
  IndianState
} from './types';
import { 
  SEED_COMPLAINTS, 
  CURRENT_CITIZEN, 
  CURRENT_OFFICERS,
  STATE_ADMINS
} from './data/seedData';
import { fetchComplaintsAPI } from './utils/aiService';

import { ThreeDIntro } from './components/ThreeDIntro';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { CitizenDashboard } from './components/CitizenDashboard';
import { OfficerDashboard } from './components/OfficerDashboard';
import { StateAdminPortal } from './components/StateAdminPortal';
import { AdminAnalytics } from './components/AdminAnalytics';
import { GrievanceMapView } from './components/GrievanceMapView';
import { GrievanceFormModal } from './components/GrievanceFormModal';
import { GrievanceDetailModal } from './components/GrievanceDetailModal';
import { OfficerStatusModal } from './components/OfficerStatusModal';
import { OfficerAssistantDrawer } from './components/OfficerAssistantDrawer';
import { FeedbackModal } from './components/FeedbackModal';
import { MultilingualBar } from './components/MultilingualBar';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';

import { t } from './utils/localization';

export const App: React.FC = () => {
  // 3D Intro & Gateway State
  const [show3DIntro, setShow3DIntro] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [initialLoginPortal, setInitialLoginPortal] = useState<'citizen' | 'officer' | 'admin'>('citizen');

  // Global App State
  const [complaints, setComplaints] = useState<Complaint[]>(SEED_COMPLAINTS);
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<NavigationTab>('citizen');
  const [selectedState, setSelectedState] = useState<IndianState>('Karnataka');

  // Authenticated User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_CITIZEN);

  // Modals & Drawers State
  const [isNewGrievanceOpen, setIsNewGrievanceOpen] = useState(false);
  const [selectedComplaintDetail, setSelectedComplaintDetail] = useState<Complaint | null>(null);
  const [selectedComplaintForStatus, setSelectedComplaintForStatus] = useState<Complaint | null>(null);
  const [selectedComplaintForFeedback, setSelectedComplaintForFeedback] = useState<Complaint | null>(null);
  const [isOfficerAssistantOpen, setIsOfficerAssistantOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Load complaints from backend on mount
  useEffect(() => {
    const loadBackendComplaints = async () => {
      try {
        const remoteComplaints = await fetchComplaintsAPI();
        if (remoteComplaints && remoteComplaints.length > 0) {
          setComplaints(remoteComplaints);
        }
      } catch (err) {
        console.warn('Using local seed complaints cache:', err);
      }
    };
    loadBackendComplaints();
  }, []);

  // Browser history support — push URL on stage transitions, handle back/forward
  const stageRef = React.useRef<string>('intro');
  useEffect(() => {
    const newStage = show3DIntro ? 'intro' : !isAuthenticated ? 'login' : 'portal';
    if (newStage !== stageRef.current) {
      if (show3DIntro) {
        window.history.pushState({ stage: 'intro' }, '', '/');
      } else if (!isAuthenticated) {
        window.history.pushState({ stage: 'login' }, '', '/login');
      } else {
        window.history.pushState({ stage: 'portal' }, '', '/portal');
      }
      stageRef.current = newStage;
    } else if (stageRef.current === 'intro') {
      window.history.replaceState({ stage: 'intro' }, '', '/');
    }
  }, [show3DIntro, isAuthenticated]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const state = e.state;
      if (!state || state.stage === 'intro') {
        setShow3DIntro(true);
        setIsAuthenticated(false);
      } else if (state.stage === 'login') {
        setShow3DIntro(false);
        setIsAuthenticated(false);
      } else if (state.stage === 'portal') {
        setShow3DIntro(false);
        setIsAuthenticated(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle successful login from Landing Gate
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsAuthenticated(true);

    if (user.state) {
      setSelectedState(user.state as IndianState);
    } else if (user.assignedState) {
      setSelectedState(user.assignedState);
    }

    if (user.role === 'citizen') {
      setActiveTab('citizen');
    } else if (user.role === 'officer') {
      setActiveTab('officer');
    } else {
      setActiveTab('state_portal');
    }
  };

  // Sign out and return to the main login landing page
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setInitialLoginPortal(currentRole === 'officer' ? 'officer' : currentRole === 'admin' ? 'admin' : 'citizen');
  };

  const handleGrievanceCreated = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev.filter((c) => c.id !== newComplaint.id)]);
  };

  const handleComplaintUpdated = (updated: Complaint) => {
    setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (selectedComplaintDetail?.id === updated.id) {
      setSelectedComplaintDetail(updated);
    }
  };

  const handleFollowExisting = (complaintId: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            supportersCount: (c.supportersCount || 1) + 1,
            updates: [
              ...c.updates,
              {
                id: 'upd-' + Date.now(),
                complaintId: c.id,
                status: c.status,
                message: `Citizen ${currentUser?.name || 'Citizen'} reported experiencing this same issue and joined as a supporter. Priority escalated.`,
                createdBy: 'LokSeva Community Sync',
                createdAt: new Date().toISOString(),
                role: 'system',
              },
            ],
          };
        }
        return c;
      })
    );
    const target = complaints.find((c) => c.id === complaintId);
    if (target) {
      setSelectedComplaintDetail(target);
    }
  };

  const handleSupportComplaint = (complaintId: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, supportersCount: (c.supportersCount || 1) + 1 } : c))
    );
  };

  // 1. STAGE 1: 3D INTERACTIVE INTRO SHOWCASE
  if (show3DIntro) {
    return (
      <ThreeDIntro 
        onEnterGate={(targetPortal) => {
          setShow3DIntro(false);
          if (targetPortal) {
            setInitialLoginPortal(targetPortal);
          }
        }} 
      />
    );
  }

  // 2. STAGE 2: CLEAN LANDING PAGE WITH ISOLATED LOGIN FOR CITIZEN, OFFICER & ADMIN
  if (!isAuthenticated) {
    return (
      <HomePage
        currentLanguage={currentLanguage}
        complaints={complaints}
        selectedState={selectedState}
        onLoginSuccess={handleLoginSuccess}
        initialPortal={initialLoginPortal}
      />
    );
  }

  // 3. STAGE 3: AUTHENTICATED ISOLATED PORTAL WORKSPACE
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      
      {/* Top Navigation Header for the Authenticated Portal */}
      <Header
        currentRole={currentRole}
        currentUser={currentUser}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNewGrievance={() => setIsNewGrievanceOpen(true)}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onSignOut={handleSignOut}
        selectedState={selectedState}
        pendingCount={complaints.filter((c) => c.status === 'Submitted' || c.status === 'Under Review' || c.status === 'Assigned').length}
        slaBreachCount={complaints.filter((c) => c.isEscalated || c.isSlaBreached).length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Dedicated Multilingual Switcher Bar */}
        <MultilingualBar
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        />

        {/* 1. CITIZEN PORTAL */}
        {currentRole === 'citizen' && (
          <>
            {activeTab === 'citizen' && (
              <CitizenDashboard
                complaints={complaints}
                currentUser={currentUser}
                currentLanguage={currentLanguage}
                onOpenNewGrievance={() => setIsNewGrievanceOpen(true)}
                onSelectComplaint={(c) => setSelectedComplaintDetail(c)}
                onOpenChat={(c) => setSelectedComplaintDetail(c)}
                onOpenFeedback={(c) => setSelectedComplaintForFeedback(c)}
                onSupportComplaint={handleSupportComplaint}
              />
            )}

            {activeTab === 'map' && (
              <GrievanceMapView
                complaints={complaints}
                currentLanguage={currentLanguage}
                onSelectComplaint={(c) => setSelectedComplaintDetail(c)}
              />
            )}
          </>
        )}

        {/* 2. OFFICER DEPARTMENT CONSOLE */}
        {currentRole === 'officer' && (
          <>
            {activeTab === 'officer' && (
              <OfficerDashboard
                complaints={complaints}
                currentUser={currentUser}
                currentLanguage={currentLanguage}
                onSelectComplaint={(c) => setSelectedComplaintDetail(c)}
                onOpenStatusUpdater={(c) => setSelectedComplaintForStatus(c)}
                onOpenOfficerAssistant={() => setIsOfficerAssistantOpen(true)}
              />
            )}

            {activeTab === 'map' && (
              <GrievanceMapView
                complaints={complaints}
                currentLanguage={currentLanguage}
                onSelectComplaint={(c) => setSelectedComplaintDetail(c)}
              />
            )}
          </>
        )}

        {/* 3. STATE & APEX ADMIN PORTAL */}
        {currentRole === 'admin' && (
          <>
            {activeTab === 'state_portal' && (
              <StateAdminPortal
                complaints={complaints}
                currentUser={currentUser}
                currentLanguage={currentLanguage}
                selectedState={selectedState}
                onSelectState={(state) => {
                  setSelectedState(state);
                  const matchedAdmin = STATE_ADMINS.find((a) => a.assignedState === state);
                  if (matchedAdmin) {
                    setCurrentUser(matchedAdmin);
                  }
                }}
                onSelectComplaint={(c) => setSelectedComplaintDetail(c)}
                onOpenStatusUpdater={(c) => setSelectedComplaintForStatus(c)}
              />
            )}

            {activeTab === 'admin' && (
              <AdminAnalytics 
                complaints={complaints}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'map' && (
              <GrievanceMapView
                complaints={complaints}
                currentLanguage={currentLanguage}
                onSelectComplaint={(c) => setSelectedComplaintDetail(c)}
              />
            )}
          </>
        )}

      </main>

      {/* MODALS AND DRAWERS */}

      {/* 1. Grievance Submission Modal */}
      <GrievanceFormModal
        isOpen={isNewGrievanceOpen}
        onClose={() => setIsNewGrievanceOpen(false)}
        currentUser={currentUser}
        currentLanguage={currentLanguage}
        onGrievanceCreated={handleGrievanceCreated}
        onFollowExistingComplaint={handleFollowExisting}
      />

      {/* 2. Grievance Detail & Action History Modal */}
      <GrievanceDetailModal
        complaint={selectedComplaintDetail}
        onClose={() => setSelectedComplaintDetail(null)}
        currentRole={currentRole}
        currentUser={currentUser}
        currentLanguage={currentLanguage}
        onOpenStatusUpdater={(c) => setSelectedComplaintForStatus(c)}
        onOpenFeedbackModal={(c) => setSelectedComplaintForFeedback(c)}
      />

      {/* 3. Officer Status Updater Modal */}
      <OfficerStatusModal
        complaint={selectedComplaintForStatus}
        currentUser={currentUser}
        currentLanguage={currentLanguage}
        onClose={() => setSelectedComplaintForStatus(null)}
        onStatusUpdated={handleComplaintUpdated}
      />

      {/* 4. Officer AI Assistant Drawer */}
      <OfficerAssistantDrawer
        isOpen={isOfficerAssistantOpen}
        onClose={() => setIsOfficerAssistantOpen(false)}
        currentUser={currentUser}
        currentLanguage={currentLanguage}
      />

      {/* 5. Citizen Resolution Feedback Modal */}
      <FeedbackModal
        complaint={selectedComplaintForFeedback}
        currentLanguage={currentLanguage}
        onClose={() => setSelectedComplaintForFeedback(null)}
        onFeedbackSubmitted={handleComplaintUpdated}
      />

      {/* 6. Dedicated Multilingual Center Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* Formal Government Portal Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto font-medium">
          <span>{t('appTitle', currentLanguage)} • {t('appSubtitle', currentLanguage)}</span>
          <span className="flex items-center gap-1 text-slate-600">
            Official Public Grievance Redressal System • Sovereign AI Architecture
          </span>
        </div>
      </footer>

    </div>
  );
};

export default App;
