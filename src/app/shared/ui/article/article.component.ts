import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../../models';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, RouterLink, NgClass],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent {
  @Input({ required: true }) article!: Article;
  @Output() toggleFavorite = new EventEmitter<Article>();
}
