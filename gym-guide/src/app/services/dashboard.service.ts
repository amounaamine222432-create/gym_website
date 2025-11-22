import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private api = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient, private auth: AuthService) {}

  getCoachDuMois() {
    return this.http.get(`${this.api}/dashboard/coach-month/`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  getNextSeances() {
    return this.http.get(`${this.api}/dashboard/next-seances/`, {
      headers: this.auth.getAuthHeaders()
    });
  }
  getReviewStats() {
  return this.http.get(`${this.api}/dashboard/reviews/`, {
    headers: this.auth.getAuthHeaders()
  });
}

  getWeekSeances() {
    return this.http.get(`${this.api}/dashboard/week-seances/`, {
      headers: this.auth.getAuthHeaders()
    });
  }
 getStats() {
  return this.http.get<{ cours: number; coachs: number; seances: number }>(
    `${this.api}/dashboard/stats/`,
    { headers: this.auth.getAuthHeaders() }
  );
}


}
