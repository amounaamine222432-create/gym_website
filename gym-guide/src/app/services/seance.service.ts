import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';

export interface Seance {
  id: number;
  cours: number;          // id du cours
  coach: number;          // id du coach
  date_seance: string;    // "2025-11-21"
  heure_debut: string;    // "10:00:00"
  heure_fin: string;      // "11:00:00"
  salle: string;
  statut: string;
  coach_nom?: string;
  coach_prenom?: string;
  cours_titre?: string;
}

@Injectable({ providedIn: 'root' })
export class SeanceService {

private api = `${API_URL}/seances`;

  constructor(private http: HttpClient) {}

  /** 🔵 Récupérer les séances d'un coach */
  getByCoach(coachId: number): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.api}/coach/${coachId}/`);
  }
}
