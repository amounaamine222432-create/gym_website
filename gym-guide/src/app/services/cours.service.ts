import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CoursService {
  private baseUrl = 'http://127.0.0.1:8000/api/cours/';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getCours(): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get(this.baseUrl, { headers });
  }
}
