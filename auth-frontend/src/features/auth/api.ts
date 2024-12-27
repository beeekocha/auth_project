import { api } from '@/lib/axios';
import type { SignInData, SignUpData, AuthResponse } from './types';

export const authApi = {
  signIn: (data: SignInData) => 
    api.post<AuthResponse>('/auth/login', data),
  
  signUp: (data: SignUpData) => 
    api.post<AuthResponse>('/auth/register', data),
};