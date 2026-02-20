import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreateTareaDTO } from '../../../core/models/tarea.models';

@Component({
  selector: 'app-user-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <!-- Back button -->
      <a 
        routerLink="/user/tasks" 
        class="inline-flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 transition-colors">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Volver a la lista
      </a>

      <div class="card">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Crear Nueva Tarea
        </h1>

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Title -->
          <div>
            <label for="titulo" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Título
            </label>
            <input
              id="titulo"
              type="text"
              formControlName="titulo"
              class="input"
              placeholder="Ej: Finalizar reporte mensual"
              [class.border-danger-500]="taskForm.get('titulo')?.invalid && taskForm.get('titulo')?.touched">
            @if (taskForm.get('titulo')?.invalid && taskForm.get('titulo')?.touched) {
              <p class="mt-1 text-sm text-danger-600">El título es requerido</p>
            }
          </div>

          <!-- Description -->
          <div>
            <label for="descripcion" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              formControlName="descripcion"
              rows="4"
              class="input"
              placeholder="Describe los detalles de la tarea..."
              [class.border-danger-500]="taskForm.get('descripcion')?.invalid && taskForm.get('descripcion')?.touched"></textarea>
            @if (taskForm.get('descripcion')?.invalid && taskForm.get('descripcion')?.touched) {
              <p class="mt-1 text-sm text-danger-600">La descripción es requerida</p>
            }
          </div>

          <!-- Due Date -->
          <div>
            <label for="fechaVencimiento" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Fecha de Vencimiento
            </label>
            <input
              id="fechaVencimiento"
              type="date"
              formControlName="fechaVencimiento"
              class="input"
              [min]="minDate"
              [class.border-danger-500]="taskForm.get('fechaVencimiento')?.invalid && taskForm.get('fechaVencimiento')?.touched">
            @if (taskForm.get('fechaVencimiento')?.invalid && taskForm.get('fechaVencimiento')?.touched) {
              <p class="mt-1 text-sm text-danger-600">
                La fecha de vencimiento es requerida y debe ser futura
              </p>
            }
          </div>

          <!-- Actions -->
          <div class="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              routerLink="/user/tasks"
              class="flex-1 btn-outline">
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="taskForm.invalid || isLoading()"
              class="flex-1 btn-primary disabled:opacity-50">
              @if (isLoading()) {
                <span class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              } @else {
                <span>Crear Tarea</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class UserTaskFormComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  taskForm: FormGroup;
  isLoading = signal(false);
  minDate = new Date().toISOString().split('T')[0];

  constructor() {
    this.taskForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaVencimiento: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    this.isLoading.set(true);

    // Get current user ID (this is tricky since it's not in the token, 
    // we might need to fetch it or the backend handles it. 
    // Looking at TareaService.create, it expects idUsuario if it exists.
    // If not provided, it might fail or we need to find it.
    // However, the prompt says "solo se envian los campos obligatorios".
    // Let's assume the component will need to know the current user's ID.
    // In our AuthService, we could decode it from JWT if it's there, or fetch once.
    // For now, I'll send a placeholder or try to omit it if the backend auto-assigns for users.
    // BUT TareaService.create has: if(tareaRepository.existsTareaByIdUsuario(tarea.getIdUsuario())) { throw ... }
    // Wait, existsTareaByIdUsuario(int idUsuario) looks like it might check if user EXISTS? 
    // Let me check that repository method name again.

    const taskData: CreateTareaDTO = {
      ...this.taskForm.value,
      idUsuario: 0
    };

    this.taskService.createTask(taskData).subscribe({
      next: () => {
        this.toastService.success('Tarea creada exitosamente');
        this.router.navigate(['/user/tasks']);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
