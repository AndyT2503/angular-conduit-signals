import { computed, Injectable, signal } from '@angular/core';
import { ErrorResponse } from '../../models';

@Injectable()
export class FormErrorsService {
  readonly #errorResponse = signal<ErrorResponse | null>(null);
  readonly formErrors = computed(() =>
    this.#handleErrorResponse(this.#errorResponse())
  );
  readonly setErrors = this.#errorResponse.set.bind(this.#errorResponse);

  #handleErrorResponse(error: ErrorResponse | null): string[] | null {
    if (!error) {
      return null;
    }
    const errors: string[] = [];
    Object.entries(error.errors).forEach(([key, value]) => {
      errors.push(...value.map((error) => `${key} ${error}`));
    });
    return errors;
  }
}
