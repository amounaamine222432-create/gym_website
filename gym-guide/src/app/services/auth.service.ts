import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api';
  private tokenKey = 'access_token';

  constructor(private http: HttpClient) {}

  // POST /api/token/ -> {access, refresh}
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/token/`, { username, password })
      .pipe(
        tap((res: any) => {
          localStorage.setItem(this.tokenKey, res.access);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Headers avec le Bearer token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }
}
