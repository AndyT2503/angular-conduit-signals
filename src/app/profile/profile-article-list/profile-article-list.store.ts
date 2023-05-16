import { ViewportScroller } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { OnStoreInit, tapResponse } from '@ngrx/component-store';
import { defer, exhaustMap, switchMap, tap } from 'rxjs';
import { Article } from 'src/app/shared/models';
import { ArticleService } from 'src/app/shared/services';
import { ComponentStoreWithSelectors } from 'src/app/shared/utils';
import { ArticleType, ARTICLE_TYPE } from './profile-article-list.di';

interface ProfileArticleListState {
  articleList: Article[];
  articleCount: number;
  articleType: ArticleType;
  username: string;
  currentOffset: number;
}

@Injectable()
export class ProfileArticleListStore
  extends ComponentStoreWithSelectors<ProfileArticleListState>
  implements OnStoreInit
{
  static PAGE_LIMIT = 5;
  readonly #articleService = inject(ArticleService);
  readonly #viewPort = inject(ViewportScroller);
  ngrxOnStoreInit(): void {
    this.setState({
      articleCount: 0,
      articleList: [],
      articleType: ARTICLE_TYPE.MyArticle,
      currentOffset: 0,
      username: '',
    });
  }

  readonly getArticle = this.effect<{
    username: string;
    articleType: ArticleType;
    offset: number;
  }>(
    tap((request) => {
      this.patchState({
        username: request.username,
        articleType: request.articleType,
        currentOffset: request.offset,
      });
      this.#viewPort.scrollToPosition([0, 0]);
      this.#refreshPage();
    })
  );

  readonly #refreshPage = this.effect<void>(
    switchMap(() => {
      const filterParams =
        this.selectors.articleType() === ARTICLE_TYPE.MyArticle
          ? {
              author: this.selectors.username(),
            }
          : {
              favorited: this.selectors.username(),
            };
      return this.#articleService
        .getArticleGlobal({
          offset: this.selectors.currentOffset(),
          limit: ProfileArticleListStore.PAGE_LIMIT,
          ...filterParams,
        })
        .pipe(
          tapResponse(
            (response) => {
              this.patchState({
                articleCount: response.articlesCount,
                articleList: response.articles,
              });
            },
            (error) => {
              console.error('Get Article Failed', error);
            }
          )
        );
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
}
