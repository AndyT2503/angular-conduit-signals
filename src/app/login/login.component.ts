import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { LoginRequest } from '../shared/services';
import { AuthStore } from '../shared/state';
import {
  FormErrorsComponent,
  FormErrorsService,
} from '../shared/ui/form-errors';
import { TypedFormGroup } from '../shared/utils';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormErrorsComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormErrorsService],
})
export default class LoginComponent implements OnInit {
  readonly #formErrorService = inject(FormErrorsService);
  readonly #authStore = inject(AuthStore);
  readonly #errorResponseChange$ = toObservable(
    this.#authStore.selectors.errorResponse
  ).pipe(takeUntilDestroyed());
  readonly loginForm: TypedFormGroup<LoginRequest> = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
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
      this.#formErrorService.setErrors(error);
    });
  }

  login(): void {
    this.#authStore.login(this.loginForm.getRawValue());
  }
}
