import { NgClass, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  Signal,
  computed,
  inject,
} from '@angular/core';
import { AuthStore } from 'src/app/shared/store';
import { FEED_TYPE, FeedType, HomeStore } from '../../home.store';

interface TabItem {
  title: string;
  feedType: FeedType;
}

@Component({
  selector: 'app-feed-toggle',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './feed-toggle.component.html',
  styleUrls: ['./feed-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedToggleComponent {
  readonly #authStore = inject(AuthStore);
  readonly #homeStore = inject(HomeStore);
  readonly feedTypeSelected = this.#homeStore.selectors.feedTypeSelected;
  readonly tabList: Signal<TabItem[]> = computed(() => {
    if (!this.#authStore.selectors.isAuthenticated()) {
      return [
        {
          title: 'Global Feed',
          feedType: FEED_TYPE.globalFeed,
        },
      ];
    }
    const authTabList: TabItem[] = [
      {
        title: 'Your Feed',
        feedType: FEED_TYPE.yourFeed,
      },
      {
        title: 'Global Feed',
        feedType: FEED_TYPE.globalFeed,
      },
    ];
    return this.feedTypeSelected() &&
      this.feedTypeSelected() !== FEED_TYPE.globalFeed &&
      this.feedTypeSelected() !== FEED_TYPE.yourFeed
      ? [
          ...authTabList,
          {
            title: `#${this.#homeStore.selectors.tagSelected()}`,
            feedType: FEED_TYPE.tagFeed,
          },
        ]
      : authTabList;
  });
  @Output() toggleFeed = new EventEmitter<FeedType>();

  onToggleFeed(value: FeedType): void {
    if (this.feedTypeSelected() === value) {
      return;
    }
    this.toggleFeed.emit(value);
  }
}
