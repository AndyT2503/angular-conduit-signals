import { ApplicationConfig } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withHashLocation,
  withPreloading,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { createInjectionToken } from './shared/utils';
import { apiPrefixInterceptor } from './shared/interceptors';
import { provideComponentStore } from '@ngrx/component-store';
import { AuthStore } from './shared/store';

export interface EnvironmentConfig {
  apiUrl: string;
}

export const [injectEnvironmentConfig, provideEnvironmentConfig] =
  createInjectionToken<EnvironmentConfig>('EnvironmentConfig');

export const initAppConfig = (config: EnvironmentConfig): ApplicationConfig => {
  return {
    providers: [
      provideComponentStore(AuthStore),
      provideRouter(
        routes,
        withHashLocation(),
        withPreloading(PreloadAllModules)
      ),
      provideEnvironmentConfig(config),
      provideHttpClient(withInterceptors([apiPrefixInterceptor])),
    ],
  };
};
