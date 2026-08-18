import { IndianState, LanguageCode, UserProfile } from '../types';
import { sendOTPService, verifyOTPService } from './supabaseClient';

export interface RegisteredCitizen {
  email: string;
  password: string;
  name: string;
  phone?: string;
  state: IndianState;
  city: string;
  preferredLanguage?: LanguageCode;
  avatarUrl?: string;
  isVerified: boolean;
  registeredAt: string;
}

const STORAGE_KEY = 'lokseva_registered_citizens_v2';

// Seed default citizen account
const DEFAULT_CITIZENS: RegisteredCitizen[] = [
  {
    email: 'citizen@lokseva.gov.in',
    password: 'Citizen@LokSeva#2026',
    name: 'Citizen',
    phone: '+91 98000 00000',
    state: 'Karnataka',
    city: 'Bengaluru',
    preferredLanguage: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    registeredAt: '2026-01-01T00:00:00.000Z',
  },
];

/**
 * Get all registered citizens from local storage
 */
export function getRegisteredCitizens(): RegisteredCitizen[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CITIZENS));
      return DEFAULT_CITIZENS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CITIZENS;
  } catch (e) {
    console.warn('Failed to parse registered citizens from storage:', e);
    return DEFAULT_CITIZENS;
  }
}

/**
 * Find registered citizen by email
 */
export function findRegisteredCitizen(email: string): RegisteredCitizen | undefined {
  const cleanEmail = email.trim().toLowerCase();
  const list = getRegisteredCitizens();
  return list.find((c) => c.email.toLowerCase() === cleanEmail);
}

/**
 * Save new registered citizen
 */
export function saveRegisteredCitizen(citizen: RegisteredCitizen): { success: boolean; error?: string } {
  const cleanEmail = citizen.email.trim().toLowerCase();
  const list = getRegisteredCitizens();
  const existingIndex = list.findIndex((c) => c.email.toLowerCase() === cleanEmail);

  if (existingIndex >= 0) {
    return { success: false, error: 'An account with this email already exists. Please log in instead.' };
  }

  const updatedList = [{ ...citizen, email: cleanEmail }, ...list];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

  // Also sync with server backend asynchronously
  fetch('/api/auth/citizen-register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(citizen),
  }).catch((err) => {
    console.warn('Asynchronous server citizen sync warning:', err);
  });

  return { success: true };
}

/**
 * Check if email already exists on the server
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  const clean = email.trim().toLowerCase();
  if (findRegisteredCitizen(clean) !== undefined) return true;
  try {
    const res = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: clean }),
    });
    const data = await res.json();
    if (data.exists) return true;
  } catch {}
  return false;
}

/**
 * Convert RegisteredCitizen to UserProfile
 */
export function citizenToUserProfile(citizen: RegisteredCitizen): UserProfile {
  return {
    id: 'usr-cit-' + citizen.email.replace(/[^a-zA-Z0-9]/g, '-'),
    name: citizen.name,
    email: citizen.email,
    phone: citizen.phone || '+91 98450 11223',
    role: 'citizen',
    portalType: 'citizen',
    state: citizen.state,
    city: citizen.city,
    preferredLanguage: citizen.preferredLanguage || 'en',
    avatarUrl: citizen.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  };
}

/**
 * Request OTP for Citizen Registration
 */
export async function sendCitizenRegistrationOTP(
  email: string,
  name?: string
): Promise<{ success: boolean; message: string; simulatedOtp?: string }> {
  return sendOTPService(email, 'citizen', { name }, 'registration');
}

/**
 * Verify Citizen Registration OTP
 */
export async function verifyCitizenRegistrationOTP(
  email: string,
  otpCode: string
): Promise<{ success: boolean; message?: string }> {
  return verifyOTPService(email, otpCode);
}
