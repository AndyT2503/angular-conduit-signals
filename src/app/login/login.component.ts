import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginBodyRequest } from '../shared/services';
import { AuthStore } from '../shared/store';
import { FormErrorsComponent } from '../shared/ui/form-errors';
import { TypedFormGroup } from '../shared/utils';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormErrorsComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent implements OnDestroy {
  readonly #authStore = inject(AuthStore);
  readonly errorResponse = this.#authStore.selectors.errorResponse;
  readonly loginForm: TypedFormGroup<LoginBodyRequest> = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
    }),
  });

  login(): void {
    this.#authStore.login(this.loginForm);
  }

  ngOnDestroy(): void {
    this.#authStore.resetErrorResponse();
  }
}
