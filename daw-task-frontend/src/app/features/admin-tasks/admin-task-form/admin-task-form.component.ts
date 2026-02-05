import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ToastService } from '../../../core/services/toast.service';
import { CreateTareaDTO, UpdateTareaDTO } from '../../../core/models/tarea.models';

@Component({
    selector: 'app-admin-task-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="max-w-2xl mx-auto">
      <!-- Back button -->
      <a 
        routerLink="/admin/tasks" 
        class="inline-flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 transition-colors">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Volver a la lista
      </a>

      <div class="card">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          {{ isEditMode() ? 'Editar Tarea #' + taskId : 'Crear Nueva Tarea' }}
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

          <!-- User ID (only for creation) -->
          @if (!isEditMode()) {
            <div>
              <label for="idUsuario" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                ID de Usuario
              </label>
              <input
                id="idUsuario"
                type="number"
                formControlName="idUsuario"
                class="input"
                placeholder="Ej: 1"
                [class.border-danger-500]="taskForm.get('idUsuario')?.invalid && taskForm.get('idUsuario')?.touched">
              @if (taskForm.get('idUsuario')?.invalid && taskForm.get('idUsuario')?.touched) {
                <p class="mt-1 text-sm text-danger-600">El ID de usuario es requerido</p>
              }
            </div>
          }

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
              routerLink="/admin/tasks"
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
                <span>{{ isEditMode() ? 'Actualizar Tarea' : 'Crear Tarea' }}</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: []
})
export class AdminTaskFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taskService = inject(TaskService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastService = inject(ToastService);

    taskForm: FormGroup;
    isLoading = signal(false);
    isEditMode = signal(false);
    taskId: number | null = null;
    minDate = new Date().toISOString().split('T')[0];

    constructor() {
        this.taskForm = this.fb.group({
            titulo: ['', Validators.required],
            descripcion: ['', Validators.required],
            fechaVencimiento: ['', Validators.required],
            idUsuario: [null] // Added at runtime if not in edit mode
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.taskId = Number(id);
            this.taskForm.get('idUsuario')?.clearValidators();
            this.loadTask(this.taskId);
        } else {
            this.taskForm.get('idUsuario')?.setValidators([Validators.required]);
        }
    }

    loadTask(id: number): void {
        this.isLoading.set(true);
        this.taskService.getTaskById(id).subscribe({
            next: (task) => {
                this.taskForm.patchValue({
                    titulo: task.titulo,
                    descripcion: task.descripcion,
                    fechaVencimiento: task.fechaVencimiento
                });
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    onSubmit(): void {
        if (this.taskForm.invalid) return;

        this.isLoading.set(true);

        if (this.isEditMode()) {
            const updateData: UpdateTareaDTO = {
                id: this.taskId!,
                titulo: this.taskForm.value.titulo,
                descripcion: this.taskForm.value.descripcion,
                fechaVencimiento: this.taskForm.value.fechaVencimiento
            };

            this.taskService.updateTask(this.taskId!, updateData).subscribe({
                next: () => {
                    this.toastService.success('Tarea actualizada exitosamente');
                    this.router.navigate(['/admin/tasks']);
                },
                error: () => this.isLoading.set(false)
            });
        } else {
            const createData: CreateTareaDTO = {
                titulo: this.taskForm.value.titulo,
                descripcion: this.taskForm.value.descripcion,
                fechaVencimiento: this.taskForm.value.fechaVencimiento,
                idUsuario: this.taskForm.value.idUsuario
            };

            this.taskService.createTask(createData).subscribe({
                next: () => {
                    this.toastService.success('Tarea creada exitosamente');
                    this.router.navigate(['/admin/tasks']);
                },
                error: () => this.isLoading.set(false)
            });
        }
    }
}
