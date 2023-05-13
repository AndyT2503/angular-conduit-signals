import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Article, ArticleAPIResponse } from '../models';

export type UpsertArticleRequest = Pick<
  Article,
  'title' | 'description' | 'body' | 'tagList'
>;

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
}
