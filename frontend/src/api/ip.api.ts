import client from './client';
import type { IPAddress, IPAddressPayload, IPAddressResponse } from '../types/ip';
import type { PaginatedResponse } from '@/types/pagination';


export const getIPAddresses = async (params: Record<string, unknown>): Promise<PaginatedResponse<IPAddress>> => {
    const response = await client.get<PaginatedResponse<IPAddress>>('/ip-addresses', { params });
    return response.data;
}

export const getIPAddress = async (id: number): Promise<IPAddress> => {
    const response = await client.get<IPAddress>(`/ip-addresses/${id}`);
    return response.data;
}

export const createIPAddress = async (payload: IPAddressPayload): Promise<IPAddressResponse> => {
    const response = await client.post<IPAddressResponse>('/ip-addresses', payload);
    return response.data;
}

export const updateIPAddress = async (id: number, payload: IPAddressPayload): Promise<IPAddressResponse> => {
    const response = await client.put<IPAddressResponse>(`/ip-addresses/${id}`, payload);
    return response.data;
}

export const deleteIPAddress = async (id: number): Promise<{ message: string }> => {
    const response = await client.delete<{ message: string }>(`/ip-addresses/${id}`);
    return response.data;
}
