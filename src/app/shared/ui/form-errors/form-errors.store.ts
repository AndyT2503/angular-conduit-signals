import { Injectable } from '@angular/core';
import { OnStoreInit } from '@ngrx/component-store';
import { tap } from 'rxjs';
import { ErrorResponse } from '../../models';
import { ComponentStoreWithSelectors } from '../../utils';

interface FormErrorsState {
  formErrors: string[] | null;
}

@Injectable()
export class FormErrorsStore
  extends ComponentStoreWithSelectors<FormErrorsState>
  implements OnStoreInit
{
  ngrxOnStoreInit(): void {
    this.setState({
      formErrors: null,
    });
  }

  readonly updateFormErrors = this.effect<ErrorResponse | null>(
    tap((error) => {
      this.patchState({
        formErrors: this.#handleErrorResponse(error),
      });
    })
  );

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
