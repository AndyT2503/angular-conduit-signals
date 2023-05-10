import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserAndAuthenticationService {
  readonly #httpClient = inject(HttpClient);

  login(user: LoginRequest) {
    return this.#httpClient.post('/user/login', {
      user,
    });
  }
}
