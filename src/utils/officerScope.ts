import { Complaint, UserProfile } from '../types';

function normalize(value: string | undefined): string {
  return value?.trim().toLocaleLowerCase() || '';
}

/**
 * Applies department scope first, then compares only jurisdiction fields that
 * exist on the grievance and the authenticated officer profile.
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

  return true;
}

export function getOfficerScopedComplaints(complaints: Complaint[], officer: UserProfile): Complaint[] {
  return complaints.filter((complaint) => isComplaintInOfficerScope(complaint, officer));
}
