import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex">
      <!-- Sidebar -->
      <aside 
        class="glass w-64 min-h-screen p-6 flex flex-col transition-all duration-300"
        [ngClass]="{ 'hidden md:flex': !sidebarOpen(), 'flex': sidebarOpen() }">
        
        <!-- Logo -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            DAW Task
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestión de Tareas</p>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-2">
          @if (authService.isAdmin()) {
            <!-- Admin Navigation -->
            <a 
              routerLink="/admin/tasks" 
              routerLinkActive="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <span class="font-medium">Todas las Tareas</span>
            </a>
            <a 
              routerLink="/admin/tasks/new" 
              routerLinkActive="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span class="font-medium">Nueva Tarea</span>
            </a>
          } @else {
            <!-- User Navigation -->
            <a 
              routerLink="/user/tasks" 
              routerLinkActive="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <span class="font-medium">Mis Tareas</span>
            </a>
            <a 
              routerLink="/user/tasks/new" 
              routerLinkActive="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span class="font-medium">Nueva Tarea</span>
            </a>
          }
        </nav>

        <!-- User info at bottom -->
        <div class="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
              {{ authService.currentUser()!.username.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {{ authService.currentUser()?.username }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ authService.isAdmin() ? 'Administrador' : 'Usuario' }}
              </p>
            </div>
          </div>
          <button 
            (click)="logout()"
            class="w-full btn-outline flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-h-screen">
        <!-- Header -->
        <header class="glass border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <!-- Mobile menu button -->
            <button 
              (click)="toggleSidebar()"
              class="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <div class="flex-1 md:flex-none">
              <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {{ getPageTitle() }}
              </h2>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-6 overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class LayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  sidebarOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  logout(): void {
    this.authService.logout();
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/tasks/new')) return 'Nueva Tarea';
    if (url.includes('/tasks/') && url.includes('/edit')) return 'Editar Tarea';
    if (url.includes('/tasks/')) return 'Detalle de Tarea';
    if (url.includes('/tasks')) return this.authService.isAdmin() ? 'Todas las Tareas' : 'Mis Tareas';
    return 'DAW Task';
  }
}
