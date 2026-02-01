export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    created_at: string;
};

export interface UserResponse {
    data: User,
    message: string
}

export interface UserPayload {
    name: string;
    email: string;
    role: 'admin' | 'user';
    password: string;
}