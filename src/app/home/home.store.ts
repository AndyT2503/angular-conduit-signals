import { ViewportScroller } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Observable, defer, exhaustMap, switchMap, tap } from 'rxjs';
import { DEFAULT_LIMIT } from '../shared/constants';
import { Article, ArticlePagingAPIResponse } from '../shared/models';
import { ArticleGlobalQueryParams, ArticleService } from '../shared/services';
import { TagService } from '../shared/services/tag.service';
import { ComponentStoreWithSelectors, ObjectValues } from '../shared/utils';

export const FEED_TYPE = {
  yourFeed: 'Your Feed',
  globalFeed: 'Global Feed',
  tagFeed: 'Tag Feed',
} as const;

export type FeedType = ObjectValues<typeof FEED_TYPE>;

interface HomeState {
  tags: string[];
  articleList: Article[];
  articleCount: number;
  feedTypeSelected: string | null;
  tagSelected: string | null;
  currentOffset: number;
  currentLimit: number;
}

@Injectable()
export class HomeStore
  extends ComponentStoreWithSelectors<HomeState>
  implements OnStoreInit
{
  readonly #articleService = inject(ArticleService);
  readonly #tagService = inject(TagService);
  readonly #viewPort = inject(ViewportScroller);
  ngrxOnStoreInit() {
    this.setState({
      articleList: [],
      tags: [],
      articleCount: 0,
      feedTypeSelected: null,
      tagSelected: null,
      currentOffset: 0,
      currentLimit: DEFAULT_LIMIT,
    });
  }

  readonly getTags = this.effect<void>(
    switchMap(() =>
      this.#tagService.getTags().pipe(
        tapResponse(
          (res) => {
            this.patchState({
              tags: res.tags,
            });
          },
          (error) => {
            console.error('Get Tags Failed', error);
          }
        )
      )
    )
  );

  readonly queryArticle = this.effect<{
    feedType: FeedType;
    params: ArticleGlobalQueryParams;
  }>(
    tap((request) => {
      this.patchState({
        currentOffset: request.params.offset,
        feedTypeSelected: request.feedType,
        tagSelected:
          request.feedType === FEED_TYPE.tagFeed ? request.params.tag : null,
        currentLimit: request.params.limit,
      });
      this.#refreshPage();
    })
  );

  readonly onOffsetChange = this.effect<number>(
    tap((offset) => {
      this.patchState({
        currentOffset: offset,
      });
      this.#viewPort.scrollToPosition([0, 0]);
      this.#refreshPage();
    })
  );

  readonly toggleFavorite = this.effect<Article>(
    exhaustMap((article) =>
      defer(() => {
        if (article.favorited) {
          return this.#articleService.unfavoriteArticle(article.slug);
        } else {
          return this.#articleService.favoriteArticle(article.slug);
        }
      }).pipe(
        tapResponse(
          () => {
            this.#refreshPage();
          },
          (error) => {
            console.error('Toggle Favorite Failed', error);
          }
        )
      )
    )
  );

  readonly #refreshPage = this.effect<void>(
    switchMap(() => {
      return this.#loadArticle().pipe(
        tapResponse(
          (response) => {
            this.patchState({
              articleList: response.articles,
              articleCount: response.articlesCount,
            });
          },
          (error) => {
            console.error('Get Article Failed', error);
          }
        )
      );
    })
  );

  #loadArticle(): Observable<ArticlePagingAPIResponse> {
    switch (this.selectors.feedTypeSelected()) {
      case FEED_TYPE.tagFeed:
        return this.#articleService.getArticleGlobal({
          limit: this.selectors.currentLimit(),
          offset: this.selectors.currentOffset(),
          tag: this.selectors.tagSelected()!,
        });
      case FEED_TYPE.globalFeed:
        return this.#articleService.getArticleGlobal({
          limit: this.selectors.currentLimit(),
          offset: this.selectors.currentOffset(),
        });
      default:
        return this.#articleService.getFeed({
          limit: this.selectors.currentLimit(),
          offset: this.selectors.currentOffset(),
        });
    }
  }
}
