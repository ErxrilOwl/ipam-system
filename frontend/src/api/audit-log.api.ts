import type { AuditLog, AuditLogItem } from '@/types/audit-log';
import client from './client';
import type { PaginatedResponse } from '@/types/pagination';

export const getAuditLogs = async (params: Record<string, unknown>): Promise<PaginatedResponse<AuditLogItem>> => {
    const response = await client.get<PaginatedResponse<AuditLogItem>>('/audit-logs', { params });
    return response.data;
}

export const getAuditLog = async (id: number): Promise<AuditLog> => {
    const response = await client.get<AuditLog>(`/audit-logs/${id}`);
    return response.data;
}