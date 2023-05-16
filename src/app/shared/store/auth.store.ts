import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OnStoreInit, tapResponse } from '@ngrx/component-store';
import { switchMap, tap } from 'rxjs';
import { STORAGE_KEY } from '../constants';
import { ErrorResponse, User, UserAPIResponse } from '../models';
import {
  LoginBodyRequest,
  RegisterBodyRequest,
  UpdateCurrentUserBodyRequest,
  UserAndAuthenticationService,
} from '../services';
import {
  ComponentStoreWithSelectors,
  LocalStorageService,
  TypedFormGroup,
} from '../utils';
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

  readonly #handleLoginAndRegisterRequest = (form: FormGroup) => ({
    next: (res: UserAPIResponse) => {
      this.#localStorage.setItem(STORAGE_KEY.user, res.user);
      this.patchState({
        user: res.user,
        isAuthenticated: true,
      });
      if (this.selectors.errorResponse()) {
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
    finalize: () => {
      form.enable();
    },
  });

  readonly login = this.effect<TypedFormGroup<LoginBodyRequest>>(
    switchMap((form) => {
      form.disable();
      return this.#authService
        .login(form.getRawValue())
        .pipe(tapResponse(this.#handleLoginAndRegisterRequest(form)));
    })
  );

  readonly register = this.effect<TypedFormGroup<RegisterBodyRequest>>(
    switchMap((form) => {
      form.disable();
      return this.#authService
        .register(form.getRawValue())
        .pipe(tapResponse(this.#handleLoginAndRegisterRequest(form)));
    })
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

  readonly getCurrentUser = this.effect<void>(
    switchMap(() =>
      this.#authService.getCurrentUser().pipe(
        tapResponse(
          (res) => {
            this.#localStorage.setItem(STORAGE_KEY.user, res.user);
            this.patchState({
              user: res.user,
            });
          },
          (error) => {
            console.error('Get Current User Failed', error);
            this.logout();
          }
        )
      )
    )
  );

  readonly updateCurrentUser = this.effect<
    TypedFormGroup<UpdateCurrentUserBodyRequest>
  >(
    switchMap((form) => {
      form.disable();
      return this.#authService.updateCurrentUser(form.getRawValue()).pipe(
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
          finalize: () => {
            form.enable();
          },
        })
      );
    })
  );

  readonly resetErrorResponse = this.updater((state) => ({
    ...state,
    errorResponse: null,
  }));
}
