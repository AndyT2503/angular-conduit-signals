import {
  HttpHandlerFn, HttpInterceptorFn, HttpRequest
} from '@angular/common/http';
import { injectEnvironmentConfig } from 'src/app/app.config';

export const apiPrefixInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  const env = injectEnvironmentConfig();
  if (!req.url.includes('http')) {
    const reqClone = req.clone({
      url: `${env.apiUrl}${req.url}`,
    });
    return next(reqClone);
  }
  return next(req);
};
