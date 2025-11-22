import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private api = 'http://127.0.0.1:8000/api/stripe';

  constructor(private http: HttpClient) {}

  // ------------------------------------------------------------
  // 🔥 1) Créer une session de paiement Stripe
  // ------------------------------------------------------------
  createPayment(subscription_id: number): Observable<any> {

    const token = localStorage.getItem("access");
    if (!token) {
      return throwError(() => new Error("Authentification requise."));
    }

    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    });

    return this.http.post(
      `${this.api}/create/`,
      { subscription_id },
      { headers }
    ).pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  // ------------------------------------------------------------
  // 🔥 2) Validation du paiement Stripe
  // ------------------------------------------------------------
  validatePayment(session_id: string, subscription_id: number): Observable<any> {

    const token = localStorage.getItem("access");
    if (!token) {
      return throwError(() => new Error("Authentification requise."));
    }

    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    });

    return this.http.post(
      `${this.api}/validate/`,
      { session_id, subscription_id },
      { headers }
    ).pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  // ------------------------------------------------------------
  // 🛑 Gestion PRO des erreurs
  // ------------------------------------------------------------
  private handleError(error: HttpErrorResponse) {

    let message = "Erreur inconnue.";

    if (error.error?.error) {
      message = error.error.error;
    } else if (error.status === 0) {
      message = "Serveur injoignable.";
    } else if (error.status === 400) {
      message = "Requête invalide.";
    } else if (error.status === 401) {
      message = "Authentification requise.";
    } else if (error.status === 404) {
      message = "Ressource introuvable.";
    } else if (error.status === 500) {
      message = "Erreur interne du serveur.";
    }

    console.error("STRIPE ERROR →", error);
    return throwError(() => new Error(message));
  }
}
