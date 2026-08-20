import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Sparkles, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  Volume2, 
  Camera, 
  Image as ImageIcon, 
  Users, 
  ChevronRight, 
  Info,
  Building,
  ShieldCheck
} from 'lucide-react';
import { 
  LanguageCode, 
  ComplaintCategory, 
  ComplaintPriority, 
  AIAnalysisResult, 
  Complaint, 
  UserProfile, 
  SimilarGrievance,
  IndianState
} from '../types';
import { SUPPORTED_LANGUAGES, SAMPLE_VOICE_PRESETS, SampleVoicePreset } from '../data/translations';
import { classifyGrievanceAPI, checkDuplicateGrievanceAPI, createComplaintAPI } from '../utils/aiService';
import { t, locNum, localizeDigitsInString, locCategory, locDepartment, locPriority, locStatus } from '../utils/localization';

interface GrievanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  currentLanguage: LanguageCode;
  onGrievanceCreated: (complaint: Complaint) => void;
  onFollowExistingComplaint: (complaintId: string) => void;
}

const CONTROLLED_CATEGORIES: ComplaintCategory[] = [
  'Roads & Infrastructure',
  'Water Supply',
  'Electricity',
  'Waste Management',
  'Sanitation',
  'Street Lighting',
  'Public Transport',
  'Public Health',
  'Drainage',
  'Environment',
  'Other',
];

const PRESET_LOCATIONS = [
  { address: 'Near BMSIT College Gate, Yelahanka Main Road, Bengaluru', ward: 'Ward 04 - Yelahanka', lat: 13.0991, lng: 77.5963 },
  { address: '14th Main, Sector 4, HSR Layout, Bengaluru', ward: 'Ward 174 - HSR Layout', lat: 12.9121, lng: 77.6446 },
  { address: '100ft Road, Near Corporation School, Indiranagar, Bengaluru', ward: 'Ward 80 - Dayananda Nagar', lat: 12.9784, lng: 77.6408 },
  { address: '7th Cross Road, Koramangala 4th Block, Bengaluru', ward: 'Ward 151 - Koramangala', lat: 12.9352, lng: 77.6245 },
  { address: '8th Cross Road, Malleshwaram, Bengaluru', ward: 'Ward 65 - Kadu Malleshwara', lat: 13.0031, lng: 77.5703 },
];

