import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ToastService } from '../../../core/services/toast.service';
import { Estado } from '../../../core/models/tarea.models';

@Component({
  selector: 'app-user-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Filter Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button
          (click)="selectedEstado.set(null)"
          [class.btn-primary]="selectedEstado() === null"
          [class.btn-outline]="selectedEstado() !== null"
          class="btn whitespace-nowrap">
          Todas ({{ tasks().length }})
        </button>
        <button
          (click)="selectedEstado.set(Estado.PENDIENTE)"
          [class.btn-primary]="selectedEstado() === Estado.PENDIENTE"
          [class.btn-outline]="selectedEstado() !== Estado.PENDIENTE"
          class="btn whitespace-nowrap">
          Pendientes ({{ pendientesTasks().length }})
        </button>
        <button
          (click)="selectedEstado.set(Estado.EN_PROGRESO)"
          [class.btn-primary]="selectedEstado() === Estado.EN_PROGRESO"
          [class.btn-outline]="selectedEstado() !== Estado.EN_PROGRESO"
          class="btn whitespace-nowrap">
          En Progreso ({{ enProgresoTasks().length }})
        </button>
        <button
          (click)="selectedEstado.set(Estado.COMPLETADA)"
          [class.btn-primary]="selectedEstado() === Estado.COMPLETADA"
          [class.btn-outline]="selectedEstado() !== Estado.COMPLETADA"
          class="btn whitespace-nowrap">
          Completadas ({{ completadasTasks().length }})
        </button>
      </div>

      <!-- Tasks Grid -->
      @if (isLoading()) {
        <div class="flex justify-center items-center py-12">
          <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      } @else if (filteredTasks().length === 0) {
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">No hay tareas</h3>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Comienza creando una nueva tarea.</p>
          <div class="mt-6">
            <a routerLink="/user/tasks/new" class="btn-primary">
              <svg class="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Nueva Tarea
            </a>
          </div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (task of filteredTasks(); track task.id) {
            <div class="card hover:shadow-2xl transition-all">
              <!-- Task Header -->
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 flex-1">
                  {{ task.titulo }}
                </h3>
                <span 
                  class="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2"
                  [ngClass]="{
                    'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300': task.estado === Estado.PENDIENTE,
                    'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300': task.estado === Estado.EN_PROGRESO,
                    'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300': task.estado === Estado.COMPLETADA
                  }">
                  {{ getEstadoLabel(task.estado!) }}
                </span>
              </div>

              <!-- Task Description -->
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {{ task.descripcion }}
              </p>

              <!-- Task Dates -->
              <div class="space-y-1 mb-4 text-xs text-slate-500 dark:text-slate-400">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>Creada: {{ formatDate(task.fechaCreacion) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Vence: {{ formatDate(task.fechaVencimiento) }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <a 
                  [routerLink]="['/user/tasks', task.id]"
                  class="flex-1 btn-outline text-center text-sm">
                  Ver Detalle
                </a>
                @if (task.estado === Estado.PENDIENTE) {
                  <button
                    (click)="iniciarTarea(task.id)"
                    class="flex-1 btn-success text-sm">
                    Iniciar
                  </button>
                } @else if (task.estado === Estado.EN_PROGRESO) {
                  <button
                    (click)="completarTarea(task.id)"
                    class="flex-1 btn-primary text-sm">
                    Completar
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class UserTaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private toastService = inject(ToastService);

  Estado = Estado;
  tasks = this.taskService.tasks;
  isLoading = signal(false);
  selectedEstado = signal<Estado | null>(null);

  // Computed signals for filtered tasks
  pendientesTasks = computed(() =>
    this.tasks().filter(t => t.estado === Estado.PENDIENTE)
  );
  enProgresoTasks = computed(() =>
    this.tasks().filter(t => t.estado === Estado.EN_PROGRESO)
  );
  completadasTasks = computed(() =>
    this.tasks().filter(t => t.estado === Estado.COMPLETADA)
  );
  filteredTasks = computed(() => {
    const estado = this.selectedEstado();
    if (!estado) return this.tasks();
    return this.tasks().filter(t => t.estado === estado);
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.listTasks().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  iniciarTarea(id: number): void {
    this.taskService.iniciarTarea(id).subscribe({
      next: () => {
        this.toastService.success('Tarea iniciada correctamente');
      }
    });
  }

  completarTarea(id: number): void {
    this.taskService.completarTarea(id).subscribe({
      next: () => {
        this.toastService.success('Tarea completada correctamente');
      }
    });
  }

  getEstadoLabel(estado: Estado): string {
    switch (estado) {
      case Estado.PENDIENTE: return 'Pendiente';
      case Estado.EN_PROGRESO: return 'En Progreso';
      case Estado.COMPLETADA: return 'Completada';
      default: return estado;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
