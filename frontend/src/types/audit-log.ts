export interface AuditLog {
    id: number,
    user_id: number,
    user_role: "admin" | "user",
    user_name: string,
    session_id: string,
    action: string,
    resource_type: string,
    resource_id: string,
    before?: Record<string, unknown>,
    after?: Record<string, unknown>,
    ip_address: string,
    user_agent: string,
    created_at: string,
    updated_at: string
}
