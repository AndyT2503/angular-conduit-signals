import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OnStoreInit, tapResponse } from '@ngrx/component-store';
import { switchMap } from 'rxjs';
import { ErrorResponse, User } from '../models';
import {
  LoginRequest,
  RegisterRequest,
  UserAndAuthenticationService,
} from '../services';
import { ComponentStoreWithSelectors } from '../utils';
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

  ngrxOnStoreInit(): void {
    this.setState({
      isAuthenticated: false,
      user: null,
      errorResponse: null,
    });
  }

  readonly #handleLoginAndRegisterRequest = {
    next: (user: User) => {
      this.patchState({
        user,
        isAuthenticated: true,
        errorResponse: null,
      });
    },
    error: (err: HttpErrorResponse) => {
      console.log(err.error)
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
}
