export interface IPAddress {
    id: number,
    ip_address: string,
    label: string,
    comment?: string | null,
    created_by: number,
    created_at: string,
    updated_at: string
}

export interface IPAddressPayload {    
    ip_address: string,
    label: string,
    comment?: string | null
}
