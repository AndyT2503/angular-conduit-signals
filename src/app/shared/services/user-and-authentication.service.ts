import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../models';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  username: string;
}

export interface UpdateProfileRequest extends RegisterRequest {
  bio: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserAndAuthenticationService {
  readonly #httpClient = inject(HttpClient);

  login(user: LoginRequest): Observable<{user: User}> {
    return this.#httpClient.post<{user: User}>('/users/login', {
      user,
    });
  }

  register(user: RegisterRequest): Observable<{user: User}> {
    return this.#httpClient.post<{user: User}>('/users', {
      user,
    });
  }

  getUserProfile(): Observable<{user: User}> {
    return this.#httpClient.get<{user: User}>('/user');
  }

  updateUserProfile(user: UpdateProfileRequest): Observable<{user: User}> {
    return this.#httpClient.put<{user: User}>('/user', {
      user,
    });
  }
}
