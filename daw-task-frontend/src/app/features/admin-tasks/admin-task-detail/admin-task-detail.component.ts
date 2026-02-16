import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ToastService } from '../../../core/services/toast.service';
import { Tarea, Estado } from '../../../core/models/tarea.models';

@Component({
  selector: 'app-admin-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Back button -->
      <a 
        routerLink="/admin/tasks" 
        class="inline-flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 transition-colors">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Volver a la gestión
      </a>

      @if (isLoading()) {
        <div class="flex justify-center items-center py-24">
          <svg class="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      } @else if (task(); as t) {
        <div class="card overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-3">
            <!-- Left Column: Content -->
            <div class="lg:col-span-2 p-8 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700">
              <div class="flex items-center gap-3 mb-6">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Tarea #{{ t.id }}</span>
                <span 
                  class="px-2 py-1 text-[10px] font-bold uppercase rounded-full"
                  [ngClass]="{
                    'bg-warning-100 text-warning-700': t.estado === Estado.PENDIENTE,
                    'bg-primary-100 text-primary-700': t.estado === Estado.EN_PROGRESO,
                    'bg-success-100 text-success-700': t.estado === Estado.COMPLETADA
                  }">
                  {{ t.estado }}
                </span>
              </div>

              <h1 class="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">
                {{ t.titulo }}
              </h1>

              <div class="prose dark:prose-invert max-w-none">
                <h3 class="text-lg font-semibold mb-3">Descripción</h3>
                <p class="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {{ t.descripcion }}
                </p>
              </div>
            </div>

            <!-- Right Column: Meta & Actions -->
            <div class="p-8 bg-slate-50/50 dark:bg-slate-900/50">
              <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-6">Información</h3>
              
              <div class="space-y-6">
                <div>
                  <p class="text-xs text-slate-500 uppercase font-semibold mb-1">Usuario Asignado</p>
                  <p class="text-sm font-medium text-slate-900 dark:text-slate-100">ID: {{ t.idUsuario }}</p>
                </div>

                <div>
                  <p class="text-xs text-slate-500 uppercase font-semibold mb-1">Fechas</p>
                  <div class="space-y-2">
                    <div class="flex items-center gap-2 text-sm">
                      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="text-slate-600 dark:text-slate-400">Creada:</span>
                      <span class="font-medium">{{ formatDate(t.fechaCreacion) }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="text-slate-600 dark:text-slate-400">Vence:</span>
                      <span class="font-medium">{{ formatDate(t.fechaVencimiento) }}</span>
                    </div>
                  </div>
                </div>

                <div class="pt-6 space-y-3">
                  @if (t.estado === Estado.PENDIENTE) {
                    <button 
                      (click)="iniciarTarea(t.id)"
                      class="w-full btn-success py-2.5 flex items-center justify-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Iniciar Tarea
                    </button>
                  } @else if (t.estado === Estado.EN_PROGRESO) {
                    <button 
                      (click)="completarTarea(t.id)"
                      class="w-full btn-primary py-2.5 flex items-center justify-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Completar Tarea
                    </button>
                  }
                  <a 
                    [routerLink]="['/admin/tasks', t.id, 'edit']"
                    class="w-full btn-secondary py-2.5 flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L11.75 16.25l-4.5 1.5 1.5-4.5L16.5 3.5z"></path>
                    </svg>
                    Editar Tarea
                  </a>
                  <button 
                    (click)="deleteTask(t.id)"
                    class="w-full btn-danger py-2.5 flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Eliminar Tarea
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class AdminTaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private toastService = inject(ToastService);

  Estado = Estado;
  task = signal<Tarea | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadTask(id);
    } else {
      this.router.navigate(['/admin/tasks']);
    }
  }

  loadTask(id: number): void {
    this.isLoading.set(true);
    this.taskService.getTaskById(id).subscribe({
      next: (t) => {
        this.task.set(t);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin/tasks']);
      }
    });
  }

  iniciarTarea(id: number): void {
    this.taskService.iniciarTarea(id).subscribe({
      next: (updated) => {
        this.task.set(updated);
        this.toastService.success('Tarea iniciada correctamente');
      }
    });
  }

  completarTarea(id: number): void {
    this.taskService.completarTarea(id).subscribe({
      next: (updated) => {
        this.task.set(updated);
        this.toastService.success('Tarea completada correctamente');
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.toastService.success('Tarea eliminada correctamente');
          this.router.navigate(['/admin/tasks']);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
