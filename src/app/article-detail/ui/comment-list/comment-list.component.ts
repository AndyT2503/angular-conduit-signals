import { DatePipe, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleDetailStore } from '../../article-detail.store';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [NgFor, RouterLink, DatePipe],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent implements OnInit {
  @Input() slug!: string;
  readonly #articleDetailStore = inject(ArticleDetailStore);
  readonly commentList = this.#articleDetailStore.selectors.comments;

  ngOnInit(): void {
    this.#articleDetailStore.getArticleComments(this.slug);
  }
}
