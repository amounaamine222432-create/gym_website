import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../config/api.config';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/** 🔹 Interface retour /subscription/me/ */
export interface MySubscriptionResponse {
  active: boolean;
  subscription_id?: number;
  plan?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private api = API_URL;

  constructor(private http: HttpClient) {}

  /** --------------------------------------------------------
   * 🔥 1️⃣ Récupérer l'abonnement actif
   *    GET /subscription/me/
   ---------------------------------------------------------*/
  getMySubscription(): Observable<MySubscriptionResponse> {
    const token = localStorage.getItem("access");
    if (!token) return throwError(() => new Error("Non authentifié"));

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http
      .get<MySubscriptionResponse>(`${this.api}/subscription/me/`, { headers })
      .pipe(
        catchError(err => {
          console.error("❌ Erreur my_subscription:", err);
          return throwError(() => err);
        })
      );
  }

  /** --------------------------------------------------------
   * 🔥 2️⃣ Créer un abonnement côté Django
   *    POST /subscription/create/
   ---------------------------------------------------------*/
  createSubscription(plan: string) {
    const token = localStorage.getItem("access");
    if (!token) return throwError(() => new Error("Non authentifié"));

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    });

    return this.http
      .post(`${this.api}/subscription/create/`, { plan }, { headers })
      .pipe(
        catchError(err => {
          console.error("❌ Erreur create_subscription:", err);
          return throwError(() => err);
        })
      );
  }

  /** --------------------------------------------------------
   * 🔥 3️⃣ Créer session Stripe (paiement)
   *    POST /stripe/create/
   ---------------------------------------------------------*/
  createStripePayment(subscription_id: number) {
    const token = localStorage.getItem("access");
    if (!token) return throwError(() => new Error("Non authentifié"));

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    });

    return this.http
      .post<any>(`${this.api}/stripe/create/`, { subscription_id }, { headers })
      .pipe(
        catchError(err => {
          console.error("❌ Erreur stripe/create:", err);
          return throwError(() => err);
        })
      );
  }
}
