import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Article,
  ArticleAPIResponse,
  ArticlePagingAPIResponse,
  Comment,
  CommentAPIResponse,
  CommentListAPIResponse,
  PagingQueryParams
} from '../models';

export type UpsertArticleBodyRequest = Pick<
  Article,
  'title' | 'description' | 'body' | 'tagList'
>;

export type ArticleGlobalQueryParams = PagingQueryParams & {
  tag?: string;
  author?: string;
  favorited?: string;
};

export type InsertCommentBodyRequest = Pick<Comment, 'body'>;

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  readonly #httpClient = inject(HttpClient);

  createArticle(
    article: UpsertArticleBodyRequest
  ): Observable<ArticleAPIResponse> {
    return this.#httpClient.post<ArticleAPIResponse>('/articles', {
      article,
    });
  }

  updateArticle(
    slug: string,
    article: UpsertArticleBodyRequest
  ): Observable<ArticleAPIResponse> {
    return this.#httpClient.put<ArticleAPIResponse>(`/articles/${slug}`, {
      article,
    });
  }

  deleteArticle(slug: string): Observable<Object> {
    return this.#httpClient.delete(`/articles/${slug}`);
  }

  getCommentsForArticle(slug: string): Observable<CommentListAPIResponse> {
    return this.#httpClient.get<CommentListAPIResponse>(
      `/articles/${slug}/comments`
    );
  }

  createCommentForArticle(
    slug: string,
    comment: InsertCommentBodyRequest
  ): Observable<CommentAPIResponse> {
    return this.#httpClient.post<CommentAPIResponse>(
      `/articles/${slug}/comments`,
      {
        comment,
      }
    );
  }

  deleteCommentForArticle(slug: string, id: string): Observable<Object> {
    return this.#httpClient.delete(`/articles/${slug}/comments/${id}`);
  }

  getArticleDetail(slug: string): Observable<ArticleAPIResponse> {
    return this.#httpClient.get<ArticleAPIResponse>(`/articles/${slug}`);
  }

  getFeed(request: PagingQueryParams): Observable<ArticlePagingAPIResponse> {
    return this.#httpClient.get<ArticlePagingAPIResponse>('/articles/feed', {
      params: {
        ...request,
      },
    });
  }

  getArticleGlobal(
    request: ArticleGlobalQueryParams
  ): Observable<ArticlePagingAPIResponse> {
    return this.#httpClient.get<ArticlePagingAPIResponse>('/articles', {
      params: {
        ...request,
      },
    });
  }

  favoriteArticle(slug: string): Observable<ArticlePagingAPIResponse> {
    return this.#httpClient.post<ArticlePagingAPIResponse>(
      `/articles/${slug}/favorite`,
      {}
    );
  }

  unfavoriteArticle(slug: string): Observable<ArticlePagingAPIResponse> {
    return this.#httpClient.delete<ArticlePagingAPIResponse>(
      `/articles/${slug}/favorite`
    );
  }
}
