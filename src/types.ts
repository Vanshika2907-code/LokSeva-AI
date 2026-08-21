export type UserRole = 'citizen' | 'officer' | 'admin';

export type PortalType = 'citizen' | 'officer' | 'admin';

export type NavigationTab = 'home' | 'citizen' | 'officer' | 'admin' | 'state_portal' | 'map' | 'about';

export type LanguageCode = 'kn' | 'en' | 'hi' | 'ta' | 'te' | 'ml' | 'mr' | 'bn' | 'gu';

export type IndianState =
  | 'Karnataka'
  | 'Maharashtra'
  | 'Delhi NCR'
  | 'Tamil Nadu'
  | 'Telangana'
  | 'Uttar Pradesh'
  | 'West Bengal'
  | 'Gujarat'
  | 'Kerala'
  | 'Rajasthan'
  | 'All States';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  speechCode: string;
}

export type ComplaintCategory =
  | 'Roads & Infrastructure'
  | 'Water Supply'
  | 'Electricity'
  | 'Waste Management'
  | 'Sanitation'
  | 'Street Lighting'
  | 'Public Transport'
  | 'Public Health'
  | 'Drainage'
  | 'Environment'
  | 'Other';

export type DepartmentName =
  | 'Public Works Department'
  | 'Water Supply & Sewerage Board'
  | 'Electricity Supply Corporation'
  | 'Solid Waste Management'
  | 'Sanitation & Health Division'
  | 'Street Lighting Division'
  | 'Metropolitan Transport Corporation'
  | 'Public Health & Disease Control'
  | 'Municipal Stormwater Drainage'
  | 'Environmental Protection Cell';

export type ComplaintPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected'
  | 'Escalated';

export interface WorkDetails {
  actionCategory?: string;
  actionTaken: string;
  workProgressPercent: number; // 0 - 100
  crewLead?: string;
  equipmentUsed?: string;
  estimatedCompletion?: string;
  officerBadgeId?: string;
}

export interface ComplaintUpdate {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  message: string;
  createdBy: string;
  createdAt: string;
  role: 'officer' | 'system' | 'citizen';
  evidenceImageUrl?: string;
  workDetails?: WorkDetails;
}

export interface ComplaintAttachment {
  id: string;
  complaintId: string;
  fileUrl: string;
  fileType: 'image' | 'audio' | 'video' | 'document';
  description?: string;
}

export interface CitizenFeedback {
  id: string;
  complaintId: string;
  rating: number; // 1-5
  comment: string;
  submittedAt: string;
  aspects?: {
    speed: number;
    quality: number;
    communication: number;
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  state: IndianState;
  district?: string;
  city?: string;
  landmark?: string;
  ward?: string;
  zone?: string;
}

export interface AIAnalysisResult {
  detectedLanguage: string;
  transcription?: string;
  category: ComplaintCategory;
  department: DepartmentName;
  priority: ComplaintPriority;
  summary: string;
  confidence: number;
  slaHours: number;
  keywords: string[];
  sentiment?: 'urgent' | 'frustrated' | 'neutral';
  imageAnalysis?: {
    isHazard: boolean;
    detectedObjects: string[];
    severityEstimate: 'HIGH' | 'MEDIUM' | 'LOW';
    visualDescription: string;
  };
}

export interface SimilarGrievance {
  complaintId: string;
  complaintNumber: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  similarityScore: number;
  distanceMeters?: number;
  supportersCount: number;
  createdAt: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string; // e.g. GRV-2026-0012
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  description: string;
  originalLanguage: LanguageCode;
  category: ComplaintCategory;
  department: DepartmentName;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  state: IndianState;
  district?: string;
  location: LocationData;
  aiSummary: string;
  aiConfidence: number;
  slaHours: number;
  slaDeadline: string; // ISO String
  isSlaBreached: boolean;
  isEscalated?: boolean;
  assignedOfficerName?: string;
  assignedOfficerId?: string;
  assignedOfficerDesignation?: string;
  workProgressPercent?: number; // 0 to 100
  currentWorkSummary?: string;
  attachments: ComplaintAttachment[];
  updates: ComplaintUpdate[];
  feedback?: CitizenFeedback;
  supportersCount: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  portalType: PortalType;
  department?: DepartmentName;
  state?: IndianState;
  city?: string;
  ward?: string;
  zone?: string;
  designation?: string;
  badgeId?: string;
  preferredLanguage: LanguageCode;
  avatarUrl?: string;
  adminScope?: 'national' | 'state';
  assignedState?: IndianState;
}

export interface OfficerAIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  referencedComplaintIds?: string[];
}

export interface CitizenAIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  complaintId?: string;
}
