import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { UpsertArticleBodyRequest } from 'src/app/shared/services';
import { TypedFormGroup } from 'src/app/shared/utils';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { EditArticleStore } from './edit-article.store';

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
  @Input() slug!: string;
  readonly #editArticleStore = inject(EditArticleStore);
  readonly errorResponse = this.#editArticleStore.selectors.errorResponse;
  readonly article = this.#editArticleStore.selectors.article;

  ngOnInit(): void {
    this.#editArticleStore.getArticle(this.slug);
  }

  submit(form: TypedFormGroup<UpsertArticleBodyRequest>): void {
    this.#editArticleStore.updateArticle(form);
  }
}
