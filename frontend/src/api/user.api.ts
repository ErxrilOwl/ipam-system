import client from './client';
import type { PaginatedResponse } from '@/types/pagination';
import type { User, UserPayload, UserResponse } from '@/types/user';


export const getUsers = async (params: Record<string, unknown>): Promise<PaginatedResponse<User>> => {
    const response = await client.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
}

export const getUser = async (id: number): Promise<User> => {
    const response = await client.get<User>(`/users/${id}`);
    return response.data;
}

export const createUser = async (payload: UserPayload): Promise<UserResponse> => {
    const response = await client.post<UserResponse>('/users', payload);
    return response.data;
}

export const updateUser = async (id: number, payload: UserPayload): Promise<UserResponse> => {
    const response = await client.put<UserResponse>(`/users/${id}`, payload);
    return response.data;
}

export const deleteUser = async (id: number): Promise<{ message: string }> => {
    const response = await client.delete<{ message: string }>(`/users/${id}`);
    return response.data;
}