export const GrievanceFormModal: React.FC<GrievanceFormModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentLanguage,
  onGrievanceCreated,
  onFollowExistingComplaint,
}) => {
  // Form State
  const [description, setDescription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(currentLanguage);
  const [selectedLocation, setSelectedLocation] = useState(PRESET_LOCATIONS[0]);
  const [customAddress, setCustomAddress] = useState('');
  const [customWard, setCustomWard] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceError, setVoiceError] = useState('');
  const [audioDataUrl, setAudioDataUrl] = useState('');
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const lastTranscriptIndexRef = useRef<number>(0);

  // AI Pipeline State
  const [step, setStep] = useState<'input' | 'analyzing' | 'duplicate_check' | 'ai_confirmation' | 'submitting' | 'success'>('input');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [similarMatches, setSimilarMatches] = useState<SimilarGrievance[]>([]);
  const [createdComplaint, setCreatedComplaint] = useState<Complaint | null>(null);

  // Editable overrides if citizen chooses to modify AI's decision
  const [isEditingAiResult, setIsEditingAiResult] = useState(false);
  const [editedCategory, setEditedCategory] = useState<ComplaintCategory>('Roads & Infrastructure');
  const [editedPriority, setEditedPriority] = useState<ComplaintPriority>('HIGH');
  const [editedSummary, setEditedSummary] = useState('');

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImageUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Voice Speech-to-Text Setup
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const startVoiceRecording = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceError('');
    setAudioDataUrl('');

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setVoiceError(t('voiceUnsupported', currentLanguage));
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      if (typeof MediaRecorder !== 'undefined') {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => setAudioDataUrl(String(reader.result || ''));
          reader.readAsDataURL(blob);
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
      }

      setIsRecording(true);

      if (!SpeechRecognition && !mediaRecorderRef.current) {
        setIsRecording(false);
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        setVoiceError(t('voiceAudioFallback', currentLanguage));
        return;
      }

      lastTranscriptIndexRef.current = 0;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage);
      recognition.lang = langObj ? langObj.speechCode : 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let newTranscript = '';
        for (let i = lastTranscriptIndexRef.current; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            newTranscript += event.results[i][0].transcript;
          }
        }
        if (event.results.length > 0) {
          lastTranscriptIndexRef.current = event.results.length;
        }
        if (newTranscript.trim()) {
          setDescription((prev) => {
            const trimmed = prev ? prev.trimEnd() : '';
            return trimmed ? trimmed + ' ' + newTranscript.trim() : newTranscript.trim();
          });
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        const errorKey = err?.error === 'not-allowed' || err?.error === 'service-not-allowed'
          ? 'voiceAudioFallback'
          : err?.error === 'no-speech'
          ? 'voiceAudioFallback'
          : 'voiceAudioFallback';
        setVoiceError(t(errorKey, currentLanguage));
        if (!mediaRecorderRef.current) setIsRecording(false);
      };

      recognition.onend = () => {
        recognitionRef.current = null;
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsRecording(false);
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      setVoiceError(t('voicePermissionDenied', currentLanguage));
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    setIsRecording(false);
    setVoiceError('');
  };

  const handleApplyPreset = (preset: SampleVoicePreset) => {
    setSelectedLanguage(preset.language);
    setDescription(preset.transcription);
    setUploadedImageUrl(preset.imageHintUrl);
    
    // Find matching preset location
    const matchedLoc = PRESET_LOCATIONS.find((l) => l.address.includes(preset.locationHint.split(',')[0])) || PRESET_LOCATIONS[0];
    setSelectedLocation(matchedLoc);
    setCustomAddress(matchedLoc.address);
    setCustomWard(matchedLoc.ward);
  };

  // Step 2 & 3: Run AI Classification and Duplicate Checking
  const handleStartAnalysis = async () => {
    if (!description.trim() && !audioDataUrl) {
      alert(t('speakOrType', currentLanguage));
      return;
    }

    setStep('analyzing');
    const address = customAddress.trim() || selectedLocation.address;

    try {
      // 1. Run AI Classification
      const analysis = await classifyGrievanceAPI({
        text: description,
        languageHint: selectedLanguage,
        locationAddress: address,
        imageBase64: uploadedImageUrl || undefined,
        audioDataUrl: audioDataUrl || undefined,
      });

      const transcribedText = analysis.transcription?.trim();
      if (!description.trim() && transcribedText) {
        setDescription(transcribedText);
      }
      const complaintText = description.trim() || transcribedText || '';

      setAiAnalysis(analysis);
      setEditedCategory(analysis.category);
      setEditedPriority(analysis.priority);
      setEditedSummary(analysis.summary);

      // 2. Check for duplicate/similar existing complaints
      const dupCheck = await checkDuplicateGrievanceAPI({
        text: complaintText,
        category: analysis.category,
        location: { address, ward: customWard.trim() || selectedLocation.ward },
      });

      if (dupCheck.hasDuplicate && dupCheck.matches.length > 0) {
        setSimilarMatches(dupCheck.matches);
        setStep('duplicate_check');
      } else {
        setStep('ai_confirmation');
      }
    } catch (err) {
      console.error('AI pipeline error:', err);
      setStep('ai_confirmation');
    }
  };

  // Step 4: Final Confirm & Submit Grievance
  const handleFinalSubmit = async () => {
    if (!aiAnalysis) return;
    setStep('submitting');

    const address = customAddress.trim() || selectedLocation.address;
    const finalCategory = isEditingAiResult ? editedCategory : aiAnalysis.category;
    const finalPriority = isEditingAiResult ? editedPriority : aiAnalysis.priority;
    const finalSummary = isEditingAiResult ? editedSummary : aiAnalysis.summary;
    
    const slaHours = finalPriority === 'HIGH' ? 48 : finalPriority === 'MEDIUM' ? 120 : 240;
    const deadline = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

    const newComplaintPayload: Complaint = {
      id: 'grv-' + Date.now(),
      complaintNumber: '', // will be assigned by server
      userId: currentUser?.id || 'usr-anon',
      userName: currentUser?.name || 'Citizen',
      userPhone: currentUser?.phone || '+91 98450 00000',
      userEmail: currentUser?.email || 'citizen@example.com',
      description: description || aiAnalysis.transcription || 'Voice grievance submitted by citizen.',
      originalLanguage: selectedLanguage,
      category: finalCategory,
      department: aiAnalysis.department,
      priority: finalPriority,
      status: 'Submitted',
      state: (currentUser?.state as IndianState) || 'Karnataka',
      location: {
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        address,
        ward: customWard.trim() || selectedLocation.ward,
        state: (currentUser?.state as IndianState) || 'Karnataka',
      },
      aiSummary: finalSummary,
      aiConfidence: aiAnalysis.confidence,
      slaHours,
      slaDeadline: deadline,
      isSlaBreached: false,
      assignedOfficerName: 'Assigned to Ward Junior Engineer',
      attachments: [
        ...(uploadedImageUrl ? [{
          id: 'att-image-' + Date.now(),
          complaintId: '',
          fileUrl: uploadedImageUrl,
          fileType: 'image' as const,
          description: 'Citizen evidence photograph',
        }] : []),
        ...(audioDataUrl ? [{
          id: 'att-audio-' + Date.now(),
          complaintId: '',
          fileUrl: audioDataUrl,
          fileType: 'audio' as const,
          description: 'Citizen voice grievance recording',
        }] : []),
      ],
      updates: [
        {
          id: 'upd-' + Date.now(),
          complaintId: '',
          status: 'Submitted',
          message: `Grievance registered via LokSeva AI in ${selectedLanguage.toUpperCase()}. AI mapped to ${finalCategory} with ${finalPriority} priority (${slaHours}h SLA).`,
          createdBy: 'LokSeva AI Engine',
          createdAt: new Date().toISOString(),
          role: 'system',
        },
      ],
      supportersCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const created = await createComplaintAPI(newComplaintPayload);
      setCreatedComplaint(created);
      onGrievanceCreated(created);
      setStep('success');
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to register complaint. Please try again.');
      setStep('ai_confirmation');
    }
  };

  const handleResetModal = () => {
    setDescription('');
    setAudioDataUrl('');
    setUploadedImageUrl(null);
    setAiAnalysis(null);
    setSimilarMatches([]);
    setCreatedComplaint(null);
    setIsEditingAiResult(false);
    setStep('input');
    onClose();
  };

  // Text to Speech Readout helper
  const handleSpeakSummary = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center border border-blue-200 font-bold">
              <Sparkles className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0b2545] font-serif">
                {step === 'success'
                  ? t('grievanceRegistered', currentLanguage)
                  : step === 'ai_confirmation'
                  ? `${t('step', currentLanguage)} ${locNum(4, currentLanguage)}: ${t('aiConfirmation', currentLanguage)}`
                  : step === 'duplicate_check'
                  ? t('similarIssueFound', currentLanguage)
                  : t('submitGrievance', currentLanguage)}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {step === 'ai_confirmation'
                  ? t('aiClassified', currentLanguage)
                  : t('speakOrType', currentLanguage)}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white">
          
          {/* STEP 1: INPUT SCREEN */}
          {step === 'input' && (
            <div className="space-y-5">
              
              {/* Quick Language Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-blue-700" />
                  {t('selectLanguage', currentLanguage)}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        selectedLanguage === lang.code
                          ? 'bg-[#0b2545] text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lang.nativeName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description Input & Voice Recording Trigger */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    {t('speakOrType', currentLanguage)}:
                  </label>
                  {isRecording && (
                    <span className="flex items-center gap-1.5 text-xs text-rose-600 font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      {t('listening', currentLanguage)} ({locNum(recordingSeconds, currentLanguage)}s)...
                    </span>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    id="grievance-text-input"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g., ನಮ್ಮ ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಹೊಂಡ ಬಿದ್ದಿದೆ / Main road street light is broken / नल में गंदा पानी आ रहा है..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-medium transition-all resize-none"
                  />

                  {/* Mic Float Button inside textarea */}
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <button
                      id="mic-record-btn"
                      type="button"
                      onClick={toggleVoiceRecording}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                        isRecording
                          ? 'bg-rose-600 hover:bg-rose-700 text-white animate-bounce'
                          : 'bg-[#0284c7] hover:bg-[#0369a1] text-white'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          <span>{t('stopRecording', currentLanguage)}</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" />
                          <span>{t('voiceInput', currentLanguage)}</span>
                        </>
                      )}
                    </button>
                  </div>
                  {voiceError && (
                    <p className="text-xs text-rose-700 font-medium" role="alert">{voiceError}</p>
                  )}
                </div>
              </div>

              {/* Photo Evidence & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Manual location and ward entry with presets as a convenience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {t('location', currentLanguage)} & {t('ward', currentLanguage)}
                  </label>
                  <select
                    value={selectedLocation.address}
                    onChange={(e) => {
                      const found = PRESET_LOCATIONS.find((l) => l.address === e.target.value);
                      if (found) {
                        setSelectedLocation(found);
                        setCustomAddress(found.address);
                        setCustomWard(found.ward);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  >
                    {PRESET_LOCATIONS.map((loc, idx) => (
                      <option key={idx} value={loc.address}>
                        {localizeDigitsInString(loc.ward, currentLanguage)} - {localizeDigitsInString(loc.address.split(',')[0], currentLanguage)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder={t('manualLocation', currentLanguage)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  <input
                    type="text"
                    value={customWard}
                    onChange={(e) => setCustomWard(e.target.value)}
                    placeholder={t('manualWard', currentLanguage)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* Photo Evidence */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-blue-600" />
                      {t('evidencePhoto', currentLanguage)}:
                    </span>
                    {uploadedImageUrl && (
                      <button
                        type="button"
                        onClick={() => setUploadedImageUrl(null)}
                        className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        {t('removePhoto', currentLanguage)}
                      </button>
                    )}
                  </label>

                  {uploadedImageUrl ? (
                    <div className="relative h-16 rounded-xl overflow-hidden border border-slate-200 group">
                      <img
                        src={uploadedImageUrl}
                        alt="Evidence"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white font-bold">{t('photoAttached', currentLanguage)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t('attachPhoto', currentLanguage)}</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  id="start-ai-analysis-btn"
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={!description.trim() && !audioDataUrl}
                  className="w-full py-3 rounded-xl bg-[#0b2545] hover:bg-[#133966] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t('analyzeWithAI', currentLanguage)}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: ANALYZING SPINNER */}
          {step === 'analyzing' && (
            <div className="py-12 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping" />
                <div className="relative w-16 h-16 rounded-full border-4 border-blue-700 border-t-transparent animate-spin flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-700" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('aiProcessing', currentLanguage)}</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-medium">
                  {t('aiClassified', currentLanguage)}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: DUPLICATE COMPLAINT DETECTION */}
          {step === 'duplicate_check' && similarMatches.length > 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t('similarIssueFound', currentLanguage)}</span>
                </div>
                <p className="text-xs text-amber-800 font-medium">
                  {t('duplicateNotice', currentLanguage)}
                </p>
              </div>

              {/* Similar Grievance Cards */}
              <div className="space-y-2">
                {similarMatches.map((m) => (
                  <div
                    key={m.complaintId}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-900">
                          #{localizeDigitsInString(m.complaintNumber, currentLanguage)}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{locCategory(m.category, currentLanguage)}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                        {locStatus(m.status, currentLanguage)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium line-clamp-2">{localizeDigitsInString(m.description, currentLanguage)}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
                      <span className="text-slate-500 flex items-center gap-1 text-[11px] font-medium">
                        <Users className="w-3 h-3 text-blue-600" />
                        {locNum(m.supportersCount, currentLanguage)} {t('supportedBy', currentLanguage)}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          onFollowExistingComplaint(m.complaintId);
                          handleResetModal();
                        }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <span>{t('joinExistingIssue', currentLanguage)} (#{localizeDigitsInString(m.complaintNumber, currentLanguage)})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Option to bypass and proceed with new complaint */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep('ai_confirmation')}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                >
                  {t('proceedAnyway', currentLanguage)}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: AI CONFIRMATION SCREEN */}
          {step === 'ai_confirmation' && aiAnalysis && (
            <div className="space-y-4">
              
              {/* Notice Banner */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-900 font-medium">
                  <span className="font-bold">{t('aiConfidence', currentLanguage)}:</span> {t('aiClassified', currentLanguage)}
                </div>
              </div>

              {/* AI Classification Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
                
                {/* Header with confidence */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">{t('detectedLanguage', currentLanguage)}:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-xs">
                      {aiAnalysis.detectedLanguage}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-blue-900 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                    <span>{t('aiConfidence', currentLanguage)}: {locNum(Math.round(aiAnalysis.confidence * 100), currentLanguage)}%</span>
                  </div>
                </div>

                {/* Structured English Summary with TTS Readout */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span>{t('aiSummary', currentLanguage)}:</span>
                    <button
                      type="button"
                      onClick={() => handleSpeakSummary(isEditingAiResult ? editedSummary : aiAnalysis.summary)}
                      className="text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t('voicePlayback', currentLanguage)}</span>
                    </button>
                  </div>
                  {isEditingAiResult ? (
                    <textarea
                      rows={2}
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-900 font-medium focus:outline-none"
                    />
                  ) : (
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {localizeDigitsInString(aiAnalysis.summary, currentLanguage)}
                    </p>
                  )}
                </div>

                {/* Key Classification Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Category */}
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      {t('category', currentLanguage)}
                    </span>
                    {isEditingAiResult ? (
                      <select
                        value={editedCategory}
                        onChange={(e) => setEditedCategory(e.target.value as ComplaintCategory)}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs text-slate-800 font-semibold"
                      >
                        {CONTROLLED_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {locCategory(cat, currentLanguage)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {locCategory(aiAnalysis.category, currentLanguage)}
                      </span>
                    )}
                  </div>

                  {/* Department */}
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      {t('department', currentLanguage)}
                    </span>
                    <span className="text-xs font-bold text-blue-900 block truncate" title={aiAnalysis.department}>
                      {locDepartment(aiAnalysis.department, currentLanguage)}
                    </span>
                  </div>

                  {/* Priority & SLA */}
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      {t('priority', currentLanguage)} & SLA
                    </span>
                    {isEditingAiResult ? (
                      <select
                        value={editedPriority}
                        onChange={(e) => setEditedPriority(e.target.value as ComplaintPriority)}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs text-slate-800 font-semibold"
                      >
                        <option value="HIGH">{locPriority('HIGH', currentLanguage)} ({locNum(48, currentLanguage)} {t('hours', currentLanguage)})</option>
                        <option value="MEDIUM">{locPriority('MEDIUM', currentLanguage)} ({locNum(5, currentLanguage)} {t('days', currentLanguage)})</option>
                        <option value="LOW">{locPriority('LOW', currentLanguage)} ({locNum(10, currentLanguage)} {t('days', currentLanguage)})</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            aiAnalysis.priority === 'HIGH'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : aiAnalysis.priority === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {locPriority(aiAnalysis.priority, currentLanguage)}
                        </span>
                        <span className="text-[11px] text-slate-600 font-mono font-medium">
                          {locNum(aiAnalysis.slaHours, currentLanguage)} {t('hours', currentLanguage)} SLA
                        </span>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Action Buttons: Edit or Confirm & Submit */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingAiResult(!isEditingAiResult)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isEditingAiResult ? t('saveChanges', currentLanguage) : t('editCategory', currentLanguage)}</span>
                </button>

                <button
                  id="confirm-submit-grievance-btn"
                  type="button"
                  onClick={handleFinalSubmit}
                  className="w-full sm:flex-1 py-3 rounded-xl bg-[#0b2545] hover:bg-[#133966] text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('confirmAndSubmit', currentLanguage)}</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 5: SUBMITTING SPINNER */}
          {step === 'submitting' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-blue-700 border-t-transparent animate-spin mx-auto" />
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('aiProcessing', currentLanguage)}</h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  {t('aiClassified', currentLanguage)}
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: SUCCESS CONFIRMATION */}
          {step === 'success' && createdComplaint && (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center justify-center mx-auto animate-in zoom-in-75">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-widest font-bold text-emerald-800">
                  {t('grievanceRegistered', currentLanguage)}
                </span>
                <h3 className="text-2xl font-extrabold text-[#0b2545] font-serif">
                  {t('complaintId', currentLanguage)}: <span className="font-mono text-blue-900">{localizeDigitsInString(createdComplaint.complaintNumber, currentLanguage)}</span>
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
                  {locDepartment(createdComplaint.department, currentLanguage)} - SLA: <span className="font-bold text-slate-900">{locNum(createdComplaint.slaHours, currentLanguage)} {t('hours', currentLanguage)}</span>.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{t('category', currentLanguage)}:</span>
                  <span className="font-bold text-slate-900">{locCategory(createdComplaint.category, currentLanguage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{t('location', currentLanguage)}:</span>
                  <span className="font-bold text-slate-900">{localizeDigitsInString(createdComplaint.location.address, currentLanguage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{t('priority', currentLanguage)}:</span>
                  <span className="font-bold text-rose-700">{locPriority(createdComplaint.priority, currentLanguage)} ({locNum(createdComplaint.slaHours, currentLanguage)} {t('hours', currentLanguage)})</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleResetModal}
                  className="px-6 py-2.5 rounded-xl bg-[#0b2545] hover:bg-[#133966] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {t('viewDetails', currentLanguage)}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
