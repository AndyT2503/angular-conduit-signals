import {
  inject,
  InjectionToken,
  InjectOptions,
  Provider,
  Type,
} from '@angular/core';

export interface InjectFn<T> {
  (): T;

  (options: InjectOptions & { optional?: false }): T;

  (options: InjectOptions & { optional?: true }): T | null;
}

export interface ProvideFn<T> {
  (value: T): Provider;

  (deps: Array<Type<any>>, factory: (...args: any[]) => T): Provider;
}

export type InjectionTokenCreatorReturn<T> = [
  InjectFn<T>,
  ProvideFn<T>,
  InjectionToken<T>
];

export function createInjectionToken<T>(
  description: string,
  options?: {
    providedIn?: Type<any> | 'root' | 'platform' | 'any' | null | undefined;
    factory: () => T;
  }
): InjectionTokenCreatorReturn<T> {
  const token = new InjectionToken<T>(description, options);

  function provideFn(
    valueOrDeps: T | Array<Type<any>>,
    factory?: (...args: any[]) => T
  ) {
    if (factory) {
      return {
        provide: token,
        useFactory: factory,
        deps: valueOrDeps as Array<Type<any>>,
      };
    }

    return { provide: token, useValue: valueOrDeps as T };
  }

  function injectFn(options: InjectOptions = {}) {
    return inject(token, options);
  }

  return [injectFn as InjectFn<T>, provideFn, token];
}
