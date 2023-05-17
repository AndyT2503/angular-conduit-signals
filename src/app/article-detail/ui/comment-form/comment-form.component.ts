import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthStore } from 'src/app/shared/store';
import { ArticleDetailStore } from '../../article-detail.store';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent {
  @Input({ required: true }) slug!: string;
  readonly #route = inject(ActivatedRoute);
  readonly #articleDetailStore = inject(ArticleDetailStore);
  readonly avatar = inject(AuthStore).selectors.user()?.image;
  comment!: string;
  submit(): void {
    this.#articleDetailStore.createComment({
      slug: this.slug,
      comment: {
        body: this.comment,
      },
    });
    this.comment = '';
  }
}
