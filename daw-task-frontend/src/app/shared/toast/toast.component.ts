import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="glass rounded-lg shadow-lg p-4 min-w-[300px] max-w-md animate-slide-in-right"
          [ngClass]="{
            'border-l-4 border-success-500': toast.type === 'success',
            'border-l-4 border-danger-500': toast.type === 'error',
            'border-l-4 border-warning-500': toast.type === 'warning',
            'border-l-4 border-primary-500': toast.type === 'info'
          }">
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0">
              @switch (toast.type) {
                @case ('success') {
                  <svg class="w-6 h-6 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                }
                @case ('error') {
                  <svg class="w-6 h-6 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                }
                @case ('warning') {
                  <svg class="w-6 h-6 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                }
                @case ('info') {
                  <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                }
              }
            </div>

            <!-- Message -->
            <div class="flex-1 pt-0.5">
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ toast.message }}</p>
            </div>

            <!-- Close button -->
            <button 
              (click)="toastService.remove(toast.id)"
              class="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ToastComponent {
  toastService = inject(ToastService);
}
