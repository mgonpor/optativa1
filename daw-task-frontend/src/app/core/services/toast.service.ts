import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastsSignal = signal<Toast[]>([]);
    public toasts = this.toastsSignal.asReadonly();

    private nextId = 0;

    /**
     * Show a toast notification
     */
    show(message: string, type: Toast['type'] = 'info', duration: number = 5000): void {
        const toast: Toast = {
            id: this.nextId++,
            message,
            type,
            duration
        };

        const currentToasts = this.toastsSignal();
        this.toastsSignal.set([...currentToasts, toast]);

        // Auto-remove toast after duration
        if (duration > 0) {
            setTimeout(() => this.remove(toast.id), duration);
        }
    }

    /**
     * Show success toast
     */
    success(message: string, duration?: number): void {
        this.show(message, 'success', duration);
    }

    /**
     * Show error toast
     */
    error(message: string, duration?: number): void {
        this.show(message, 'error', duration);
    }

    /**
     * Show warning toast
     */
    warning(message: string, duration?: number): void {
        this.show(message, 'warning', duration);
    }

    /**
     * Show info toast
     */
    info(message: string, duration?: number): void {
        this.show(message, 'info', duration);
    }

    /**
     * Remove a toast by ID
     */
    remove(id: number): void {
        const currentToasts = this.toastsSignal();
        this.toastsSignal.set(currentToasts.filter(t => t.id !== id));
    }

    /**
     * Clear all toasts
     */
    clear(): void {
        this.toastsSignal.set([]);
    }
}
