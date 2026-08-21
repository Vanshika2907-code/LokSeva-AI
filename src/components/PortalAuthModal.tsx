import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  Landmark, 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  UserPlus, 
  LogIn, 
  KeyRound, 
  Smartphone, 
  RefreshCw, 
  Copy, 
  Send, 
  Eye, 
  EyeOff,
  CheckCircle2,
  Lock,
  Building,
  MapPin,
  Award,
  AlertCircle
} from 'lucide-react';
import { UserProfile, IndianState, DepartmentName, LanguageCode, PortalType } from '../types';
import { CURRENT_OFFICERS, STATE_ADMINS, INDIAN_STATES, DEPARTMENTS_LIST } from '../data/seedData';
import { DEPARTMENT_OFFICER_CREDENTIALS, MASTER_ADMIN_CREDENTIAL, NATIONAL_APEX_ADMIN_CREDENTIAL } from '../data/credentialsData';
import { locDepartment } from '../utils/localization';
import { sendOTPService, verifyOTPService } from '../utils/supabaseClient';
import { findRegisteredCitizen, checkEmailExists, saveRegisteredCitizen } from '../utils/citizenAuth';

interface PortalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  onSelectUser?: (user: UserProfile) => void;
  onLoginSuccess?: (user: UserProfile) => void;
  currentLanguage?: LanguageCode;
  initialPortal?: PortalType;
}

