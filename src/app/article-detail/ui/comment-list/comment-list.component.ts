import { DatePipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject, Input, OnInit
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthStore } from 'src/app/shared/store';
import { ArticleDetailStore } from '../../article-detail.store';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [NgFor, RouterLink, DatePipe, NgIf],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent {
  @Input({ required: true }) slug!: string;
  readonly #authStore = inject(AuthStore);
  readonly #articleDetailStore = inject(ArticleDetailStore);
  readonly commentList = this.#articleDetailStore.selectors.comments;
  readonly currentUser = this.#authStore.selectors.user;
  ngOnInit(): void {
    this.#articleDetailStore.getArticleComments(this.slug);
  }

  onDeleteComment(commentId: string): void {
    this.#articleDetailStore.deleteComment({
      slug: this.slug,
      commentId,
    });
  }
}
