import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { createInjectionToken } from './shared/utils';
import { apiPrefixInterceptor } from './shared/interceptors';
import { provideComponentStore } from '@ngrx/component-store';
import { AuthStore } from './shared/state';

export interface EnvironmentConfig {
  apiUrl: string;
}

export const [injectEnvironmentConfig, provideEnvironmentConfig] =
  createInjectionToken<EnvironmentConfig>('EnvironmentConfig');

export const initAppConfig = (config: EnvironmentConfig): ApplicationConfig => {
  return {
    providers: [
      provideComponentStore(AuthStore),
      provideRouter(routes, withHashLocation()),
      provideEnvironmentConfig(config),
      provideHttpClient(withInterceptors([apiPrefixInterceptor])),
    ],
  };
};
