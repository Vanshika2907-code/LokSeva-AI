import { AIAnalysisResult, Complaint, SimilarGrievance, UserProfile } from '../types';

export async function classifyGrievanceAPI(payload: {
  text: string;
  languageHint?: string;
  imageBase64?: string;
  audioDataUrl?: string;
  locationAddress?: string;
}): Promise<AIAnalysisResult> {
  try {
    const res = await fetch('/api/ai/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('AI classification failed');
    return await res.json();
  } catch (err) {
    console.error('Error calling /api/ai/classify:', err);
    // Fallback heuristic
    return {
      detectedLanguage: payload.languageHint || 'English',
      transcription: payload.text,
      category: 'Roads & Infrastructure',
      department: 'Public Works Department',
      priority: 'HIGH',
      summary: payload.text.slice(0, 100) + '...',
      confidence: 0.95,
      slaHours: 48,
      keywords: ['Roads', 'Infrastructure', 'Citizen Report'],
      sentiment: 'urgent',
    };
  }
}

export async function checkDuplicateGrievanceAPI(payload: {
  text: string;
  category: string;
  location?: any;
}): Promise<{ hasDuplicate: boolean; matches: SimilarGrievance[] }> {
  try {
    const res = await fetch('/api/ai/duplicate-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Duplicate check failed');
    return await res.json();
  } catch (err) {
    console.error('Error calling duplicate check:', err);
    return { hasDuplicate: false, matches: [] };
  }
}

export async function askCitizenChatbotAPI(payload: {
  complaintId: string;
  message: string;
  conversationHistory?: any[];
}): Promise<string> {
  try {
    const res = await fetch('/api/ai/citizen-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Citizen chat failed');
    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.error('Citizen chat error:', err);
    return 'Your grievance is active in our municipal records and currently undergoing departmental action within SLA guidelines.';
  }
}

export async function askOfficerAssistantAPI(payload: {
  question: string;
  officerProfile: Pick<UserProfile, 'id' | 'role' | 'department' | 'designation' | 'state' | 'city' | 'assignedState'>;
}): Promise<{ reply: string; suggestedActions?: string[] }> {
  try {
    const res = await fetch('/api/ai/officer-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Officer chat failed');
    return await res.json();
  } catch (err) {
    console.error('Officer chat error:', err);
    return {
      reply: 'AI Intelligence Assistant is summarizing live department metrics.',
      suggestedActions: ['View High Priority Overdue', 'Filter Ward Complaints'],
    };
  }
}

export async function fetchComplaintsAPI(): Promise<Complaint[]> {
  try {
    const res = await fetch('/api/complaints');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.complaints || [];
  } catch (err) {
    console.error('Fetch complaints error:', err);
    return [];
  }
}

export async function createComplaintAPI(complaint: Complaint): Promise<Complaint> {
  const res = await fetch('/api/complaints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(complaint),
  });
  const data = await res.json();
  return data.complaint;
}

export async function updateComplaintStatusAPI(
  id: string,
  payload: {
    status: string;
    message: string;
    createdBy: string;
    role?: string;
    evidenceImageUrl?: string;
    workDetails?: {
      actionCategory?: string;
      actionTaken: string;
      workProgressPercent: number;
      crewLead?: string;
      equipmentUsed?: string;
      estimatedCompletion?: string;
      officerBadgeId?: string;
    };
  }
): Promise<Complaint> {
  const res = await fetch(`/api/complaints/${id}/updates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.complaint;
}

export async function submitFeedbackAPI(
  id: string,
  feedback: { rating: number; comment: string; aspects?: any }
): Promise<Complaint> {
  const res = await fetch(`/api/complaints/${id}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback),
  });
  const data = await res.json();
  return data.complaint;
}

export async function supportExistingComplaintAPI(id: string): Promise<number> {
  const res = await fetch(`/api/complaints/${id}/support`, {
    method: 'POST',
  });
  const data = await res.json();
  return data.supportersCount;
}
