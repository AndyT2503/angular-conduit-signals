import { FormErrorsComponent } from './../../shared/ui/form-errors/form-errors.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypedFormGroup } from 'src/app/shared/utils';
import { provideComponentStore } from '@ngrx/component-store';
import { NewArticleStore } from './new-article.store';
import { UpsertArticleRequest } from 'src/app/shared/services';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TagListSelectComponent } from '../article-form/tag-list-select/tag-list-select.component';
import { ArticleFormComponent } from '../article-form/article-form.component';

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

  submit(value: UpsertArticleRequest): void {
    this.#newArticleStore.createNewArticle(value);
  }
}
