import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TagAPIResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  readonly #httpClient = inject(HttpClient);

  getTags(): Observable<TagAPIResponse> {
    return this.#httpClient.get<TagAPIResponse>('/tags');
  }
}
