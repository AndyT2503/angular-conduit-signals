import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { UpsertArticleBodyRequest } from 'src/app/shared/services';
import { TypedFormGroup } from 'src/app/shared/utils';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { NewArticleStore } from './new-article.store';

@Component({
  selector: 'app-new-article',
  standalone: true,
  imports: [ArticleFormComponent],
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(NewArticleStore)],
})
export default class NewArticleComponent {
  readonly #newArticleStore = inject(NewArticleStore);
  readonly errorResponse = this.#newArticleStore.selectors.errorResponse;

  submit(form: TypedFormGroup<UpsertArticleBodyRequest>): void {
    this.#newArticleStore.createNewArticle(form);
  }
}
