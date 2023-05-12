import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormErrorsStore } from './form-errors.store';

@Component({
  selector: 'app-form-errors',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorsComponent {
  readonly formErrors = inject(FormErrorsStore).selectors.formErrors;
}
