import React, { useState } from 'react';
import { 
  Complaint, 
  UserProfile, 
  LanguageCode, 
  IndianState, 
  DepartmentName 
} from '../types';
import { INDIAN_STATES } from '../data/seedData';
import { 
  DEPARTMENT_OFFICER_CREDENTIALS, 
  MASTER_ADMIN_CREDENTIAL, 
  NATIONAL_APEX_ADMIN_CREDENTIAL 
} from '../data/credentialsData';
import { sendOTPService, verifyOTPService } from '../utils/supabaseClient';
import { 
  findRegisteredCitizen,
  checkEmailExists,
  saveRegisteredCitizen, 
  citizenToUserProfile,
  sendCitizenRegistrationOTP,
  verifyCitizenRegistrationOTP
} from '../utils/citizenAuth';
import { 
  Landmark, 
  Users, 
  Building2, 
  ShieldCheck, 
  Mail, 
  Lock, 
  KeyRound, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  MapPin, 
  Smartphone, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers, 
  Clock, 
  FileText, 
  Globe2, 
  ShieldAlert,
  ChevronRight,
  Play,
  UserCheck,
  UserPlus,
  Info,
  HelpCircle,
  ExternalLink,
  X
} from 'lucide-react';
import { t } from '../utils/localization';

interface HomePageProps {
  currentLanguage: LanguageCode;
  complaints: Complaint[];
  selectedState: IndianState;
  onLoginSuccess: (user: UserProfile) => void;
  initialPortal?: 'citizen' | 'officer' | 'admin';
}

