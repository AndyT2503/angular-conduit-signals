import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { createInjectionToken } from './shared/utils';
import { apiPrefixInterceptor } from './shared/interceptors';

export interface EnvironmentConfig {
  apiUrl: string;
}

export const [injectEnvironmentConfig, provideEnvironmentConfig] =
  createInjectionToken<EnvironmentConfig>('EnvironmentConfig');

export const initAppConfig = (config: EnvironmentConfig): ApplicationConfig => {
  return {
    providers: [
      provideRouter(routes),
      provideEnvironmentConfig(config),
      provideHttpClient(withInterceptors([apiPrefixInterceptor])),
    ],
  };
};
