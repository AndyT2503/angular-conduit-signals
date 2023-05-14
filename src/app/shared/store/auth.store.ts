import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OnStoreInit, tapResponse } from '@ngrx/component-store';
import { switchMap, tap } from 'rxjs';
import { STORAGE_KEY } from '../constants';
import { ErrorResponse, User, UserAPIResponse } from '../models';
import {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
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
    const user = this.#localStorage.getItem<User>(STORAGE_KEY.user);
    this.setState({
      isAuthenticated: !!user,
      user: user,
      errorResponse: null,
    });
  }

  readonly #handleLoginAndRegisterRequest = {
    next: (res: UserAPIResponse) => {
      this.#localStorage.setItem(STORAGE_KEY.user, res.user);
      this.patchState({
        user: res.user,
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
      this.#localStorage.removeItem(STORAGE_KEY.user);
      this.patchState({
        isAuthenticated: false,
        user: null,
      });
      this.#router.navigate(['/login']);
    })
  );

  readonly updateProfile = this.effect<UpdateProfileRequest>(
    switchMap((request) =>
      this.#authService.updateUserProfile(request).pipe(
        tapResponse({
          next: (res) => {
            this.#localStorage.setItem(STORAGE_KEY.user, res.user);
            this.patchState({
              user: res.user,
            });
          },
          error: (error) => {
            console.error('error update', error);
          },
        })
      )
    )
  );
}
