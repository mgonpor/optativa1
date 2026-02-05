import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-register',
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
          <p class="text-slate-600 dark:text-slate-400">Crea tu cuenta</p>
        </div>

        <!-- Register Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
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
              placeholder="Elige un nombre de usuario"
              [class.border-danger-500]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
            @if (registerForm.get('username')?.invalid && registerForm.get('username')?.touched) {
              <p class="mt-1 text-sm text-danger-600">
                @if (registerForm.get('username')?.errors?.['required']) {
                  El usuario es requerido
                }
                @if (registerForm.get('username')?.errors?.['minlength']) {
                  El usuario debe tener al menos 3 caracteres
                }
              </p>
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
              placeholder="Elige una contraseña"
              [class.border-danger-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
            @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
              <p class="mt-1 text-sm text-danger-600">
                @if (registerForm.get('password')?.errors?.['required']) {
                  La contraseña es requerida
                }
                @if (registerForm.get('password')?.errors?.['minlength']) {
                  La contraseña debe tener al menos 6 caracteres
                }
              </p>
            }
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              class="input"
              placeholder="Confirma tu contraseña"
              [class.border-danger-500]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
            @if (registerForm.get('confirmPassword')?.touched && registerForm.errors?.['passwordMismatch']) {
              <p class="mt-1 text-sm text-danger-600">Las contraseñas no coinciden</p>
            }
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading()"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            @if (isLoading()) {
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </span>
            } @else {
              <span>Registrarse</span>
            }
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-slate-600 dark:text-slate-400">
            ¿Ya tienes una cuenta?
            <a routerLink="/login" class="text-primary-600 hover:text-primary-700 font-medium ml-1">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private toastService = inject(ToastService);

    registerForm: FormGroup;
    isLoading = () => false;

    constructor() {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    /**
     * Custom validator to check if passwords match
     */
    private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (!password || !confirmPassword) {
            return null;
        }

        return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    }

    onSubmit(): void {
        if (this.registerForm.invalid) return;

        this.isLoading = () => true;

        const { username, password } = this.registerForm.value;

        this.authService.register({ username, password }).subscribe({
            next: () => {
                this.toastService.success('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
                this.router.navigate(['/login']);
            },
            error: (error) => {
                this.isLoading = () => false;
                // Error is handled by error interceptor
            }
        });
    }
}
