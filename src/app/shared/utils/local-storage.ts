import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { createInjectionToken } from './di';

export const [injectLocalStorage] = createInjectionToken('local storage', {
  factory: () => {
    const document = inject(DOCUMENT, { optional: true });

    if (document?.defaultView) {
      return document?.defaultView?.localStorage;
    }

    return null;
  },
});

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly ls = injectLocalStorage();

  getItem<TData = string>(
    key: string
  ): (TData extends object ? TData : string) | null {
    if (!this.ls) {
      return null;
    }

    const item = this.ls.getItem(key);

    if (!item) {
      return null;
    }

    try {
      const parsed = JSON.parse(item);
      if (typeof parsed === 'object') {
        return parsed;
      }

      return item as TData extends object ? TData : string;
    } catch (e) {
      return item as TData extends object ? TData : string;
    }
  }

  setItem(key: string, data: unknown): void {
    if (!this.ls) return;

    if (typeof data === 'object') {
      this.ls.setItem(key, JSON.stringify(data));
    } else {
      this.ls.setItem(key, data as string);
    }
  }

  removeItem(key: string) {
    if (this.ls) {
      this.ls.removeItem(key);
    }
  }
}
