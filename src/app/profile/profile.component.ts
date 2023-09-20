import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { AuthStore } from '../shared/store';
import { ProfileStore } from './profile.store';
import { ArticleToggleComponent } from './ui/article-toggle/article-toggle.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, RouterOutlet, ArticleToggleComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(ProfileStore)],
})
export default class ProfileComponent {
  readonly #profileStore = inject(ProfileStore);
  readonly #authStore = inject(AuthStore);
  readonly #router = inject(Router);
  readonly profile = this.#profileStore.selectors.profile;
  readonly isCurrentUser = computed(
    () =>
      this.#authStore.selectors.user()?.username === this.profile()?.username
  );
  @Input() set username(value: string) {
    this.#profileStore.getProfile(value);
  }

  toggleFollow(): void {
    if (!this.#authStore.selectors.isAuthenticated()) {
      this.#router.navigate(['/register']);
      return;
    }
    this.#profileStore.toggleFollow(this.profile()!);
  }
}
