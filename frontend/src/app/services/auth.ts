import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

export interface RegisterUserPayload {
  email: string;
  password: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {}

  register(payload: RegisterUserPayload): Observable<void> {
    return this.http.post(`${this.apiUrl}/register`, payload, {
      responseType: 'text'
    }).pipe(map(() => undefined));
  }

  login(payload: LoginUserPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        if (response?.token && typeof localStorage !== 'undefined') {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }
}
