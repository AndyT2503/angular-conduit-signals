import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpdateCurrentUserBodyRequest } from '../shared/services';
import { AuthStore } from '../shared/store';
import { TypedFormGroup } from '../shared/utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { User } from '../shared/models';
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
  readonly currentUser$ = this.#authStore
    .select((x) => x.user)
    .pipe(takeUntilDestroyed());

  ngOnInit(): void {
    this.#authStore.getCurrentUser();
    this.currentUser$
      .pipe(filter((user): user is User => !!user))
      .subscribe((currentUser) => this.settingForm.patchValue(currentUser));
  }

  submit(): void {
    this.#authStore.updateCurrentUser(this.settingForm);
  }

  logout(): void {
    this.#authStore.logout();
  }
}
