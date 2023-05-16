import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User, UserAPIResponse } from '../models';
import { Observable } from 'rxjs';

export type LoginBodyRequest = Pick<User, 'email'> & { password: string };

export type RegisterBodyRequest = Pick<User, 'email' | 'username'> & {
  password: string;
};

export type UpdateCurrentUserBodyRequest = Pick<
  User,
  'email' | 'username' | 'bio' | 'image'
> & { password: string };

@Injectable({
  providedIn: 'root',
})
export class UserAndAuthenticationService {
  readonly #httpClient = inject(HttpClient);

  login(user: LoginBodyRequest): Observable<UserAPIResponse> {
    return this.#httpClient.post<UserAPIResponse>('/users/login', {
      user,
    });
  }

  register(user: RegisterBodyRequest): Observable<UserAPIResponse> {
    return this.#httpClient.post<UserAPIResponse>('/users', {
      user,
    });
  }

  getCurrentUser(): Observable<UserAPIResponse> {
    return this.#httpClient.get<UserAPIResponse>('/user');
  }

  updateCurrentUser(user: UpdateCurrentUserBodyRequest): Observable<UserAPIResponse> {
    return this.#httpClient.put<UserAPIResponse>('/user', {
      user,
    });
  }
}
