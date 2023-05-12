import { Routes } from '@angular/router';
import { nonAuthGuard } from './shared/guards';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'Sign in',
    canMatch: [nonAuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component'),
    title: 'Sign up',
    canMatch: [nonAuthGuard]
  },
];
