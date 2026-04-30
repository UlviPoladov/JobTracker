import client from './client';
import type { Job, Stats } from '../types';

export const getJobs = () => client.get<Job[]>('/jobs');
export const getStats = () => client.get<Stats>('/jobs/stats');

export const createJob = (data: Partial<Job>) => client.post<Job>('/jobs', data);
export const updateJob = (id: string, data: Partial<Job>) =>
  client.put<Job>(`/jobs/${id}`, data);
export const deleteJob = (id: string) => client.delete(`/jobs/${id}`);