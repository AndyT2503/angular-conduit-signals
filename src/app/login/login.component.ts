import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { LoginRequest } from '../shared/services';
import { AuthStore } from '../shared/store';
import { FormErrorsComponent, FormErrorsStore } from '../shared/ui/form-errors';
import { TypedFormGroup } from '../shared/utils';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormErrorsComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(FormErrorsStore)],
})
export default class LoginComponent implements OnInit {
  readonly #formErrorsStore = inject(FormErrorsStore);
  readonly #authStore = inject(AuthStore);
  readonly #errorResponseChange$ = toObservable(
    this.#authStore.selectors.errorResponse
  ).pipe(takeUntilDestroyed());
  readonly loginForm: TypedFormGroup<LoginRequest> = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.#handleErrorResponse();
  }

  #handleErrorResponse(): void {
    this.#errorResponseChange$.subscribe((error) => {
      this.#formErrorsStore.updateFormErrors(error);
    });
  }

  login(): void {
    this.#authStore.login(this.loginForm.getRawValue());
  }
}
