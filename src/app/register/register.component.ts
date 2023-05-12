import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { RegisterRequest } from '../shared/services';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthStore } from '../shared/store';
import { FormErrorsComponent, FormErrorsStore } from '../shared/ui/form-errors';
import { TypedFormGroup } from '../shared/utils';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorsComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(FormErrorsStore)]
})
export default class RegisterComponent {
  readonly #formErrorsStore = inject(FormErrorsStore);
  readonly #authStore = inject(AuthStore);
  readonly #errorResponseChange$ = toObservable(
    this.#authStore.selectors.errorResponse
  ).pipe(takeUntilDestroyed());
  readonly registerForm: TypedFormGroup<RegisterRequest> = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
    }),
    username: new FormControl('', {
      nonNullable: true
    })
  });

  ngOnInit(): void {
    this.#handleErrorResponse();
  }

  #handleErrorResponse(): void {
    this.#errorResponseChange$.subscribe((error) => {
      this.#formErrorsStore.updateFormErrors(error);
    });
  }

  register(): void {
    this.#authStore.register(this.registerForm.getRawValue());
  }
}
