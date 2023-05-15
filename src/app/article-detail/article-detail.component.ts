import {
  DatePipe,
  NgClass,
  NgFor,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { Article } from '../shared/models';
import { AuthStore } from '../shared/store';
import { MarkdownPipe } from '../shared/ui/markdown';
import { ArticleDetailStore } from './article-detail.store';
import { CommentFormComponent } from './ui/comment-form/comment-form.component';
import { CommentListComponent } from './ui/comment-list/comment-list.component';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgTemplateOutlet,
    NgFor,
    CommentListComponent,
    CommentFormComponent,
    DatePipe,
    NgClass,
    MarkdownPipe,
  ],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(ArticleDetailStore)],
})
export default class ArticleDetailComponent implements OnInit {
  @Input() slug!: string;
  readonly #articleStore = inject(ArticleDetailStore);
  readonly #authStore = inject(AuthStore);
  readonly isAuthenticated = this.#authStore.selectors.isAuthenticated;
  readonly currentUser = this.#authStore.selectors.user;
  readonly article = this.#articleStore.selectors.article;

  ngOnInit(): void {
    this.#articleStore.getArticleDetail(this.slug);
  }

  toggleFavorite(article: Article): void {
    this.#articleStore.toggleFavorite(article);
  }

  deleteArticle(article: Article): void {
    this.#articleStore.deleteArticle(article.slug)
  }

  toggleFollowAuthor(article: Article): void {
    this.#articleStore.toggleFollow(article);
  }
}
