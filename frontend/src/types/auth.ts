import type { User } from "./user"

export interface AuthResponse {
    access_token: string,
    refresh_token: string,
    auth_type: string,
    expires_in: number,
    user: User
}