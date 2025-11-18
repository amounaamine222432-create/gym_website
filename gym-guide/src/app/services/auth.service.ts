import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // 👈 ajouter HttpHeaders

import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // -----------------------------------------------------
  // 🔐 LOGIN AVEC EMAIL + PASSWORD (Django)
  // -----------------------------------------------------
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/token/`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);
      })
    );
  }

  // -----------------------------------------------------
  // 🧩 STOCKAGE / USER
  // -----------------------------------------------------
  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  // -----------------------------------------------------
  // 🟢 AUTH
  // -----------------------------------------------------
  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('access');
  }

  isLogged(): boolean {
    return !!localStorage.getItem('access');
  }

  // -----------------------------------------------------
  // 🔎 PROFIL COMPLET ?
  // -----------------------------------------------------
  isProfileCompleted(): boolean {
    const user = this.getUser();
    return user?.is_profile_completed === true;
  }
  getAuthHeaders(): HttpHeaders {
  const token = this.getToken();        // récupère 'access' du localStorage
  return new HttpHeaders(
    token ? { Authorization: `Bearer ${token}` } : {}
  );
}

}
