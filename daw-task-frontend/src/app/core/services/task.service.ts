import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Tarea, CreateTareaDTO, UpdateTareaDTO, Estado } from '../models/tarea.models';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private readonly API_URL = 'http://localhost:8081';

    private http = inject(HttpClient);
    private authService = inject(AuthService);

    // Signal for task list
    private tasksSignal = signal<Tarea[]>([]);
    public tasks = this.tasksSignal.asReadonly();

    /**
     * Get appropriate endpoint based on user role
     */
    private getEndpoint(): string {
        return this.authService.isAdmin() ? `${this.API_URL}/admin/tareas` : `${this.API_URL}/user/tareas`;
    }

    /**
     * List all tasks (user or admin based on role)
     */
    listTasks() {
        return this.http.get<Tarea[]>(this.getEndpoint()).pipe(
            tap(tasks => this.tasksSignal.set(tasks))
        );
    }

    /**
     * Get task by ID
     */
    getTaskById(id: number) {
        return this.http.get<Tarea>(`${this.getEndpoint()}/${id}`);
    }

    /**
     * Create a new task
     */
    createTask(task: CreateTareaDTO) {
        return this.http.post<Tarea>(this.getEndpoint(), task).pipe(
            tap(newTask => {
                const currentTasks = this.tasksSignal();
                this.tasksSignal.set([...currentTasks, newTask]);
            })
        );
    }

    updateTask(id: number, task: UpdateTareaDTO) {
        const endpoint = `${this.getEndpoint()}/${id}`;

        return this.http.put<Tarea>(endpoint, task).pipe(
            tap(updatedTask => {
                const currentTasks = this.tasksSignal();
                const index = currentTasks.findIndex(t => t.id === id);
                if (index !== -1) {
                    const newTasks = [...currentTasks];
                    newTasks[index] = updatedTask;
                    this.tasksSignal.set(newTasks);
                }
            })
        );
    }

    /**
     * Delete a task (admin only)
     */
    deleteTask(id: number) {
        const endpoint = `${this.getEndpoint()}/${id}`;

        return this.http.delete(endpoint).pipe(
            tap(() => {
                const currentTasks = this.tasksSignal();
                this.tasksSignal.set(currentTasks.filter(t => t.id !== id));
            })
        );
    }

    /**
     * Mark task as in progress (iniciar)
     */
    iniciarTarea(id: number) {
        const endpoint = `${this.getEndpoint()}/${id}/iniciar`;
        return this.http.put<Tarea>(endpoint, {}).pipe(
            tap(updatedTask => {
                const currentTasks = this.tasksSignal();
                const index = currentTasks.findIndex(t => t.id === id);
                if (index !== -1) {
                    const newTasks = [...currentTasks];
                    newTasks[index] = updatedTask;
                    this.tasksSignal.set(newTasks);
                }
            })
        );
    }

    /**
     * Mark task as completed (completar)
     */
    completarTarea(id: number) {
        const endpoint = `${this.getEndpoint()}/${id}/completar`;
        return this.http.put<Tarea>(endpoint, {}).pipe(
            tap(updatedTask => {
                const currentTasks = this.tasksSignal();
                const index = currentTasks.findIndex(t => t.id === id);
                if (index !== -1) {
                    const newTasks = [...currentTasks];
                    newTasks[index] = updatedTask;
                    this.tasksSignal.set(newTasks);
                }
            })
        );
    }

    /**
     * Get tasks by estado (admin only - uses dedicated endpoints)
     */
    getTasksByEstado(estado: Estado) {
        let endpoint = '';
        switch (estado) {
            case Estado.PENDIENTE:
                endpoint = `${this.API_URL}/admin/tareas/pendientes`;
                break;
            case Estado.EN_PROGRESO:
                endpoint = `${this.API_URL}/admin/tareas/en-progreso`;
                break;
            case Estado.COMPLETADA:
                endpoint = `${this.API_URL}/admin/tareas/completadas`;
                break;
        }

        return this.http.get<Tarea[]>(endpoint).pipe(
            tap(tasks => this.tasksSignal.set(tasks))
        );
    }

    /**
     * Filter tasks by estado (client-side for users)
     */
    filterTasksByEstado(estado: Estado): Tarea[] {
        return this.tasksSignal().filter(task => task.estado === estado);
    }
}