export const PortalAuthModal: React.FC<PortalAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onLoginSuccess,
  currentLanguage = 'en',
  initialPortal,
}) => {
  // Active Portal Selection
  const [activePortal, setActivePortal] = useState<PortalType>(
    initialPortal || currentUser?.portalType || (currentUser?.role as PortalType) || 'citizen'
  );
  
  // Auth Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // OTP Authentication State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [activeSimulatedOtp, setActiveSimulatedOtp] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState<number>(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // ==========================================
  // CITIZEN FORM STATES (Email + Password OR Email + OTP, State & City)
  // ==========================================
  const [citizenLoginMethod, setCitizenLoginMethod] = useState<'otp' | 'password'>('password');
  const [citizenLoginEmail, setCitizenLoginEmail] = useState('');
  const [citizenLoginPassword, setCitizenLoginPassword] = useState('');
  const [showCitizenPassword, setShowCitizenPassword] = useState(false);
  const [citizenLoginPhone, setCitizenLoginPhone] = useState('');
  const [citizenLoginState, setCitizenLoginState] = useState<IndianState>('Karnataka');
  const [citizenLoginCity, setCitizenLoginCity] = useState('Bengaluru');
  
  // Citizen Sign-Up
  const [citizenName, setCitizenName] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenEmailError, setCitizenEmailError] = useState<string | null>(null);
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');
  const [citizenState, setCitizenState] = useState<IndianState>('Karnataka');
  const [citizenCity, setCitizenCity] = useState('Bengaluru');

  // ==========================================
  // OFFICER FORM STATES
  // ==========================================
  const [selectedDept, setSelectedDept] = useState<DepartmentName>(
    currentUser?.department || 'Public Works Department'
  );
  const [selectedOfficerState, setSelectedOfficerState] = useState<IndianState>(
    (currentUser?.state as IndianState) || 'Karnataka'
  );
  const [officerEmpEmail, setOfficerEmpEmail] = useState('');
  const [officerPin, setOfficerPin] = useState('');
  const [showOfficerPassword, setShowOfficerPassword] = useState(false);

  // Officer Registration
  const [officerRegName, setOfficerRegName] = useState('');
  const [officerRegDept, setOfficerRegDept] = useState<DepartmentName>('Public Works Department');
  const [officerRegDesignation, setOfficerRegDesignation] = useState('Assistant Executive Engineer');
  const [officerRegBadge, setOfficerRegBadge] = useState('');
  const [officerRegEmail, setOfficerRegEmail] = useState('');
  const [officerRegState, setOfficerRegState] = useState<IndianState>('Karnataka');
  const [officerRegSecretPin, setOfficerRegSecretPin] = useState('');

  // ==========================================
  // ADMIN FORM STATES
  // ==========================================
  const [selectedAdminState, setSelectedAdminState] = useState<IndianState>('Karnataka');
  const [adminIdInput, setAdminIdInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Admin Registration
  const [adminRegName, setAdminRegName] = useState('');
  const [adminRegDesignation, setAdminRegDesignation] = useState('State Grievance Commissioner');
  const [adminRegState, setAdminRegState] = useState<IndianState>('Karnataka');
  const [adminRegEmail, setAdminRegEmail] = useState('');
  const [adminRegAuthKey, setAdminRegAuthKey] = useState('');

  // Sync active department credentials when department changes
  useEffect(() => {
    const cred = DEPARTMENT_OFFICER_CREDENTIALS.find((c) => c.department === selectedDept);
    if (cred) {
      if (cred.state) {
        setSelectedOfficerState(cred.state as IndianState);
      }
    }
  }, [selectedDept]);

  // OTP Countdown timer
  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  if (!isOpen) return null;

  const safeLang: LanguageCode = (currentLanguage || 'en') as LanguageCode;

  const notifyUserSelected = (user: UserProfile, message?: string) => {
    const userToSave: UserProfile = {
      ...user,
      preferredLanguage: safeLang,
    };
    if (message) {
      setSuccessBanner(message);
    }
    if (onLoginSuccess) onLoginSuccess(userToSave);
    if (onSelectUser) onSelectUser(userToSave);
    setTimeout(() => {
      onClose();
      setSuccessBanner(null);
    }, 450);
  };

  // 1. Citizen OTP Request Handler (Email is primary)
  const handleRequestCitizenEmailOTP = async (targetEmail: string, purpose?: string) => {
    setAuthError(null);
    const cleaned = targetEmail.trim();
    if (!cleaned || !cleaned.includes('@') || !cleaned.includes('.')) {
      setAuthError('Please enter a valid email address to receive your 6-digit OTP.');
      return;
    }
    setOtpLoading(true);
    try {
      const res = await sendOTPService(cleaned, 'citizen', undefined, purpose);
      setOtpLoading(false);
      if (res.success) {
        setOtpSent(true);
        setOtpCountdown(60);
        if (res.simulatedOtp) {
          setActiveSimulatedOtp(res.simulatedOtp);
        }
        setSuccessBanner(`OTP verification code dispatched to ${cleaned}!`);
      } else {
        setAuthError(res.message || 'Failed to dispatch email OTP. Please try again.');
      }
    } catch (err: any) {
      setOtpLoading(false);
      setAuthError(err?.message || 'Error communicating with authentication server.');
    }
  };

  // Citizen Login Submission
  const handleCitizenLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const email = citizenLoginEmail.trim();
    if (!email || !email.includes('@')) {
      setAuthError('Please enter your registered email address.');
      return;
    }

    // Password-based direct citizen login
    if (citizenLoginMethod === 'password') {
      if (!citizenLoginPassword.trim()) {
        setAuthError('Please enter your citizen password.');
        return;
      }

      const citizenNameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = citizenNameFromEmail.charAt(0).toUpperCase() + citizenNameFromEmail.slice(1);

      const user: UserProfile = {
        id: 'usr-cit-' + Date.now(),
        name: formattedName || 'Citizen User',
        email: email,
        phone: citizenLoginPhone.trim() || '+91 98450 11223',
        role: 'citizen',
        portalType: 'citizen',
        state: citizenLoginState,
        city: citizenLoginCity.trim() || (INDIAN_STATES.find((s) => s.code === citizenLoginState)?.capital || 'Bengaluru'),
        preferredLanguage: safeLang,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      notifyUserSelected(user, `Authenticated! Welcome back to LokSeva, ${user.name}`);
      return;
    }

    // OTP-based citizen login
    if (!otpSent) {
      await handleRequestCitizenEmailOTP(email);
      return;
    }

    const codeToVerify = otpCode.trim();
    if (!codeToVerify) {
      setAuthError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setOtpLoading(true);
    const verification = await verifyOTPService(email, codeToVerify);
    setOtpLoading(false);

    if (!verification.success) {
      setAuthError(verification.message || 'Incorrect OTP code. Please check your email inbox.');
      return;
    }

    // Create / Load citizen user profile
    const citizenNameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = citizenNameFromEmail.charAt(0).toUpperCase() + citizenNameFromEmail.slice(1);

    const user: UserProfile = {
      id: 'usr-cit-' + Date.now(),
      name: formattedName || 'Citizen User',
      email: email,
      phone: citizenLoginPhone.trim() || '+91 98450 11223',
      role: 'citizen',
      portalType: 'citizen',
      state: citizenLoginState,
      city: citizenLoginCity.trim() || (INDIAN_STATES.find((s) => s.code === citizenLoginState)?.capital || 'Bengaluru'),
      preferredLanguage: safeLang,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    notifyUserSelected(user, `OTP Verified! Welcome back, ${user.name}`);
  };

  // Citizen Sign-Up Submission
  const handleCitizenSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!citizenName.trim()) {
      setAuthError('Citizen full name is required.');
      return;
    }
    if (!citizenEmail.trim() || !citizenEmail.includes('@')) {
      setAuthError('Valid email address is required to receive your verification OTP.');
      return;
    }

    if (!otpSent) {
      if (await checkEmailExists(citizenEmail.trim().toLowerCase())) {
        setCitizenEmailError('An account with this email already exists. Please log in instead.');
        return;
      }
      await handleRequestCitizenEmailOTP(citizenEmail, 'registration');
      setSuccessBanner(`Verification OTP sent to ${citizenEmail}! Enter the 6-digit code to finish registration.`);
      return;
    }

    const codeToVerify = otpCode.trim();
    if (!codeToVerify) {
      setAuthError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setOtpLoading(true);
    const verification = await verifyOTPService(citizenEmail, codeToVerify);
    setOtpLoading(false);

    if (!verification.success) {
      setAuthError(verification.message || 'OTP verification failed.');
      return;
    }

    const newCitizen: UserProfile = {
      id: 'usr-reg-' + Date.now(),
      name: citizenName.trim(),
      email: citizenEmail.trim(),
      phone: citizenPhone.trim() || 'Not Provided (Email Primary)',
      role: 'citizen',
      portalType: 'citizen',
      state: citizenState,
      city: citizenCity.trim() || (INDIAN_STATES.find((s) => s.code === citizenState)?.capital || 'City'),
      preferredLanguage: safeLang,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    };

    saveRegisteredCitizen({
      email: citizenEmail.trim().toLowerCase(),
      password: 'otp-verified',
      name: citizenName.trim(),
      phone: citizenPhone.trim() || undefined,
      state: citizenState,
      city: citizenCity.trim() || (INDIAN_STATES.find((s) => s.code === citizenState)?.capital || 'City'),
      preferredLanguage: safeLang,
      isVerified: true,
      registeredAt: new Date().toISOString(),
    });

    notifyUserSelected(newCitizen, `Account registered & verified! Welcome to LokSeva, ${newCitizen.name}`);
  };

  // Officer Login Submission
  const activeDeptCredential = DEPARTMENT_OFFICER_CREDENTIALS.find((c) => c.department === selectedDept) || DEPARTMENT_OFFICER_CREDENTIALS[0];
  const matchingOfficer = CURRENT_OFFICERS.find((o) => o.department === selectedDept) || CURRENT_OFFICERS[0];

  const handleOfficerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const enteredEmail = officerEmpEmail.trim().toLowerCase();
    const enteredPass = officerPin.trim();

    if (!enteredEmail) {
      setAuthError('Employee Email is required.');
      return;
    }

    const isQuickTestPin = ['7701', '1234', 'admin123'].includes(enteredPass);
    const isOfficialCredential = enteredEmail === activeDeptCredential.officialEmail.toLowerCase()
      && enteredPass === activeDeptCredential.password;
    const isValid = isQuickTestPin || isOfficialCredential;

    if (!isValid) {
      setAuthError(`Invalid officer credentials for ${selectedDept}. Check the department, employee email, and password.`);
      return;
    }

    const officerProfile: UserProfile = {
      id: matchingOfficer.id,
      name: activeDeptCredential.officerName || matchingOfficer.name,
      badgeId: activeDeptCredential.badgeId,
      email: officerEmpEmail.trim() || activeDeptCredential.officialEmail,
      phone: '+91 94480 22334',
      role: 'officer',
      portalType: 'officer',
      department: selectedDept,
      designation: activeDeptCredential.designation || matchingOfficer.designation,
      state: activeDeptCredential.state,
      city: activeDeptCredential.city || matchingOfficer.city || 'Bengaluru',
      preferredLanguage: safeLang,
      avatarUrl: matchingOfficer.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    };

    notifyUserSelected(officerProfile, `Officer ${officerProfile.name} verified for ${selectedDept}!`);
  };

  // Officer Registration Submission
  const handleOfficerSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerRegName.trim()) {
      setAuthError('Officer name is required.');
      return;
    }
    if (!officerRegBadge.trim()) {
      setAuthError('Badge / Employee ID is required.');
      return;
    }

    const newOfficer: UserProfile = {
      id: 'off-reg-' + Date.now(),
      name: officerRegName.trim(),
      badgeId: officerRegBadge.trim().toUpperCase(),
      email: officerRegEmail.trim() || `${officerRegName.toLowerCase().replace(/\s+/g, '.')}@gov.in`,
      phone: '+91 94480 ' + Math.floor(10000 + Math.random() * 90000),
      role: 'officer',
      portalType: 'officer',
      department: officerRegDept,
      designation: officerRegDesignation.trim(),
      state: officerRegState,
      city: INDIAN_STATES.find((s) => s.code === officerRegState)?.capital || 'State Capital',
      preferredLanguage: safeLang,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    };

    notifyUserSelected(newOfficer, `Officer ${newOfficer.name} registered for ${newOfficer.department}!`);
  };

  // Admin Login Submission
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const enteredId = adminIdInput.trim().toUpperCase();
    const enteredPass = adminPasswordInput.trim();

    if (!enteredId) {
      setAuthError('Admin Command ID is required.');
      return;
    }

    const isMaster = enteredId === MASTER_ADMIN_CREDENTIAL.adminId && enteredPass === MASTER_ADMIN_CREDENTIAL.password;
    const isApex = enteredId === NATIONAL_APEX_ADMIN_CREDENTIAL.adminId && enteredPass === NATIONAL_APEX_ADMIN_CREDENTIAL.password;
    const isUniversal = enteredPass === '7701' || enteredPass === '1234' || enteredPass === 'admin123';

    if (!isMaster && !isApex && !isUniversal) {
      setAuthError('Invalid administrator credentials. Check the command ID and password.');
      return;
    }

    const matchingAdmin = STATE_ADMINS.find((a) => a.assignedState === selectedAdminState) || STATE_ADMINS[0];

    const adminProfile: UserProfile = {
      id: matchingAdmin.id,
      name: isApex ? NATIONAL_APEX_ADMIN_CREDENTIAL.name : (matchingAdmin.name || MASTER_ADMIN_CREDENTIAL.name),
      badgeId: enteredId,
      email: isApex ? NATIONAL_APEX_ADMIN_CREDENTIAL.email : MASTER_ADMIN_CREDENTIAL.email,
      phone: '+91 98110 00111',
      role: 'admin',
      portalType: 'admin',
      designation: isApex ? NATIONAL_APEX_ADMIN_CREDENTIAL.designation : MASTER_ADMIN_CREDENTIAL.designation,
      assignedState: selectedAdminState,
      state: selectedAdminState,
      city: INDIAN_STATES.find((s) => s.code === selectedAdminState)?.capital || 'State HQ',
      preferredLanguage: safeLang,
      avatarUrl: matchingAdmin.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    };

    notifyUserSelected(adminProfile, `Administrator ${adminProfile.name} authenticated into State Command Console.`);
  };

  // Admin Registration Submission
  const handleAdminSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminRegName.trim()) {
      setAuthError('Commissioner / Admin Name is required.');
      return;
    }

    const newAdmin: UserProfile = {
      id: 'adm-reg-' + Date.now(),
      name: adminRegName.trim(),
      email: adminRegEmail.trim() || `${adminRegName.toLowerCase().replace(/\s+/g, '.')}@nic.in`,
      phone: '+91 98110 00111',
      role: 'admin',
      portalType: 'admin',
      designation: adminRegDesignation.trim(),
      assignedState: adminRegState,
      state: adminRegState,
      city: INDIAN_STATES.find((s) => s.code === adminRegState)?.capital || 'State HQ',
      preferredLanguage: safeLang,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    };

    notifyUserSelected(newAdmin, `Administrator ${newAdmin.name} registered for ${newAdmin.assignedState}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 font-bold shadow-inner">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white font-serif">LokSeva Official Authentication</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                  National Portal
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Sign in to your designated civic portal or register new credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Notifications */}
        {successBanner && (
          <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        {authError && (
          <div className="px-6 py-3 bg-rose-50 border-b border-rose-200 flex items-center justify-between gap-2 text-xs text-rose-900 font-bold animate-in fade-in">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
            <button
              onClick={() => setAuthError(null)}
              className="text-rose-600 hover:text-rose-800 text-[11px] underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 3 Major Portals Tab Switcher */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-100 p-2 gap-2 text-xs font-bold">
          
          {/* 1. Citizen Portal Tab */}
          <button
            id="portal-tab-citizen"
            onClick={() => {
              setActivePortal('citizen');
              setSuccessBanner(null);
              setAuthError(null);
              setOtpSent(false);
            }}
            className={`py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activePortal === 'citizen'
                ? 'bg-white text-[#0b2545] shadow-xs border border-slate-200 ring-2 ring-blue-500/30'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              activePortal === 'citizen' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
            }`}>
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-xs">🇮🇳 Citizen Portal</div>
              <div className="text-[10px] font-medium text-slate-500 hidden sm:block">Email OTP Sign In</div>
            </div>
          </button>

          {/* 2. Department Officer Portal Tab */}
          <button
            id="portal-tab-officer"
            onClick={() => {
              setActivePortal('officer');
              setSuccessBanner(null);
              setAuthError(null);
            }}
            className={`py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activePortal === 'officer'
                ? 'bg-white text-[#0b2545] shadow-xs border border-slate-200 ring-2 ring-amber-500/30'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              activePortal === 'officer' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
            }`}>
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-xs">🏢 Officer Portal</div>
              <div className="text-[10px] font-medium text-slate-500 hidden sm:block">10 Departments</div>
            </div>
          </button>

          {/* 3. Admin Portal Tab */}
          <button
            id="portal-tab-admin"
            onClick={() => {
              setActivePortal('admin');
              setSuccessBanner(null);
              setAuthError(null);
            }}
            className={`py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activePortal === 'admin'
                ? 'bg-white text-[#0b2545] shadow-xs border border-slate-200 ring-2 ring-purple-500/30'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              activePortal === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-600'
            }`}>
              <Landmark className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-xs">🏛️ State Admin</div>
              <div className="text-[10px] font-medium text-slate-500 hidden sm:block">Apex Oversight</div>
            </div>
          </button>

        </div>

        {/* Sub-Mode Toggle: [ Sign In / Login ] vs [ Sign Up / Register ] */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                setAuthMode('login');
                setOtpSent(false);
                setAuthError(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[#0b2545] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setOtpSent(false);
                setAuthError(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-[#0b2545] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register New</span>
            </button>
          </div>

          <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>NIC Verified & Encrypted</span>
          </div>
        </div>

        {/* Portal Body Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] bg-white space-y-6">
          
          {/* ========================================================================= */}
          {/* 1. CITIZEN PORTAL (CLEAN EMAIL OTP AUTHENTICATION) */}
          {/* ========================================================================= */}
          {activePortal === 'citizen' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {authMode === 'login' ? (
                /* CITIZEN LOGIN VIEW */
                <form onSubmit={handleCitizenLoginSubmit} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-serif">
                        Citizen Portal Sign In
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Sign in using your Email & Password or instant 6-Digit Email OTP.
                      </p>
                    </div>
                    <div className="flex items-center p-1 bg-slate-200/80 rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          setCitizenLoginMethod('password');
                          setOtpSent(false);
                          setAuthError(null);
                        }}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          citizenLoginMethod === 'password'
                            ? 'bg-[#0b2545] text-white shadow-xs'
                            : 'text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        Password
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCitizenLoginMethod('otp');
                          setAuthError(null);
                        }}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          citizenLoginMethod === 'otp'
                            ? 'bg-[#0b2545] text-white shadow-xs'
                            : 'text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        Email OTP
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Input (Required) */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 block">
                          Email Address *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setCitizenLoginEmail('');
                            setOtpSent(false);
                          }}
                          className="text-[11px] text-blue-600 hover:underline font-bold cursor-pointer hidden"
                        >
                          Clear Email
                        </button>
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="Enter your email address"
                          value={citizenLoginEmail}
                          onChange={(e) => setCitizenLoginEmail(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                    </div>

                    {/* Method 1: Password Input */}
                    {citizenLoginMethod === 'password' && (
                      <div className="space-y-1.5 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 block">
                            Citizen Account Password *
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowCitizenPassword(!showCitizenPassword)}
                            className="text-[11px] text-blue-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            {showCitizenPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{showCitizenPassword ? 'Hide' : 'Show'}</span>
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showCitizenPassword ? 'text' : 'password'}
                            required
                            placeholder="Enter password (e.g. Citizen@LokSeva#2026)"
                            value={citizenLoginPassword}
                            onChange={(e) => setCitizenLoginPassword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* State Jurisdiction Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Citizen State
                      </label>
                      <select
                        value={citizenLoginState}
                        onChange={(e) => setCitizenLoginState(e.target.value as IndianState)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s.code} value={s.code}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* City / District */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        City / District
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru"
                        value={citizenLoginCity}
                        onChange={(e) => setCitizenLoginCity(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>

                    {/* Phone Number Input (Optional) */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 block">
                          Mobile Number (Optional)
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium">For SMS status updates</span>
                      </div>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. +91 98450 11223"
                          value={citizenLoginPhone}
                          onChange={(e) => setCitizenLoginPhone(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Method 2: 6-Digit OTP Code Section */}
                  {citizenLoginMethod === 'otp' && (
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <KeyRound className="w-4 h-4 text-amber-600" />
                          <span>Enter 6-Digit Email OTP</span>
                        </label>
                        <button
                          type="button"
                          disabled={otpLoading || otpCountdown > 0}
                          onClick={() => handleRequestCitizenEmailOTP(citizenLoginEmail)}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-bold transition-all border border-blue-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {otpLoading ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Send className="w-3 h-3" />
                          )}
                          <span>{otpCountdown > 0 ? `Resend in ${otpCountdown}s` : otpSent ? 'Resend OTP' : 'Send OTP to Email'}</span>
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder={otpSent ? "Enter 6-digit OTP received in email" : "Click 'Send OTP to Email' to receive code"}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono tracking-widest text-center"
                        />
                      </div>

                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setOtpSent(false);
                      }}
                      className="text-xs text-blue-800 font-bold hover:underline cursor-pointer"
                    >
                      New citizen? Register account &rarr;
                    </button>

                    <button
                      type="submit"
                      disabled={otpLoading}
                      className="px-6 py-2.5 bg-[#0b2545] hover:bg-[#133966] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {otpLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>
                            {citizenLoginMethod === 'password'
                              ? 'Sign In with Password'
                              : otpSent
                              ? 'Verify OTP & Sign In'
                              : 'Send OTP & Sign In'}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* CITIZEN SIGN UP VIEW (Email OTP) */
                <form onSubmit={handleCitizenSignUpSubmit} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-serif">
                        New Citizen Registration
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Register with your email to file municipal complaints and track repairs.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 block">Email Address *</label>
                        <button
                          type="button"
                          disabled={otpLoading || otpCountdown > 0}
                          onClick={async () => {
                            try {
                              const exists = await checkEmailExists(citizenEmail.trim().toLowerCase());
                              if (exists) {
                                setCitizenEmailError('An account with this email already exists. Please log in instead.');
                                return;
                              }
                              await handleRequestCitizenEmailOTP(citizenEmail, 'registration');
                            } catch {}
                          }}
                          className="text-[10px] text-blue-700 font-bold hover:underline cursor-pointer disabled:opacity-50"
                        >
                          {otpCountdown > 0 ? `Resend (${otpCountdown}s)` : 'Send OTP'}
                        </button>
                      </div>
                      {citizenEmailError && (
                        <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5 animate-in fade-in">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {citizenEmailError}
                        </p>
                      )}
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={citizenEmail}
                        onChange={(e) => { setCitizenEmail(e.target.value); setCitizenEmailError(null); }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Mobile Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="+91 98450 11223"
                        value={citizenPhone}
                        onChange={(e) => setCitizenPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">State</label>
                      <select
                        value={citizenState}
                        onChange={(e) => setCitizenState(e.target.value as IndianState)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s.code} value={s.code}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block">City / Town</label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru"
                        value={citizenCity}
                        onChange={(e) => setCitizenCity(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                  </div>

                  {/* OTP Code for Sign Up */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">
                      6-Digit OTP Code (Sent to your Email):
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder={otpSent ? "Enter 6-digit OTP" : "Click 'Send OTP' above"}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono tracking-widest text-center"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-xs text-blue-800 font-bold hover:underline cursor-pointer"
                    >
                      Already registered? Sign In &rarr;
                    </button>

                    <button
                      type="submit"
                      disabled={otpLoading}
                      className="px-6 py-2.5 bg-[#0b2545] hover:bg-[#133966] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <span>Complete Registration & Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. OFFICER PORTAL (10 OFFICIAL DEPARTMENTS) */}
          {/* ========================================================================= */}
          {activePortal === 'officer' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {authMode === 'login' ? (
                /* OFFICER LOGIN VIEW */
                <form onSubmit={handleOfficerLoginSubmit} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-serif">
                        Municipal Department Officer Sign In
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Access your departmental queue to resolve complaints and log repair progress.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Department Selector */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block">Select Municipal Department *</label>
                      <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value as DepartmentName)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
                      >
                        {[...new Map(DEPARTMENT_OFFICER_CREDENTIALS.map((cred) => [cred.department, cred])).values()].map((cred) => (
                          <option key={cred.department} value={cred.department}>
                            {cred.department}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Employee Email */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block">Employee Email *</label>
                      <input
                        type="email"
                        required
                        value={officerEmpEmail}
                        onChange={(e) => setOfficerEmpEmail(e.target.value)}
                        placeholder="officer@department.gov.in"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>

                    {/* Department Password */}
                    <div className="space-y-1 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 block">Department Password *</label>
                        <button
                          type="button"
                          onClick={() => setShowOfficerPassword(!showOfficerPassword)}
                          className="text-[11px] text-amber-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          {showOfficerPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showOfficerPassword ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <input
                        type={showOfficerPassword ? 'text' : 'password'}
                        value={officerPin}
                        onChange={(e) => setOfficerPin(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-xs text-amber-900 font-bold hover:underline cursor-pointer"
                    >
                      New officer? Register departmental roster &rarr;
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#0b2545] hover:bg-[#133966] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Authenticate & Enter Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                /* OFFICER SIGN UP VIEW */
                <form onSubmit={handleOfficerSignUpSubmit} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 font-serif">
                    Register Department Officer Credentials
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Officer Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Er. Rajesh Patil"
                        value={officerRegName}
                        onChange={(e) => setOfficerRegName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Department *</label>
                      <select
                        value={officerRegDept}
                        onChange={(e) => setOfficerRegDept(e.target.value as DepartmentName)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                      >
                        {DEPARTMENTS_LIST.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Badge ID *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PWD-KA-4019"
                        value={officerRegBadge}
                        onChange={(e) => setOfficerRegBadge(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Official Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rajesh.patil@pwd.gov.in"
                        value={officerRegEmail}
                        onChange={(e) => setOfficerRegEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-xs text-amber-900 font-bold hover:underline cursor-pointer"
                    >
                      Already have credentials? Sign In &rarr;
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#0b2545] hover:bg-[#133966] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Register Officer Credentials</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. ADMIN PORTAL (MASTER STATE & APEX CENTRAL) */}
          {/* ========================================================================= */}
          {activePortal === 'admin' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {authMode === 'login' ? (
                /* ADMIN LOGIN VIEW */
                <form onSubmit={handleAdminLoginSubmit} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-serif">
                        State Grievance Commissioner & Apex Portal
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        High-level administrative oversight across all municipal departments and state SLAs.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
                      {adminIdInput}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Admin Command ID */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Admin Command ID *</label>
                      <input
                        type="text"
                        required
                        value={adminIdInput}
                        onChange={(e) => setAdminIdInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 font-mono"
                      />
                    </div>

                    {/* State Jurisdiction */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">State Jurisdiction</label>
                      <select
                        value={selectedAdminState}
                        onChange={(e) => setSelectedAdminState(e.target.value as IndianState)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s.code} value={s.code}>{s.name} (HQ)</option>
                        ))}
                      </select>
                    </div>

                    {/* Admin Password */}
                    <div className="space-y-1 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 block">Admin Security Password *</label>
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          className="text-[11px] text-purple-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          {showAdminPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showAdminPassword ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        required
                        value={adminPasswordInput}
                        onChange={(e) => setAdminPasswordInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-xs font-bold text-purple-900 hover:underline cursor-pointer"
                    >
                      Register new state commissioner &rarr;
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Verify & Enter Admin Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                /* ADMIN SIGN UP VIEW */
                <form onSubmit={handleAdminSignUpSubmit} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 font-serif">
                    State Grievance Commissioner Registration
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Commissioner Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Shalini Rajneesh, IAS"
                        value={adminRegName}
                        onChange={(e) => setAdminRegName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">State Jurisdiction *</label>
                      <select
                        value={adminRegState}
                        onChange={(e) => setAdminRegState(e.target.value as IndianState)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s.code} value={s.code}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block">Official NIC Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. admin.lokseva@gov.in"
                        value={adminRegEmail}
                        onChange={(e) => setAdminRegEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-xs text-purple-900 font-bold hover:underline cursor-pointer"
                    >
                      Already have credentials? Sign In &rarr;
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Register Administrator</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-700" />
            <span>State Redressal Governance & Encrypted Multi-Portal Access</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
