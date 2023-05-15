import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileAPIResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  readonly #httpClient = inject(HttpClient);

  getProfile(username: string): Observable<ProfileAPIResponse> {
    return this.#httpClient.get<ProfileAPIResponse>(`/profiles/${username}`);
  }

  followUser(username: string): Observable<ProfileAPIResponse> {
    return this.#httpClient.post<ProfileAPIResponse>(
      `/profiles/${username}/follow`,
      {}
    );
  }

  unfollowUser(username: string): Observable<ProfileAPIResponse> {
    return this.#httpClient.delete<ProfileAPIResponse>(
      `/profiles/${username}/follow`
    );
  }
}
