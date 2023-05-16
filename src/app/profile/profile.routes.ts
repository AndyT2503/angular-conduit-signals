import { Routes } from '@angular/router';
import {
  ARTICLE_TYPE,
  provideArticleType,
} from './profile-article-list/profile-article-list.di';

const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile.component'),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./profile-article-list/profile-article-list.component'),
        providers: [provideArticleType(ARTICLE_TYPE.MyArticle)],
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./profile-article-list/profile-article-list.component'),
        providers: [provideArticleType(ARTICLE_TYPE.FavoritedArticle)],
      },
    ],
  },
];

export default profileRoutes;
