import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Article,
  ArticleAPIResponse,
  ArticlePagingResponse,
  PagingParams as PagingQueryParams,
} from '../models';

export type UpsertArticleRequest = Pick<
  Article,
  'title' | 'description' | 'body' | 'tagList'
>;

export type ArticleGlobalQueryParams = PagingQueryParams & {
  tag?: string;
  author?: string;
  favorited?: string;
};

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  readonly #httpClient = inject(HttpClient);

  createArticle(article: UpsertArticleRequest): Observable<ArticleAPIResponse> {
    return this.#httpClient.post<ArticleAPIResponse>('/articles', {
      article,
    });
  }

  updateArticle(
    slug: string,
    article: UpsertArticleRequest
  ): Observable<ArticleAPIResponse> {
    return this.#httpClient.put<ArticleAPIResponse>(`/articles/${slug}`, {
      article,
    });
  }

  getArticleDetail(slug: string): Observable<ArticleAPIResponse> {
    return this.#httpClient.get<ArticleAPIResponse>(`/articles/${slug}`);
  }

  getFeed(request: PagingQueryParams): Observable<ArticlePagingResponse> {
    return this.#httpClient.get<ArticlePagingResponse>('/articles/feed', {
      params: {
        ...request,
      },
    });
  }

  getArticleGlobal(
    request: ArticleGlobalQueryParams
  ): Observable<ArticlePagingResponse> {
    return this.#httpClient.get<ArticlePagingResponse>('/articles', {
      params: {
        ...request,
      },
    });
  }

  favoriteArticle(slug: string): Observable<ArticlePagingResponse> {
    return this.#httpClient.post<ArticlePagingResponse>(
      `/articles/${slug}/favorite`,
      {}
    );
  }

  unfavoriteArticle(slug: string): Observable<ArticlePagingResponse> {
    return this.#httpClient.delete<ArticlePagingResponse>(
      `/articles/${slug}/favorite`
    );
  }
}
