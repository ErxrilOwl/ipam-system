import client from './client';
import type { IPAddress, IPAddressPayload } from '../types/ip';
import type { PaginatedResponse } from '@/types/pagination';


export const getIPAddresses = async (params: Record<string, unknown>): Promise<PaginatedResponse<IPAddress>> => {
    const response = await client.get<PaginatedResponse<IPAddress>>('/ip-addresses', { params });
    return response.data;
}

export const createIPAddress = async (payload: IPAddressPayload): Promise<IPAddress> => {
    const response = await client.post<IPAddress>('/ip-addresses', payload);
    return response.data;
}

export const updateIPAddress = async (id: number, payload: IPAddressPayload): Promise<IPAddress> => {
    const response = await client.put<IPAddress>(`/ip-addresses/${id}`, payload);
    return response.data;
}

export const deleteIPAddress = async (id: number): Promise<IPAddress> => {
    const response = await client.delete<IPAddress>(`/ip-addresses/${id}`);
    return response.data;
}
