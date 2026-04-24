export type JobStatus =
  | 'Applied'
  | 'Interview'
  | 'TechnicalTest'
  | 'Offer'
  | 'Rejected'
  | 'Ghosted';

export interface Job {
  id: string;
  companyName: string;
  position: string;
  location?: string;
  jobUrl?: string;
  notes?: string;
  status: JobStatus;
  appliedAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
}

export interface Stats {
  [key: string]: number;
}