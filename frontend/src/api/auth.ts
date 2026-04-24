import client from './client';
import type { AuthResponse } from '../types';

export const register = (data: {
  email: string; password: string; fullName: string;
}) => client.post<AuthResponse>('/auth/register', data);

export const login = (data: { email: string; password: string }) =>
  client.post<AuthResponse>('/auth/login', data);