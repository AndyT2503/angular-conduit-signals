import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Article, ArticleAPIResponse } from '../models';

export type CreateArticleRequest = Pick<
  Article,
  'title' | 'description' | 'body' | 'tagList'
>;

export type UpdateArticleRequest = Pick<
  Article,
  'title' | 'description' | 'body'
>;

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  readonly #httpClient = inject(HttpClient);

  createArticle(article: CreateArticleRequest): Observable<ArticleAPIResponse> {
    return this.#httpClient.post<ArticleAPIResponse>('/articles', {
      article,
    });
  }

  updateArticle(
    slug: string,
    article: UpdateArticleRequest
  ): Observable<ArticleAPIResponse> {
    return this.#httpClient.put<ArticleAPIResponse>(`/articles/${slug}`, {
      article,
    });
  }
}
