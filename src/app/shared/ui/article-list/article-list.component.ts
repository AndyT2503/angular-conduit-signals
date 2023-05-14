import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { ArticleComponent } from '../article';
import { Article } from '../../models';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [NgFor, ArticleComponent, NgIf],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleListComponent {
  @Input({required: true}) articleList!: Signal<Article[]>;
  @Output() toggleFavorite = new EventEmitter<Article>();
}
