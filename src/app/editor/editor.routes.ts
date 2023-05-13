import { Routes } from '@angular/router';

const editorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./new-article/new-article.component'),
  },
  {
    path: ':slug',
    loadComponent: () => import('./edit-article/edit-article.component'),
  },
];

export default editorRoutes;
