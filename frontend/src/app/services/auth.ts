import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface RegisterUserPayload {
  email: string;
  password: string;
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
}
