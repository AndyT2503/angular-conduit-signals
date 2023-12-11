import { Routes, UrlSegment } from '@angular/router';
import { authGuard, nonAuthGuard } from './shared/guards';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'Sign in',
    canMatch: [nonAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component'),
    title: 'Sign up',
    canMatch: [nonAuthGuard],
  },
  {
    path: 'editor',
    loadChildren: () => import('./editor/editor.routes'),
    canMatch: [authGuard],
    title: 'Editor',
  },
  {
    path: 'settings',
    loadComponent: () => import('./setting/setting.component'),
    canMatch: [authGuard],
    title: 'Settings',
  },
  {
    path: 'article/:slug',
    loadComponent: () => import('./article-detail/article-detail.component'),
  },
  {
    matcher: (url) => {
      if (url.length >= 1 && url[0].path.startsWith('@')) {
        return {
          consumed: [url[0]],
          posParams: {
            username: new UrlSegment(url[0].path.slice(1), {}),
          },
        };
      }
      return null;
    },
    loadComponent: () => import('./profile/profile.component'),
    loadChildren: () => import('./profile/profile.routes'),
  },
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    title: 'Home',
  },
];
