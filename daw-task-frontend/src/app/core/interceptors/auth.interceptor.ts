import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor to attach JWT token to requests
 * Excludes /auth endpoints from token injection
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    // Skip token injection for auth endpoints
    if (req.url.includes('/auth')) {
        return next(req);
    }

    // Get access token
    const token = authService.getAccessToken();

    // If token exists, clone request and add Authorization header
    if (token) {
        const clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(clonedReq);
    }

    // No token, proceed with original request
    return next(req);
};
