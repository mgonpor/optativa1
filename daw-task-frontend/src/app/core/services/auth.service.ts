import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { LoginRequest, LoginResponse, RefreshDTO, UserInfo, JwtPayload } from '../models/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = 'http://localhost:8081/auth';
    private readonly ACCESS_TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';

    private http = inject(HttpClient);
    private router = inject(Router);

    // Signal for current user info
    private userInfoSignal = signal<UserInfo | null>(this.getUserInfoFromToken());

    // Computed signals
    public currentUser = this.userInfoSignal.asReadonly();
    public isAuthenticated = computed(() => this.userInfoSignal() !== null);
    public isAdmin = computed(() => this.userInfoSignal()?.isAdmin ?? false);

    constructor() {
        // Initialize user info from stored token on service creation
        this.initializeFromStorage();
    }

    /**
     * Initialize user info from localStorage
     */
    private initializeFromStorage(): void {
        const token = this.getAccessToken();
        if (token && !this.isTokenExpired(token)) {
            this.userInfoSignal.set(this.getUserInfoFromToken());
        } else {
            this.clearTokens();
        }
    }

    /**
     * Login with username and password
     */
    login(credentials: LoginRequest) {
        return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
            tap(response => {
                this.storeTokens(response.access, response.refresh);
                this.userInfoSignal.set(this.getUserInfoFromToken());
            })
        );
    }

    /**
     * Register a new user
     */
    register(credentials: LoginRequest) {
        return this.http.post(`${this.API_URL}/register`, credentials, { observe: 'response' }).pipe(
            tap(response => {
                const token = response.headers.get('Authorization');
                if (token) {
                    // Extract token from "Bearer <token>" format
                    const accessToken = token.replace('Bearer ', '');
                    this.storeTokens(accessToken, ''); // Register doesn't return refresh token
                    this.userInfoSignal.set(this.getUserInfoFromToken());
                }
            })
        );
    }

    /**
     * Refresh access token using refresh token
     */
    refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            return of(null);
        }

        const refreshDTO: RefreshDTO = { refresh: refreshToken };
        return this.http.post<LoginResponse>(`${this.API_URL}/refresh`, refreshDTO).pipe(
            tap(response => {
                this.storeTokens(response.access, response.refresh);
                this.userInfoSignal.set(this.getUserInfoFromToken());
            }),
            catchError(() => {
                this.logout();
                return of(null);
            })
        );
    }

    /**
     * Logout (client-side only - clear tokens)
     */
    logout(): void {
        this.clearTokens();
        this.userInfoSignal.set(null);
        this.router.navigate(['/login']);
    }

    /**
     * Get access token from localStorage
     */
    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    /**
     * Get refresh token from localStorage
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Store tokens in localStorage
     */
    private storeTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        if (refreshToken) {
            localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        }
    }

    /**
     * Clear tokens from localStorage
     */
    private clearTokens(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Decode JWT token
     */
    private decodeToken(token: string): JwtPayload | null {
        try {
            const payload = token.split('.')[1];
            const decoded = atob(payload);
            return JSON.parse(decoded);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    /**
     * Check if token is expired
     */
    private isTokenExpired(token: string): boolean {
        const decoded = this.decodeToken(token);
        if (!decoded) return true;

        const expirationDate = new Date(decoded.exp * 1000);
        return expirationDate < new Date();
    }

    /**
     * Extract user info from stored access token
     */
    private getUserInfoFromToken(): UserInfo | null {
        const token = this.getAccessToken();
        if (!token) return null;

        const decoded = this.decodeToken(token);
        if (!decoded) return null;

        return {
            username: decoded.sub,
            role: decoded.rol,
            isAdmin: decoded.rol === 'ADMIN'
        };
    }
}
