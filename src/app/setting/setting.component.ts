import {
  ChangeDetectionStrategy,
  Component, effect, inject, OnInit
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpdateCurrentUserBodyRequest } from '../shared/services';
import { AuthStore } from '../shared/store';
import { TypedFormGroup } from '../shared/utils';
@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingComponent implements OnInit {
  readonly #authStore = inject(AuthStore);
  readonly settingForm: TypedFormGroup<UpdateCurrentUserBodyRequest> =
    new FormGroup({
      bio: new FormControl('', {
        nonNullable: true,
      }),
      email: new FormControl('', {
        nonNullable: true,
      }),
      password: new FormControl('', {
        nonNullable: true,
      }),
      username: new FormControl('', {
        nonNullable: true,
      }),
      image: new FormControl('', {
        nonNullable: true,
      }),
    });

  constructor() {
    effect(() => {
      const user = this.#authStore.selectors.user();
      if (user) {
        this.settingForm.patchValue(user);
      }
    });
  }

  ngOnInit(): void {
    this.#authStore.getCurrentUser();
  }

  submit(): void {
    this.#authStore.updateCurrentUser(this.settingForm);
  }

  logout(): void {
    this.#authStore.logout();
  }
}
