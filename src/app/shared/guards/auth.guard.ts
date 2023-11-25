import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthStore } from '../store';

export const authGuard: CanMatchFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return authStore
    .select((x) => x.isAuthenticated)
    .pipe(
      map((isAuth) => isAuth || router.createUrlTree(['/login'])),
      take(1)
    );
};
