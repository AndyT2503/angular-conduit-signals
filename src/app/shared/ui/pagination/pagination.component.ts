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
    Math.ceil(this.totalCount() / this.limit())
  );
  readonly currentPageIndex = computed(() => this.offset() / this.limit() + 1);
  readonly hasPagination = computed(() => this.totalCount() > this.limit());
  @Output() offsetChange = new EventEmitter<number>();
}
