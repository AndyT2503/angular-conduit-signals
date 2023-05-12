import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OnStoreInit, tapResponse } from '@ngrx/component-store';
import { switchMap, tap } from 'rxjs';
import { StorageKey } from '../constants';
import { ErrorResponse, User } from '../models';
import {
  LoginRequest,
  RegisterRequest,
  UserAndAuthenticationService,
} from '../services';
import { ComponentStoreWithSelectors, LocalStorageService } from '../utils';
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  errorResponse: ErrorResponse | null;
}

@Injectable()
export class AuthStore
  extends ComponentStoreWithSelectors<AuthState>
  implements OnStoreInit
{
  readonly #authService = inject(UserAndAuthenticationService);
  readonly #localStorage = inject(LocalStorageService);
  readonly #router = inject(Router);
  ngrxOnStoreInit(): void {
    const user = this.#localStorage.getItem<User>(StorageKey.user);
    this.setState({
      isAuthenticated: !!user,
      user: user,
      errorResponse: null,
    });
  }

  readonly #handleLoginAndRegisterRequest = {
    next: (user: User) => {
      this.#localStorage.setItem(StorageKey.user, user);
      this.patchState({
        user,
        isAuthenticated: true,
      });
      if (!!this.selectors.errorResponse()) {
        this.patchState({
          errorResponse: null,
        });
      }
      this.#router.navigate(['/']);
    },
    error: (err: HttpErrorResponse) => {
      this.patchState({
        errorResponse: err.error,
      });
    },
  };

  readonly login = this.effect<LoginRequest>(
    switchMap((request) =>
      this.#authService
        .login(request)
        .pipe(tapResponse(this.#handleLoginAndRegisterRequest))
    )
  );

  readonly register = this.effect<RegisterRequest>(
    switchMap((request) =>
      this.#authService
        .register(request)
        .pipe(tapResponse(this.#handleLoginAndRegisterRequest))
    )
  );

  readonly logout = this.effect<void>(
    tap(() => {
      this.#localStorage.removeItem(StorageKey.user);
      this.patchState({
        isAuthenticated: false,
        user: null,
      });
      this.#router.navigate(['/login']);
    })
  );
}
