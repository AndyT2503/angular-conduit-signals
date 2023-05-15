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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #articleDetailStore = inject(ArticleDetailStore);
  readonly avatar = inject(AuthStore).selectors.user()?.image;
  comment!: string;
  submit(): void {
    this.#articleDetailStore.createComment({
      slug: this.#route.snapshot.params['slug'],
      comment: {
        body: this.comment,
      },
    });
    this.comment = '';
  }
}
