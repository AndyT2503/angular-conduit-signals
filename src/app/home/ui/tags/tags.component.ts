import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { HomeStore } from '../../home.store';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [NgFor],
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent implements OnInit {
  readonly #homeStore = inject(HomeStore);
  readonly tags = this.#homeStore.selectors.tags;
  @Output() selectTag = new EventEmitter<string>();

  ngOnInit(): void {
    this.#homeStore.getTags();
  }
}
