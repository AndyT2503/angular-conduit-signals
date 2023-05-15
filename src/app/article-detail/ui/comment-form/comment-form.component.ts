import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleDetailStore } from '../../article-detail.store';
import { AuthStore } from 'src/app/shared/store';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent {
  @Input() slug!: string;
  readonly #articleStore = inject(ArticleDetailStore);
  readonly avatar = inject(AuthStore).selectors.user()?.image;
  comment!: string;
  submit(): void {
    this.#articleStore.createComment({
      slug: this.slug,
      comment: {
        body: this.comment,
      },
    });
  }
}
