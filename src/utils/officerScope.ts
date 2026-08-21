import { Complaint, UserProfile } from '../types';

function normalize(value: string | undefined): string {
  return value?.trim().toLocaleLowerCase() || '';
}

function extractZone(wardOrZone: string | undefined): string {
  if (!wardOrZone) return '';
  const lower = wardOrZone.toLowerCase();
  const zoneMatch = lower.match(/zone[:\s]*(.+)/);
  if (zoneMatch) return zoneMatch[1].trim();
  return lower;
}

/**
 * Applies department scope first, then compares jurisdiction fields.
 * Division matching: if officer has a ward/zone, complaint must match
 * on ward or zone (fuzzy). If officer has no ward/zone, skip division check.
 */
export function isComplaintInOfficerScope(complaint: Complaint, officer: UserProfile): boolean {
  if (officer.role !== 'officer') return false;
  if (!officer.department || complaint.department !== officer.department) return false;

  const complaintState = normalize(complaint.location?.state || complaint.state);
  const officerState = normalize(officer.state);
  if (complaintState && officerState && complaintState !== officerState) return false;

  const complaintCity = normalize(complaint.location?.city);
  const officerCity = normalize(officer.city);
  if (complaintCity && officerCity && complaintCity !== officerCity) return false;

  const officerWard = normalize(officer.ward);
  const officerZone = normalize(officer.zone);
  if (officerWard || officerZone) {
    const complaintWard = normalize(complaint.location?.ward);
    const complaintZone = normalize(complaint.location?.zone);
    const officerZoneNorm = extractZone(officer.ward) || officerZone;
    const complaintZoneNorm = extractZone(complaint.location?.ward) || complaintZone;
    if (officerZoneNorm && complaintZoneNorm && officerZoneNorm !== complaintZoneNorm) return false;
    if (officerWard && complaintWard && !complaintWard.includes(officerWard) && !officerWard.includes(complaintWard)) return false;
  }

  return true;
}

export function getOfficerScopedComplaints(complaints: Complaint[], officer: UserProfile): Complaint[] {
  return complaints.filter((complaint) => isComplaintInOfficerScope(complaint, officer));
}
