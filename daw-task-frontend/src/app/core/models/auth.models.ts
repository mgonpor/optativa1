// Authentication DTOs
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface RefreshDTO {
    refresh: string;
}

// Decoded JWT payload
export interface JwtPayload {
    sub: string; // username
    rol: string; // role
    exp: number; // expiration timestamp
    iat: number; // issued at timestamp
}

// User info extracted from JWT
export interface UserInfo {
    username: string;
    role: string;
    isAdmin: boolean;
}
