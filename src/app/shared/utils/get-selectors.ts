import { Signal } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
export type StoreState<TStore> = TStore extends ComponentStore<infer TState>
  ? TState
  : {};

export type StoreSelectors<TStore, TState = StoreState<TStore>> = {
  [TSelectorKey in keyof TState]: Signal<TState[TSelectorKey]>;
};

export function getSelectors<TStore extends ComponentStore<any>>(
  store: TStore
): StoreSelectors<TStore> {
  return new Proxy({} as StoreSelectors<TStore>, {
    get(target, p, receiver) {
      const prop = p as string & keyof StoreSelectors<TStore>;
      if (!!target[prop]) {
        return Reflect.get(target, p, receiver);
      }
      target[prop] = store.selectSignal(
        (s) => s[prop]
      ) as StoreSelectors<TStore>[string & keyof StoreSelectors<TStore>];
      return target[prop];
    },
  });
}

export class ComponentStoreWithSelectors<
  TState extends object
> extends ComponentStore<TState> {
  readonly selectors = getSelectors<ComponentStore<TState>>(this);
}
