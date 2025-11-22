import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CoursService {

  private api = 'http://127.0.0.1:8000/api';
  private baseUrl = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient, private auth: AuthService) {}

  /** 🔹 Récupérer tous les cours */
  getAllCours(): Observable<any> {
    return this.http.get(`${this.api}/cours/`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  /** 🔹 Récupérer les cours du user */
  getMesCours(): Observable<any> {
    return this.http.get(`${this.api}/cours/mes/`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  /** 🔹 Rejoindre un cours */
  joinCours(id: number): Observable<any> {
    return this.http.post(`${this.api}/cours/join/`,
      { cours_id: id },
      { headers: this.auth.getAuthHeaders() }
    );
  }

  /** 🔹 Quitter un cours */
  quitCours(id: number): Observable<any> {
    return this.http.delete(`${this.api}/cours/quit/${id}/`, {
      headers: this.auth.getAuthHeaders()
    });
  }
  getCoachs(coursId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/cours/${coursId}/coachs/`);
  }

  choisirCoach(coursId: number, coachId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/cours/choisir-coach/`, {
      cours_id: coursId,
      coach_id: coachId
    });
  }

  // ==========================
  //  🔥 SÉANCES
  // ==========================

 /** 🔹 Récupérer les séances d’un coach pour un cours */
getSeancesByCoach(coursId: number, coachId: number): Observable<any> {
  return this.http.get(
    `${this.baseUrl}/seances/`,
    {
      params: {
        cours: coursId,
        coach: coachId
      }
    }
  );
}
/** 🔹 Réserver une séance */
reserverSeance(seanceId: number) {
  return this.http.post(
    `${this.baseUrl}/seances/${seanceId}/join/`,
    {},
    { headers: this.auth.getAuthHeaders() }
  );
}



}


