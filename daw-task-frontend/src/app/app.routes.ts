import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'user/tasks', pathMatch: 'full' },

            // User Tasks
            {
                path: 'user/tasks',
                loadComponent: () => import('./features/user-tasks/user-task-list/user-task-list.component').then(m => m.UserTaskListComponent)
            },
            {
                path: 'user/tasks/new',
                loadComponent: () => import('./features/user-tasks/user-task-form/user-task-form.component').then(m => m.UserTaskFormComponent)
            },
            {
                path: 'user/tasks/:id',
                loadComponent: () => import('./features/user-tasks/user-task-detail/user-task-detail.component').then(m => m.UserTaskDetailComponent)
            },

            // Admin Tasks
            {
                path: 'admin/tasks',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/admin-tasks/admin-task-list/admin-task-list.component').then(m => m.AdminTaskListComponent)
            },
            {
                path: 'admin/tasks/new',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/admin-tasks/admin-task-form/admin-task-form.component').then(m => m.AdminTaskFormComponent)
            },
            {
                path: 'admin/tasks/:id',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/admin-tasks/admin-task-detail/admin-task-detail.component').then(m => m.AdminTaskDetailComponent)
            },
            {
                path: 'admin/tasks/:id/edit',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/admin-tasks/admin-task-form/admin-task-form.component').then(m => m.AdminTaskFormComponent)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
