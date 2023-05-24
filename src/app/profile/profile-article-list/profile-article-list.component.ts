import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { map } from 'rxjs';
import { Article } from 'src/app/shared/models';
import { ArticleListComponent } from 'src/app/shared/ui/article-list';
import { PaginationComponent } from 'src/app/shared/ui/pagination';
import { injectArticleType } from './profile-article-list.di';
import { ProfileArticleListStore } from './profile-article-list.store';

@Component({
  selector: 'app-profile-article-list',
  standalone: true,
  imports: [PaginationComponent, ArticleListComponent],
  templateUrl: './profile-article-list.component.html',
  styleUrls: ['./profile-article-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(ProfileArticleListStore)],
})
export default class ProfileArticleListComponent implements OnInit {
  readonly #route = inject(ActivatedRoute);
  readonly #profileArticleStore = inject(ProfileArticleListStore);
  readonly #articleType = injectArticleType();
  readonly #username = toSignal(
    this.#route.parent!.params.pipe(
      map((params) => params['username'].replace('@', ''))
    )
  );
  readonly articleList = this.#profileArticleStore.selectors.articleList;
  readonly articleCount = this.#profileArticleStore.selectors.articleCount;
  readonly currentOffset = this.#profileArticleStore.selectors.currentOffset;
  readonly pageLimit = signal(ProfileArticleListStore.PAGE_LIMIT).asReadonly();

  ngOnInit(): void {
    this.loadArticle(0);
  }

  loadArticle(offset: number): void {
    this.#profileArticleStore.getArticle({
      articleType: this.#articleType,
      offset,
      username: this.#username(),
    });
  }

  toggleFavorite(article: Article): void {
    this.#profileArticleStore.toggleFavorite(article);
  }
}
