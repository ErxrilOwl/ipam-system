export interface AuditLog {
    id: number,
    user_id: number,
    user_role: "admin" | "user",
    user_name: string,
    session_id: string,
    action: string,
    resource_type: string,
    resource_id: string,
    before?: string,
    after?: string,
    ip_address: string,
    user_agent: string,
    created_at: string,
    updated_at: string
}

export interface AuditLogItem {
    id: number,
    user_id: number,
    user_role: "admin" | "user",
    user_name: string,
    session_id: string,
    action: string,
    resource_type: string,
    resource_id: string,
    created_at: string,
    ip_address: string
}
