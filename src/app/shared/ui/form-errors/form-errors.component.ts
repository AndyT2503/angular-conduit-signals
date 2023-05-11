import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormErrorsService } from './form-errors.service';

@Component({
  selector: 'app-form-errors',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorsComponent {
  readonly formErrors = inject(FormErrorsService).formErrors;
}
