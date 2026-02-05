import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor for global error handling
 * Maps HTTP status codes to user-friendly toast notifications
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const toastService = inject(ToastService);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Ha ocurrido un error';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 400:
                        // Bad Request - show backend error message
                        errorMessage = error.error || 'Solicitud incorrecta';
                        toastService.error(errorMessage);
                        break;

                    case 401:
                        // Unauthorized - try to refresh token or logout
                        errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
                        toastService.error(errorMessage);
                        authService.logout();
                        break;

                    case 403:
                        // Forbidden - access denied
                        errorMessage = error.error || 'Acceso denegado. No tienes permisos para realizar esta acción.';
                        toastService.error(errorMessage);
                        break;

                    case 404:
                        // Not Found
                        errorMessage = error.error || 'Recurso no encontrado';
                        toastService.error(errorMessage);
                        break;

                    case 500:
                    case 502:
                    case 503:
                    case 504:
                        // Server errors
                        errorMessage = 'Error del servidor. Por favor, intenta más tarde.';
                        toastService.error(errorMessage);
                        break;

                    default:
                        // Other errors
                        errorMessage = error.error || `Error ${error.status}: ${error.statusText}`;
                        toastService.error(errorMessage);
                }
            }

            // Re-throw the error so components can handle it if needed
            return throwError(() => error);
        })
    );
};
