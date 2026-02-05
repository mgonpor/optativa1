import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="card w-full max-w-md">
        <!-- Logo and Title -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            DAW Task
          </h1>
          <p class="text-slate-600 dark:text-slate-400">Inicia sesión en tu cuenta</p>
        </div>

        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              formControlName="username"
              class="input"
              placeholder="Ingresa tu usuario"
              [class.border-danger-500]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
            @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
              <p class="mt-1 text-sm text-danger-600">El usuario es requerido</p>
            }
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="input"
              placeholder="Ingresa tu contraseña"
              [class.border-danger-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <p class="mt-1 text-sm text-danger-600">La contraseña es requerida</p>
            }
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading()"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            @if (isLoading()) {
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            } @else {
              <span>Iniciar Sesión</span>
            }
          </button>
        </form>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-slate-600 dark:text-slate-400">
            ¿No tienes una cuenta?
            <a routerLink="/register" class="text-primary-600 hover:text-primary-700 font-medium ml-1">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastService = inject(ToastService);

    loginForm: FormGroup;
    isLoading = () => false;

    constructor() {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) return;

        this.isLoading = () => true;

        this.authService.login(this.loginForm.value).subscribe({
            next: () => {
                this.toastService.success('¡Bienvenido!');

                // Get return URL from query params or default based on role
                const returnUrl = this.route.snapshot.queryParams['returnUrl'];
                if (returnUrl) {
                    this.router.navigateByUrl(returnUrl);
                } else {
                    const defaultUrl = this.authService.isAdmin() ? '/admin/tasks' : '/user/tasks';
                    this.router.navigate([defaultUrl]);
                }
            },
            error: (error) => {
                this.isLoading = () => false;
                // Error is handled by error interceptor
            }
        });
    }
}
