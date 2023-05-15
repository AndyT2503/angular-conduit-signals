import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OnStoreInit, tapResponse } from '@ngrx/component-store';
import { switchMap } from 'rxjs';
import { Article, Comment } from '../shared/models';
import { ArticleService, InsertCommentBodyRequest } from '../shared/services';
import { ComponentStoreWithSelectors } from '../shared/utils';

interface ArticleDetailState {
  article: Article;
  comments: Comment[];
}

@Injectable()
export class ArticleDetailStore
  extends ComponentStoreWithSelectors<ArticleDetailState>
  implements OnStoreInit
{
  readonly #articleService = inject(ArticleService);
  readonly #router = inject(Router);
  ngrxOnStoreInit(): void {
    this.setState({
      article: {} as Article,
      comments: [],
    });
  }

  readonly getArticleDetail = this.effect<string>(
    switchMap((slug) =>
      this.#articleService.getArticleDetail(slug).pipe(
        tapResponse(
          (response) => {
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
    switchMap((request) =>
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
}
