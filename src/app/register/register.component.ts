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
import { RegisterBodyRequest } from '../shared/services';
import { AuthStore } from '../shared/store';
import { FormErrorsComponent } from '../shared/ui/form-errors';
import { TypedFormGroup } from '../shared/utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorsComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent implements OnDestroy {
  readonly #authStore = inject(AuthStore);
  readonly errorResponse = this.#authStore.selectors.errorResponse;
  readonly registerForm: TypedFormGroup<RegisterBodyRequest> = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
    }),
    username: new FormControl('', {
      nonNullable: true,
    }),
  });

  register(): void {
    this.#authStore.register(this.registerForm);
  }

  ngOnDestroy(): void {
    this.#authStore.resetErrorResponse();
  }
}
