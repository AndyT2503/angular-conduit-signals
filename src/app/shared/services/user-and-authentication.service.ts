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

  login(user: LoginRequest): Observable<User> {
    return this.#httpClient.post<User>('/users/login', {
      user,
    });
  }

  register(user: RegisterRequest): Observable<User> {
    return this.#httpClient.post<User>('/users', {
      user,
    });
  }

  getUserProfile(): Observable<User> {
    return this.#httpClient.get<User>('/user');
  }

  updateUserProfile(user: UpdateProfileRequest): Observable<User> {
    return this.#httpClient.put<User>('/user', {
      user,
    });
  }
}
