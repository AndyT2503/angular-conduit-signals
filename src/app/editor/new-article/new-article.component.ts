import { FormErrorsComponent } from './../../shared/ui/form-errors/form-errors.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypedFormGroup } from 'src/app/shared/utils';
import { provideComponentStore } from '@ngrx/component-store';
import { NewArticleStore } from './new-article.store';
import { CreateArticleRequest } from 'src/app/shared/services';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TagListSelectComponent } from './tag-list-select/tag-list-select.component';

@Component({
  selector: 'app-new-article',
  standalone: true,
  imports: [ReactiveFormsModule, TagListSelectComponent, FormErrorsComponent],
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(NewArticleStore)],
})
export default class NewArticleComponent {
  readonly #newArticleStore = inject(NewArticleStore);
  readonly errorResponse = this.#newArticleStore.selectors.errorResponse;
  readonly newArticleForm: TypedFormGroup<CreateArticleRequest> = new FormGroup(
    {
      title: new FormControl('', {
        nonNullable: true,
      }),
      body: new FormControl('', {
        nonNullable: true,
      }),
      description: new FormControl('', {
        nonNullable: true,
      }),
      tagList: new FormControl<string[]>([], {
        nonNullable: true,
      }),
    }
  );

  submit(): void {
    this.#newArticleStore.createNewArticle(this.newArticleForm.getRawValue());
  }
}
