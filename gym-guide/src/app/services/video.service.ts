import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private api = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient) {}

 getVideos(coursId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.api}/cours/${coursId}/videos-ai/`);
}

refreshVideos(coursId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.api}/cours/${coursId}/videos-ai/?refresh=true`);
}
}