import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Signal,
  computed,
  signal,
} from '@angular/core';
import { DEFAULT_LIMIT } from '../../constants';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input({ required: true }) totalCount!: Signal<number>;
  @Input() limit = signal<number>(DEFAULT_LIMIT).asReadonly();
  @Input({ required: true }) offset!: Signal<number>;

  readonly totalPage = computed(() =>
    Math.ceil(this.totalCount() / this.limit()),
  );
  readonly currentPageIndex = computed(() => this.offset() / this.limit() + 1);
  readonly hasPagination = computed(() => this.totalCount() > this.limit());
  readonly pagesToShow = computed(() => {
    const total = this.totalPage();
    const current = this.currentPageIndex();

    const pages = new Set<number>();

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.add(i);
      }
    } else {
      pages.add(1);
      pages.add(2);

      pages.add(total);
      pages.add(total - 1);

      for (let i = current - 2; i <= current + 2; i++) {
        if (i > 0 && i <= total) {
          pages.add(i);
        }
      }

      if (current <= 2) {
        pages.add(3);
        pages.add(4);
        pages.add(5);
      }

      if (current >= total - 1) {
        pages.add(total - 2);
        pages.add(total - 3);
        pages.add(total - 4);
      }
    }

    return Array.from(pages)
      .filter((p) => p > 0 && p <= total)
      .sort((a, b) => a - b);
  });

  @Output() offsetChange = new EventEmitter<number>();
}
