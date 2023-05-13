import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { UpsertArticleRequest } from 'src/app/shared/services';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { EditArticleStore } from './edit-article.store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [ArticleFormComponent],
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(EditArticleStore)],
})
export default class EditArticleComponent implements OnInit {
  @Input() slug?: string;
  readonly #editArticleStore = inject(EditArticleStore);
  errorResponse = this.#editArticleStore.selectors.errorResponse;
  article = this.#editArticleStore.selectors.article;

  ngOnInit(): void {
    this.#editArticleStore.getArticle(this.slug!);
  }
  submit(value: UpsertArticleRequest): void {
    this.#editArticleStore.updateArticle(value);
  }
}
