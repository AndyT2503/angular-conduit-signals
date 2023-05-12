import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AUTH_MENU, NON_AUTH_MENU } from 'src/app/shared/constants';
import { AuthStore } from 'src/app/shared/store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgFor, RouterLinkActive, NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly #authStore = inject(AuthStore);
  readonly menu = computed(() => {
    if (this.#authStore.selectors.isAuthenticated()) {
      return AUTH_MENU;
    } else {
      return NON_AUTH_MENU;
    }
  });
  readonly currentUser = this.#authStore.selectors.user;
}
