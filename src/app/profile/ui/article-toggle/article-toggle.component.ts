import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileStore } from '../../profile.store';

@Component({
  selector: 'app-article-toggle',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './article-toggle.component.html',
  styleUrls: ['./article-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleToggleComponent {
  readonly profile = inject(ProfileStore).selectors.profile;
  readonly tabList = computed(() => [
    {
      link: `/@${this.profile()!.username}`,
      title: 'My Articles',
    },
    {
      link: `/@${this.profile()!.username}/favorites`,
      title: 'Favorited Articles',
    },
  ]);
}
