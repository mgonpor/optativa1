import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Admin Guard - protects routes that require admin role
 * Redirects to /user/tasks if user is not admin
 */
export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAdmin()) {
        return true;
    }

    // Not admin, redirect to user tasks
    router.navigate(['/user/tasks']);
    return false;
};
