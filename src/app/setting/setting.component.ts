import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpdateProfileRequest } from '../shared/services';
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
  readonly settingForm: TypedFormGroup<UpdateProfileRequest> = new FormGroup({
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

  ngOnInit(): void {
    const currentUser = this.#authStore.selectors.user();
    if (!currentUser) {
      this.#authStore.logout();
      return;
    }
    this.settingForm.patchValue(currentUser);
  }

  submit(): void {
    this.#authStore.updateProfile(this.settingForm.getRawValue());
  }

  logout(): void {
    this.#authStore.logout();
  }
}
