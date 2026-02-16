import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ToastService } from '../../../core/services/toast.service';
import { Estado, Tarea } from '../../../core/models/tarea.models';

@Component({
  selector: 'app-admin-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Admin Controls -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
          <button
            (click)="loadAllTasks()"
            [class.btn-primary]="selectedEstado() === null"
            [class.btn-outline]="selectedEstado() !== null"
            class="btn whitespace-nowrap text-sm">
            Todas
          </button>
          <button
            (click)="loadTasksByEstado(Estado.PENDIENTE)"
            [class.btn-primary]="selectedEstado() === Estado.PENDIENTE"
            [class.btn-outline]="selectedEstado() !== Estado.PENDIENTE"
            class="btn whitespace-nowrap text-sm">
            Pendientes
          </button>
          <button
            (click)="loadTasksByEstado(Estado.EN_PROGRESO)"
            [class.btn-primary]="selectedEstado() === Estado.EN_PROGRESO"
            [class.btn-outline]="selectedEstado() !== Estado.EN_PROGRESO"
            class="btn whitespace-nowrap text-sm">
            En Progreso
          </button>
          <button
            (click)="loadTasksByEstado(Estado.COMPLETADA)"
            [class.btn-primary]="selectedEstado() === Estado.COMPLETADA"
            [class.btn-outline]="selectedEstado() !== Estado.COMPLETADA"
            class="btn whitespace-nowrap text-sm">
            Completadas
          </button>
        </div>

        <a routerLink="/admin/tasks/new" class="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Nueva Tarea
        </a>
      </div>

      <!-- Tasks Table -->
      <div class="glass rounded-xl overflow-hidden shadow-lg overflow-x-auto">
        @if (isLoading()) {
          <div class="flex justify-center items-center py-24">
            <svg class="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        } @else if (tasks().length === 0) {
          <div class="text-center py-24">
            <p class="text-slate-500 dark:text-slate-400">No se encontraron tareas con este criterio.</p>
          </div>
        } @else {
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">ID</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Título</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Usuario</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Estado</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Vencimiento</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              @for (task of tasks(); track task.id) {
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">#{{ task.id }}</td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ task.titulo }}</div>
                    <div class="text-xs text-slate-500 truncate max-w-xs">{{ task.descripcion }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    ID: {{ task.idUsuario }}
                  </td>
                  <td class="px-6 py-4">
                    <span 
                      class="px-2 py-1 text-[10px] font-bold uppercase rounded-full"
                      [ngClass]="{
                        'bg-warning-100 text-warning-700': task.estado === Estado.PENDIENTE,
                        'bg-primary-100 text-primary-700': task.estado === Estado.EN_PROGRESO,
                        'bg-success-100 text-success-700': task.estado === Estado.COMPLETADA
                      }">
                      {{ task.estado }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {{ formatDate(task.fechaVencimiento) }}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      @if (task.estado === Estado.PENDIENTE) {
                        <button 
                          (click)="iniciarTarea(task.id)"
                          class="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                          title="Iniciar">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </button>
                      } @else if (task.estado === Estado.EN_PROGRESO) {
                        <button 
                          (click)="completarTarea(task.id)"
                          class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Completar">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </button>
                      }
                      <a 
                        [routerLink]="['/admin/tasks', task.id]"
                        class="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Ver detalle">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </a>
                      <a 
                        [routerLink]="['/admin/tasks', task.id, 'edit']"
                        class="p-2 text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                        title="Editar">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L11.75 16.25l-4.5 1.5 1.5-4.5L16.5 3.5z"></path>
                        </svg>
                      </a>
                      <button 
                        (click)="deleteTask(task.id)"
                        class="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                        title="Eliminar">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
  styles: []
})
export class AdminTaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private toastService = inject(ToastService);

  Estado = Estado;
  tasks = this.taskService.tasks;
  isLoading = signal(false);
  selectedEstado = signal<Estado | null>(null);

  ngOnInit(): void {
    this.loadAllTasks();
  }

  loadAllTasks(): void {
    this.selectedEstado.set(null);
    this.isLoading.set(true);
    this.taskService.listTasks().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  loadTasksByEstado(estado: Estado): void {
    this.selectedEstado.set(estado);
    this.isLoading.set(true);
    this.taskService.getTasksByEstado(estado).subscribe({
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

  deleteTask(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.toastService.success('Tarea eliminada exitosamente');
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
