import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private api = `${API_URL}/avis/`;

  constructor(private http: HttpClient) {}

  /**
   * 🔵 1) Récupère automatiquement :
   * - les cours où l’utilisateur est inscrit
   * - le coach lié à ce cours via une réservation
   */
  getUserCoursCoach(): Observable<any> {
    return this.http.get(this.api + 'my-data/');
  }

  /**
   * 🟩 2) Envoie TOUS les avis :
   * - avis cours + coach
   * - avis général
   */
  submitAllReviews(payload: any): Observable<any> {
    return this.http.post(this.api + 'submit/', payload);
  }
}
