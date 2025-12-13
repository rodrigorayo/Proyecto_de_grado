import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  // Asegúrate de que el puerto coincida con tu Swagger (7105)
  private apiUrl = 'https://localhost:7105/api/Matches';
  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener Fixture de un Torneo
  getMatchesByTournament(tournamentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ByTournament/${tournamentId}`, { headers: this.getHeaders() });
  }

  // Programar Partido
  createMatch(match: any): Observable<any> {
    return this.http.post(this.apiUrl, match, { headers: this.getHeaders() });
  }

  registerResult(matchId: string, homeScore: number, awayScore: number): Observable<any> {
    const body = { matchId, homeScore, awayScore };
    return this.http.put(`${this.apiUrl}/${matchId}/Result`, body, { headers: this.getHeaders() });
  }
}