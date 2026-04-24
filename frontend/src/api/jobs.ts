import client from './client';
import type { Job, Stats } from '../types';

export const getJobs = () => client.get<Job[]>('/jobs');
export const getStats = () => client.get<Stats>('/jobs/stats');

export const createJob = (data: {
  companyName: string;
  position: string;
  location?: string;
  jobUrl?: string;
  notes?: string;
  status: string;
}) => client.post<Job>('/jobs', data);

export const updateJob = (id: string, data: {
  companyName?: string;
  position?: string;
  location?: string;
  jobUrl?: string;
  notes?: string;
  status?: string;
}) => client.put<Job>(`/jobs/${id}`, data);

export const deleteJob = (id: string) => client.delete(`/jobs/${id}`);