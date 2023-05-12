import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthStore } from '../store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthStore).selectors.user()?.token;
  if (req.url.includes('/api/') && !req.headers.has('Authorization') && token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`,
      },
    });
  }
  return next(req);
};
