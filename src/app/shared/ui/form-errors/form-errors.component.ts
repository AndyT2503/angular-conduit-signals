import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal
} from '@angular/core';
import { ErrorResponse } from '../../models';

@Component({
  selector: 'app-form-errors',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorsComponent {
  formErrors = signal<string[] | null>(null);
  @Input({ required: true }) set errorResponse(error: ErrorResponse | null) {
    this.formErrors.set(this.#handleErrorResponse(error));
  }

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
