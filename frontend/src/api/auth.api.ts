import client from './client';
import type { AuthResponse } from '../types/auth';
import type { User } from '../types/user';


export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await client.post<AuthResponse>('/auth/login', {
        email,
        password
    });

    return data;
}

export const me = async (): Promise<User> => {
    return await client.get('/auth/me');
}

export const refresh = async (refresh_token: string): Promise<AuthResponse> => {
    const { data } = await client.post<AuthResponse>('/auth/refresh', { refresh_token });

    return data;
}

export const logout = async (): Promise<void> => {
    await client.post('/auth/logout');
}