export const HomePage: React.FC<HomePageProps> = ({
  currentLanguage,
  complaints,
  selectedState,
  onLoginSuccess,
  initialPortal = 'citizen'
}) => {
  const [activePortalTab, setActivePortalTab] = useState<'citizen' | 'officer' | 'admin'>(initialPortal);

  // ==========================================
  // CITIZEN AUTH STATE
  // ==========================================
  const [citizenAuthMode, setCitizenAuthMode] = useState<'login' | 'signup'>('login');
  const [citizenLoginMethod, setCitizenLoginMethod] = useState<'password' | 'otp'>('password');
  
  // Login / Registration Form Fields
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');
  const [citizenConfirmPassword, setCitizenConfirmPassword] = useState('');
  const [showCitizenPassword, setShowCitizenPassword] = useState(false);
  const [showCitizenConfirmPassword, setShowCitizenConfirmPassword] = useState(false);
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenState, setCitizenState] = useState<IndianState>(selectedState || 'Karnataka');
  const [citizenCity, setCitizenCity] = useState('Bengaluru');
  
  // Citizen Registration OTP Step: 'details' | 'otp_verify'
  const [citizenRegStep, setCitizenRegStep] = useState<'details' | 'otp_verify'>('details');
  const [registrationOtpCode, setRegistrationOtpCode] = useState('');

  // Citizen Login OTP State
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [activeSimulatedOtp, setActiveSimulatedOtp] = useState<string | null>(null);

  // ==========================================
  // OFFICER AUTH STATE
  // ==========================================
  const [selectedDeptIndex, setSelectedDeptIndex] = useState(0);
  const [officerBadgeId, setOfficerBadgeId] = useState('');
  const [officerEmail, setOfficerEmail] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [showOfficerPassword, setShowOfficerPassword] = useState(false);
  const [officerDepartment, setOfficerDepartment] = useState<DepartmentName>(DEPARTMENT_OFFICER_CREDENTIALS[0].department);
  const [officerState, setOfficerState] = useState<IndianState>(DEPARTMENT_OFFICER_CREDENTIALS[0].state);
  const [officerCity, setOfficerCity] = useState(DEPARTMENT_OFFICER_CREDENTIALS[0].city);

  // ==========================================
  // ADMIN AUTH STATE
  // ==========================================
  const [adminType, setAdminType] = useState<'state' | 'apex'>('state');
  const [adminId, setAdminId] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminState, setAdminState] = useState<IndianState>(MASTER_ADMIN_CREDENTIAL.assignedState);

  // Status & Error Banners
  const [authError, setAuthError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer for OTP
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  // Reset errors and registration steps when switching mode
  const handleSwitchCitizenMode = (mode: 'login' | 'signup') => {
    setCitizenAuthMode(mode);
    setCitizenRegStep('details');
    setAuthError(null);
    setSuccessBanner(null);
    setRegistrationOtpCode('');
    setOtpSent(false);
    if (mode === 'signup') {
      setCitizenPassword('');
      setCitizenConfirmPassword('');
    } else {
      if (!citizenPassword) {
        setCitizenPassword('');
      }
    }
  };

  // Select a department without exposing or filling its credentials.
  const handleSelectOfficerPreset = (index: number) => {
    const cred = DEPARTMENT_OFFICER_CREDENTIALS[index];
    setSelectedDeptIndex(index);
    setOfficerBadgeId('');
    setOfficerEmail('');
    setOfficerPassword('');
    setOfficerDepartment(cred.department);
    setOfficerState(cred.state);
    setOfficerCity(cred.city);
    setAuthError(null);
  };

  // Select an administrator role without exposing or filling credentials.
  const handleSelectAdminPreset = (type: 'state' | 'apex') => {
    setAdminType(type);
    setAdminId('');
    setAdminEmail('');
    setAdminPassword('');
    if (type === 'state') {
      setAdminState(MASTER_ADMIN_CREDENTIAL.assignedState);
    } else {
      setAdminState(NATIONAL_APEX_ADMIN_CREDENTIAL.assignedState);
    }
    setAuthError(null);
  };

  // Request Email OTP for Login
  const handleRequestCitizenLoginOTP = async (targetEmail: string) => {
    const cleaned = targetEmail.trim().toLowerCase();
    if (!cleaned || !cleaned.includes('@')) {
      setAuthError('Please provide a valid email address.');
      return;
    }
    setOtpLoading(true);
    setAuthError(null);
    try {
      const res = await sendOTPService(cleaned, 'citizen');
      if (res.success) {
        setOtpSent(true);
        setOtpCountdown(60);
        if (res.simulatedOtp) {
          setActiveSimulatedOtp(res.simulatedOtp);
        }
        setSuccessBanner(`OTP code sent directly to ${cleaned}! Check your email inbox.`);
      } else {
        setAuthError(res.message || 'Failed to dispatch email verification OTP.');
      }
    } catch {
      setAuthError('Network error requesting email OTP. Please retry.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Request Email OTP for New Registration
  const handleRequestRegistrationOTP = async () => {
    setAuthError(null);
    setSuccessBanner(null);

    const name = citizenName.trim();
    const email = citizenEmail.trim().toLowerCase();
    const password = citizenPassword.trim();
    const confirmPassword = citizenConfirmPassword.trim();

    if (!name) {
      setAuthError('Please enter your full name for registration.');
      return;
    }
    if (!email || !email.includes('@')) {
      setAuthError('Please enter a valid email address (e.g., yourname@domain.com).');
      return;
    }
    if (!password || password.length < 6) {
      setAuthError('Please create a secure password with at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setAuthError('Password and Confirm Password do not match. Please re-check.');
      return;
    }

    if (await checkEmailExists(email)) {
      setAuthError('An account with this email already exists. Please log in instead.');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await sendCitizenRegistrationOTP(email, name);
      if (res.success) {
        setCitizenRegStep('otp_verify');
        setOtpCountdown(60);
        if (res.simulatedOtp) {
          setActiveSimulatedOtp(res.simulatedOtp);
        }
        setSuccessBanner(`A 6-digit OTP verification code has been dispatched to ${email}! Please enter it below to complete registration.`);
      } else {
        setAuthError(res.message || 'Failed to send OTP verification email. Please try again.');
      }
    } catch {
      setAuthError('Network error while requesting verification OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify Registration OTP & Complete Account Setup
  const handleVerifyRegistrationAndLogin = async () => {
    setAuthError(null);
    setSuccessBanner(null);

    const email = citizenEmail.trim().toLowerCase();
    const code = registrationOtpCode.trim();

    if (!code || code.length < 6) {
      setAuthError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const verifyRes = await verifyCitizenRegistrationOTP(email, code);
      if (!verifyRes.success) {
        setAuthError(verifyRes.message || 'Invalid or expired OTP code. Please enter the correct code from your email.');
        setIsSubmitting(false);
        return;
      }

      // Save verified citizen account with created password
      const newCitizen = {
        email: email,
        password: citizenPassword.trim(),
        name: citizenName.trim(),
        phone: citizenPhone.trim() || '+91 98450 11223',
        state: citizenState,
        city: citizenCity.trim() || 'Bengaluru',
        preferredLanguage: currentLanguage,
        isVerified: true,
        registeredAt: new Date().toISOString(),
      };

      const saveResult = saveRegisteredCitizen(newCitizen);
      if (!saveResult.success) {
        setAuthError(saveResult.error || 'An account with this email already exists. Please log in instead.');
        setIsSubmitting(false);
        return;
      }

      const userProfile = citizenToUserProfile(newCitizen);
      setSuccessBanner('Account verified & registered successfully! Logging you into the Citizen Portal...');
      setTimeout(() => {
        onLoginSuccess(userProfile);
      }, 400);
    } catch {
      setAuthError('Error verifying registration OTP. Please check your code and try again.');
      setIsSubmitting(false);
    }
  };

  // 1. Handle Citizen Submission
  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessBanner(null);

    const email = citizenEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    // REGISTRATION FLOW
    if (citizenAuthMode === 'signup') {
      if (citizenRegStep === 'details') {
        await handleRequestRegistrationOTP();
      } else {
        await handleVerifyRegistrationAndLogin();
      }
      return;
    }

    // LOGIN FLOW: Option A - Email & Created Password
    if (citizenLoginMethod === 'password') {
      if (!citizenPassword.trim()) {
        setAuthError('Please enter your account password.');
        return;
      }

      setIsSubmitting(true);
      try {
        // Check registered citizen in local storage & backend
        const registered = findRegisteredCitizen(email);

        if (!registered) {
          // Try server login verification
          const res = await fetch('/api/auth/citizen-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: citizenPassword.trim() }),
          });
          const data = await res.json();

          if (res.ok && data.success && data.user) {
            onLoginSuccess(data.user);
            return;
          }

          if (data.notFound) {
            setAuthError('No citizen account found for this email. Please switch to "Register New" to create a new account and verify via OTP.');
          } else {
            setAuthError(data.error || 'Incorrect password for this email account. Please check your password or register.');
          }
          setIsSubmitting(false);
          return;
        }

        // Verify stored password
        if (registered.password !== citizenPassword.trim()) {
          setAuthError('Incorrect password entered. Please enter the password you created during registration.');
          setIsSubmitting(false);
          return;
        }

        // Password matches! Log in
        const profile = citizenToUserProfile(registered);
        onLoginSuccess(profile);
      } catch (err) {
        console.error('Citizen login error:', err);
        setAuthError('Error validating credentials. Please try again.');
        setIsSubmitting(false);
      }
      return;
    }

    // LOGIN FLOW: Option B - Email 6-Digit OTP
    if (!otpSent) {
      await handleRequestCitizenLoginOTP(email);
      return;
    }

    if (!otpCode || otpCode.length < 6) {
      setAuthError('Please enter the 6-digit OTP received in your email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const verifyRes = await verifyOTPService(email, otpCode);
      if (!verifyRes.success) {
        setAuthError(verifyRes.message || 'Invalid or expired OTP code.');
        setIsSubmitting(false);
        return;
      }

      const registered = findRegisteredCitizen(email);
      const extractedName = email.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

      const user: UserProfile = registered 
        ? citizenToUserProfile(registered)
        : {
            id: 'usr-cit-' + Date.now(),
            name: formattedName || 'Citizen User',
            email: email,
            phone: citizenPhone.trim() || '+91 98450 11223',
            role: 'citizen',
            portalType: 'citizen',
            state: citizenState,
            city: citizenCity.trim() || 'Bengaluru',
            preferredLanguage: currentLanguage,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          };
      onLoginSuccess(user);
    } catch {
      setAuthError('Error verifying OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Handle Officer Submission
  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const enteredBadge = officerBadgeId.trim().toUpperCase();
    if (!enteredBadge) {
      setAuthError('Please enter your Official Badge / Employee ID.');
      return;
    }

    if (!officerPassword.trim()) {
      setAuthError('Please enter your departmental password.');
      return;
    }

    const matched = DEPARTMENT_OFFICER_CREDENTIALS.find(
      (c) => c.badgeId.toUpperCase() === enteredBadge
    ) || DEPARTMENT_OFFICER_CREDENTIALS[selectedDeptIndex];

    const officerProfile: UserProfile = {
      id: 'off-' + (matched?.badgeId || enteredBadge),
      name: matched?.officerName || 'Department Field Officer',
      badgeId: enteredBadge,
      email: officerEmail.trim() || matched?.officialEmail || `${enteredBadge.toLowerCase()}@gov.in`,
      phone: '+91 94480 ' + Math.floor(10000 + Math.random() * 90000),
      role: 'officer',
      portalType: 'officer',
      department: officerDepartment || matched?.department || 'Public Works Department',
      designation: matched?.designation || 'Assistant Executive Engineer',
      state: officerState || matched?.state || 'Karnataka',
      city: officerCity || matched?.city || 'Bengaluru',
      preferredLanguage: currentLanguage,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    };

    onLoginSuccess(officerProfile);
  };

  // 3. Handle Admin Submission
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const enteredId = adminId.trim().toUpperCase();
    if (!enteredId) {
      setAuthError('Please enter your Administrative Command ID.');
      return;
    }

    if (!adminPassword.trim()) {
      setAuthError('Please enter your Master Security Password.');
      return;
    }

    const isApex = adminType === 'apex' || enteredId.includes('APEX') || enteredId.includes('DARPG');
    const matched = isApex ? NATIONAL_APEX_ADMIN_CREDENTIAL : MASTER_ADMIN_CREDENTIAL;

    const adminProfile: UserProfile = {
      id: isApex ? 'adm-apex-01' : 'adm-state-01',
      name: matched.name,
      badgeId: enteredId,
      email: adminEmail.trim() || matched.email,
      phone: '+91 98110 00111',
      role: 'admin',
      portalType: 'admin',
      designation: matched.designation,
      assignedState: adminState || matched.assignedState,
      state: adminState || matched.assignedState,
      city: isApex ? 'New Delhi' : 'Bengaluru',
      preferredLanguage: currentLanguage,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    };

    onLoginSuccess(adminProfile);
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      
      {/* Top Banner Navigation */}
      <header className="w-full bg-[#071324]/95 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-blue-600 to-emerald-600 p-[2px] shadow-md">
              <div className="w-full h-full bg-[#0b2545] rounded-[10px] flex items-center justify-center">
                <Landmark className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-serif">
                  LOKSEVA
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Gov Gateway
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                National Public Grievance Redressal & Governance Portal
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Landing & Isolated Login Matrix */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 flex flex-col justify-center">
        
        {/* Top Header Badge */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-mono font-bold text-blue-300 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dedicated Single-Sign-On Authentication Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Your Dedicated Portal to Enter
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Choose your authorized jurisdiction below. Each portal is completely isolated with dedicated role-based security, telemetry, and administrative controls.
          </p>
        </div>

        {/* 3 Dedicated Portal Selector Tabs */}
        <div className="max-w-4xl mx-auto w-full mb-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 backdrop-blur-md">
            
            {/* Portal 1: Citizen */}
            <button
              type="button"
              onClick={() => {
                setActivePortalTab('citizen');
                setAuthError(null);
                setSuccessBanner(null);
              }}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activePortalTab === 'citizen'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50 border border-blue-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
              <div className="text-center sm:text-left">
                <span className="block leading-tight">🇮🇳 Citizen Portal</span>
                <span className="text-[10px] opacity-75 font-normal hidden sm:block">नागरिक शिकायत</span>
              </div>
            </button>

            {/* Portal 2: Officer */}
            <button
              type="button"
              onClick={() => {
                setActivePortalTab('officer');
                setAuthError(null);
                setSuccessBanner(null);
              }}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activePortalTab === 'officer'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-900/50 border border-amber-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              <div className="text-center sm:text-left">
                <span className="block leading-tight">🏢 Officer Console</span>
                <span className="text-[10px] opacity-75 font-normal hidden sm:block">10 Departments</span>
              </div>
            </button>

            {/* Portal 3: Admin */}
            <button
              type="button"
              onClick={() => {
                setActivePortalTab('admin');
                setAuthError(null);
                setSuccessBanner(null);
              }}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activePortalTab === 'admin'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/50 border border-emerald-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
              <div className="text-center sm:text-left">
                <span className="block leading-tight">🏛️ State Admin</span>
                <span className="text-[10px] opacity-75 font-normal hidden sm:block">Apex Command</span>
              </div>
            </button>

          </div>
        </div>

        {/* Auth Error & Success Alerts */}
        {authError && (
          <div className="max-w-4xl mx-auto w-full mb-4 p-3.5 bg-red-950/80 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-medium">{authError}</span>
          </div>
        )}

        {successBanner && (
          <div className="max-w-4xl mx-auto w-full mb-4 p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{successBanner}</span>
          </div>
        )}

        {/* Portal 1: CITIZEN AUTHENTICATION INTERFACE */}
        {activePortalTab === 'citizen' && (
          <div className="max-w-4xl mx-auto w-full bg-[#0b1d3a]/90 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Citizen Redressal Gate</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Instant Email OTP Ready</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {citizenAuthMode === 'signup' ? 'New Citizen Registration & Verification' : 'Citizen Portal Sign In'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {citizenAuthMode === 'signup' 
                    ? 'Register your citizen profile, create your password, and verify via email OTP.' 
                    : 'Log in with your registered email & password to access voice grievances and live tracking.'}
                </p>
              </div>

              {/* Login vs Sign Up Toggle */}
              <div className="flex items-center p-1 bg-slate-900 rounded-xl text-xs font-bold border border-slate-800 self-start">
                <button
                  type="button"
                  onClick={() => handleSwitchCitizenMode('login')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    citizenAuthMode === 'login'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchCitizenMode('signup')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    citizenAuthMode === 'signup'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register New</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCitizenSubmit} className="mt-6 space-y-5">
              
              {/* ========================================================================= */}
              {/* SIGN UP / REGISTRATION VIEW */}
              {/* ========================================================================= */}
              {citizenAuthMode === 'signup' && (
                <>
                  {/* Step Progress Header */}
                  <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        citizenRegStep === 'details' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                      }`}>
                        {citizenRegStep === 'otp_verify' ? '✓' : '1'}
                      </span>
                      <span className={citizenRegStep === 'details' ? 'font-bold text-blue-200' : 'text-slate-400'}>
                        1. Account Details & Password
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        citizenRegStep === 'otp_verify' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        2
                      </span>
                      <span className={citizenRegStep === 'otp_verify' ? 'font-bold text-blue-200' : 'text-slate-400'}>
                        2. Email OTP Verification
                      </span>
                    </div>
                    {citizenRegStep === 'otp_verify' && (
                      <button
                        type="button"
                        onClick={() => {
                          setCitizenRegStep('details');
                          setAuthError(null);
                        }}
                        className="text-[11px] text-blue-400 hover:underline font-bold cursor-pointer"
                      >
                        ← Edit Details
                      </button>
                    )}
                  </div>

                  {/* STEP 1: Details & Create Password */}
                  {citizenRegStep === 'details' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-300">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your full name"
                          value={citizenName}
                          onChange={(e) => setCitizenName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-300">
                            Email Address (OTP will be sent here) *
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setCitizenEmail('');
                              setCitizenName('');
                            }}
                            className="text-[11px] text-blue-400 hover:underline font-bold cursor-pointer hidden"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            placeholder="Enter your email address"
                            value={citizenEmail}
                            onChange={(e) => setCitizenEmail(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* Create Password */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-300">
                            Create Password *
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowCitizenPassword(!showCitizenPassword)}
                            className="text-[11px] text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {showCitizenPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-blue-400" />}
                            <span>{showCitizenPassword ? 'Hide' : 'Show'}</span>
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showCitizenPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            placeholder="Create a strong password"
                            value={citizenPassword}
                            onChange={(e) => setCitizenPassword(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-300">
                            Confirm Password *
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowCitizenConfirmPassword(!showCitizenConfirmPassword)}
                            className="text-[11px] text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {showCitizenConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-blue-400" />}
                            <span>{showCitizenConfirmPassword ? 'Hide' : 'Show'}</span>
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showCitizenConfirmPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            placeholder="Re-enter password"
                            value={citizenConfirmPassword}
                            onChange={(e) => setCitizenConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                      </div>

                      {/* State Jurisdiction Selector */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">
                          State Jurisdiction *
                        </label>
                        <select
                          value={citizenState}
                          onChange={(e) => setCitizenState(e.target.value as IndianState)}
                          className="w-full px-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s.code} value={s.code} className="bg-slate-900">
                              {s.name} ({s.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* City / District */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">
                          City / District *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Bengaluru"
                          value={citizenCity}
                          onChange={(e) => setCitizenCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Optional Phone Number */}
                      <div className="space-y-1 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-300">
                            Mobile Number (Optional)
                          </label>
                          <span className="text-[10px] text-slate-400">For SMS status updates</span>
                        </div>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            placeholder="e.g. +91 98450 11223"
                            value={citizenPhone}
                            onChange={(e) => setCitizenPhone(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Email OTP Verification Card */}
                  {citizenRegStep === 'otp_verify' && (
                    <div className="p-5 bg-slate-900/95 rounded-2xl border border-blue-500/40 space-y-4 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                          <KeyRound className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Enter 6-Digit Email Verification Code</h4>
                          <p className="text-xs text-slate-300">
                            A verification code was dispatched to <strong className="text-blue-300 font-mono">{citizenEmail}</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-300">
                            Verification OTP *
                          </label>
                          <button
                            type="button"
                            disabled={otpLoading || otpCountdown > 0}
                            onClick={handleRequestRegistrationOTP}
                            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {otpLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                            <span>{otpCountdown > 0 ? `Resend Code in ${otpCountdown}s` : 'Resend Email OTP'}</span>
                          </button>
                        </div>

                        <input
                          type="text"
                          maxLength={6}
                          placeholder="••••••"
                          value={registrationOtpCode}
                          onChange={(e) => setRegistrationOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full px-4 py-3 bg-slate-950 border border-blue-500/50 rounded-xl text-lg font-mono font-bold text-white text-center tracking-[0.5em] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                        <div className="font-bold text-slate-300">Registration Security Policy:</div>
                        <div>✓ Your account is activated only after successful OTP email verification.</div>
                        <div>✓ Your created password will be used for future sign-ins.</div>
                      </div>
                    </div>
                  )}

                  {/* Action Button for Registration */}
                  <button
                    type="submit"
                    disabled={isSubmitting || otpLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting || otpLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : citizenRegStep === 'details' ? (
                      <>
                        <span>Send Email OTP & Verify Registration</span>
                        <Send className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Verify OTP & Complete Registration</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </>
              )}

              {/* ========================================================================= */}
              {/* SIGN IN / LOGIN BACK IN VIEW */}
              {/* ========================================================================= */}
              {citizenAuthMode === 'login' && (
                <>
                  {/* Login Method Toggle */}
                  <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-400 font-medium">Choose Login Method:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCitizenLoginMethod('password');
                          setOtpSent(false);
                          setAuthError(null);
                        }}
                        className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          citizenLoginMethod === 'password'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Email & Password
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCitizenLoginMethod('otp');
                          setAuthError(null);
                        }}
                        className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          citizenLoginMethod === 'otp'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Email 6-Digit OTP
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Email Address */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300">
                          Registered Email Address *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setCitizenEmail('');
                            setCitizenPassword('');
                          }}
                          className="text-[11px] text-blue-400 hover:underline font-bold cursor-pointer hidden"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="Enter your email address"
                          value={citizenEmail}
                          onChange={(e) => setCitizenEmail(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Method 1: Password Input */}
                    {citizenLoginMethod === 'password' && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-300">
                            Password (Created during registration) *
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowCitizenPassword(!showCitizenPassword)}
                            className="text-[11px] text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {showCitizenPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-blue-400" />}
                            <span>{showCitizenPassword ? 'Hide' : 'Show'}</span>
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showCitizenPassword ? 'text' : 'password'}
                            required
                            placeholder="Enter your account password"
                            value={citizenPassword}
                            onChange={(e) => setCitizenPassword(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* Method 2: OTP Box */}
                    {citizenLoginMethod === 'otp' && (
                      <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                            <KeyRound className="w-4 h-4 text-amber-400" />
                            <span>6-Digit Email Verification Code</span>
                          </label>
                          <button
                            type="button"
                            disabled={otpLoading || otpCountdown > 0}
                            onClick={() => handleRequestCitizenLoginOTP(citizenEmail)}
                            className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-xs font-bold border border-blue-400/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {otpLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                            <span>{otpCountdown > 0 ? `Resend in ${otpCountdown}s` : otpSent ? 'Resend OTP' : 'Send OTP to Email'}</span>
                          </button>
                        </div>

                        <input
                          type="text"
                          maxLength={6}
                          placeholder={otpSent ? "Enter 6-digit OTP from email" : "Click 'Send OTP to Email' to receive code"}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono font-bold text-white text-center tracking-widest focus:outline-none focus:border-blue-500"
                        />

                      </div>
                    )}
                  </div>

                  {/* Submit Button for Login */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>
                          {citizenLoginMethod === 'password'
                            ? 'Sign In with Password'
                            : otpSent ? 'Verify OTP & Enter Portal' : 'Send OTP to Email & Enter'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <p className="text-xs text-slate-400">
                      Don't have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => handleSwitchCitizenMode('signup')}
                        className="text-blue-400 hover:underline font-bold cursor-pointer"
                      >
                        Register New Citizen Account
                      </button>
                    </p>
                  </div>
                </>
              )}

            </form>
          </div>
        )}

        {/* Portal 2: OFFICER AUTHENTICATION INTERFACE */}
        {activePortalTab === 'officer' && (
          <div className="max-w-4xl mx-auto w-full bg-[#0b1d3a]/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            
            {/* Header */}
            <div className="pb-6 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                    Departmental Municipal Staff Gate
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    10 Municipal Departments Officer Console
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full self-start">
                  Official Gov Access
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Authorized officers manage department queues, AI resolution copilot, and field investigations.
              </p>
            </div>

            {/* Quick Department Presets Selector */}
            <div className="mt-6">
              <label className="text-xs font-bold text-slate-300 block mb-2">
                Select Department:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-900 rounded-xl border border-slate-800">
                {DEPARTMENT_OFFICER_CREDENTIALS.map((cred, idx) => (
                  <button
                    key={cred.badgeId}
                    type="button"
                    onClick={() => handleSelectOfficerPreset(idx)}
                    className={`p-2 rounded-lg text-left text-xs transition-all cursor-pointer border ${
                      selectedDeptIndex === idx
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-xs'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-[11px] truncate">{cred.departmentCode}</div>
                    <div className="text-[10px] text-slate-400 truncate">{cred.department}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Officer Login Form */}
            <form onSubmit={handleOfficerSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Department Selection */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">
                    Municipal Department *
                  </label>
                  <select
                    value={officerDepartment}
                    onChange={(e) => setOfficerDepartment(e.target.value as DepartmentName)}
                    className="w-full px-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {DEPARTMENT_OFFICER_CREDENTIALS.map((c) => (
                      <option key={c.department} value={c.department} className="bg-slate-900">
                        {c.department} ({c.departmentCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Badge ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Officer Badge / Employee ID *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your employee ID"
                      value={officerBadgeId}
                      onChange={(e) => setOfficerBadgeId(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Official Gov Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Official Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your official email"
                      value={officerEmail}
                      onChange={(e) => setOfficerEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Department Password */}
                <div className="space-y-1 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Department Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowOfficerPassword(!showOfficerPassword)}
                      className="text-[11px] text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {showOfficerPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-amber-400" />}
                      <span>{showOfficerPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showOfficerPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your department password"
                      value={officerPassword}
                      onChange={(e) => setOfficerPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Jurisdiction State */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Jurisdiction State
                  </label>
                  <select
                    value={officerState}
                    onChange={(e) => setOfficerState(e.target.value as IndianState)}
                    className="w-full px-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.code} value={s.code} className="bg-slate-900">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Posting City / Ward
                  </label>
                  <input
                    type="text"
                    value={officerCity}
                    onChange={(e) => setOfficerCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Sign In to Officer Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

        {/* Portal 3: ADMIN AUTHENTICATION INTERFACE */}
        {activePortalTab === 'admin' && (
          <div className="max-w-4xl mx-auto w-full bg-[#0b1d3a]/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            
            {/* Header */}
            <div className="pb-6 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-emerald-400 tracking-wider">
                    Apex Governance & State Directorate Gate
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    State & National Administration Portal
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full self-start">
                  Level 4 Apex Command
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Cross-department performance analytics, SLA escalation control, and multi-state governance.
              </p>
            </div>

            {/* Quick Admin Role Selector */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSelectAdminPreset('state')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  adminType === 'state'
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">State Grievance Commissioner</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  State-level multi-department oversight
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAdminPreset('apex')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  adminType === 'apex'
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Central Apex Directorate</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pan-India governance oversight
                </p>
              </button>
            </div>

            {/* Admin Form */}
            <form onSubmit={handleAdminSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Admin Command ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Administrator Command ID *
                  </label>
                  <div className="relative">
                    <Landmark className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your command ID"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Admin Official Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Official Apex Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your official email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Master Security Password */}
                <div className="space-y-1 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Master Security Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="text-[11px] text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-emerald-400" />}
                      <span>{showAdminPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your master password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* State Jurisdiction */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">
                    Assigned State Jurisdiction
                  </label>
                  <select
                    value={adminState}
                    onChange={(e) => setAdminState(e.target.value as IndianState)}
                    className="w-full px-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.code} value={s.code} className="bg-slate-900">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Sign In to Admin Command Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

      </main>

      {/* Footer Metrics */}
      <footer className="w-full bg-[#071324] border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
        <p>LokSeva Unified Grievance Matrix • Secured by Digital India & DARPG Architecture • 2026</p>
      </footer>

    </div>
  );
};
