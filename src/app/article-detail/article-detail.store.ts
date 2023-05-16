import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OnStoreInit, tapResponse } from '@ngrx/component-store';
import { defer, exhaustMap, switchMap } from 'rxjs';
import { Article, Comment } from '../shared/models';
import {
  ArticleService,
  InsertCommentBodyRequest,
  ProfileService
} from '../shared/services';
import { ComponentStoreWithSelectors } from '../shared/utils';

interface ArticleDetailState {
  article: Article | null;
  comments: Comment[];
}

@Injectable()
export class ArticleDetailStore
  extends ComponentStoreWithSelectors<ArticleDetailState>
  implements OnStoreInit
{
  readonly #profileService = inject(ProfileService);
  readonly #articleService = inject(ArticleService);
  readonly #router = inject(Router);
  readonly #title = inject(Title);
  ngrxOnStoreInit(): void {
    this.setState({
      article: null,
      comments: [],
    });
  }

  readonly getArticleDetail = this.effect<string>(
    switchMap((slug) =>
      this.#articleService.getArticleDetail(slug).pipe(
        tapResponse(
          (response) => {
            this.#title.setTitle(`${response.article.title} - Conduit`);
            this.patchState({
              article: response.article,
            });
          },
          (error) => {
            console.error('Get Article Detail Failed', error);
            this.#router.navigate(['/']);
          }
        )
      )
    )
  );

  readonly getArticleComments = this.effect<string>(
    switchMap((slug) =>
      this.#articleService.getCommentsForArticle(slug).pipe(
        tapResponse(
          (response) => {
            this.patchState({
              comments: response.comments,
            });
          },
          (error) => {
            console.error('Get Article Comments Failed', error);
          }
        )
      )
    )
  );

  readonly createComment = this.effect<{
    slug: string;
    comment: InsertCommentBodyRequest;
  }>(
    switchMap((request) =>
      this.#articleService
        .createCommentForArticle(request.slug, request.comment)
        .pipe(
          tapResponse(
            () => {
              this.getArticleComments(request.slug);
            },
            (error) => {
              console.error('Create Comment Failed', error);
            }
          )
        )
    )
  );

  readonly deleteComment = this.effect<{
    slug: string;
    commentId: string;
  }>(
    exhaustMap((request) =>
      this.#articleService
        .deleteCommentForArticle(request.slug, request.commentId)
        .pipe(
          tapResponse(
            () => {
              this.getArticleComments(request.slug);
            },
            (error) => {
              console.error('Create Comment Failed', error);
            }
          )
        )
    )
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
            this.getArticleDetail(article.slug);
          },
          (error) => {
            console.error('Toggle Favorite Failed', error);
          }
        )
      )
    )
  );

  readonly deleteArticle = this.effect<string>(
    exhaustMap((slug) =>
      this.#articleService.deleteArticle(slug).pipe(
        tapResponse(
          () => {
            this.#router.navigate(['/']);
          },
          (error) => {
            console.error('Delete Article Failed', error);
          }
        )
      )
    )
  );

  readonly toggleFollow = this.effect<Article>(
    exhaustMap((article) =>
      defer(() => {
        if (article.author.following) {
          return this.#profileService.unfollowUser(article.author.username);
        } else {
          return this.#profileService.followUser(article.author.username);
        }
      }).pipe(
        tapResponse(
          () => {
            this.getArticleDetail(article.slug);
          },
          (error) => {
            console.error('Toggle Follow User Failed', error);
          }
        )
      )
    )
  );
}
