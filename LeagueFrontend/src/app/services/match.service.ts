import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName?: string;
  awayTeamName?: string;
  matchDate: string;
  venue?: string;
  status: number;
  homeScore?: number;
  awayScore?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private http = inject(HttpClient);
  // CONFIRMA QUE ESTE PUERTO SEA EL MISMO DE TU SWAGGER (7105 usualmente)
  private apiUrl = 'https://localhost:7105/api/Matches'; 

  // --- MÉTODOS DE LECTURA ---

  // 1. Obtener partidos de un torneo
  getMatchesByTournament(tournamentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ByTournament/${tournamentId}`);
  }

  // --- MÉTODOS DEL ADMIN ---

  // 2. Crear Partido (Esto es lo que faltaba y causaba el error TS2339)
  createMatch(matchData: any): Observable<any> {
    return this.http.post(this.apiUrl, matchData);
  }

  // --- MÉTODOS DEL COMITÉ ---

  // 3. Cargar Resultado (Versión completa para el Comité)
  updateMatchResult(matchId: string, resultData: { matchId: string, homeScore: number, awayScore: number, incidents: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${matchId}/Result`, resultData);
  }

  // 4. Adaptador para el Admin (Para arreglar el otro error TS2339)
  // El Admin llama a 'registerResult(id, home, away)', así que creamos este método
  // para que traduzca la petición al formato nuevo.
  registerResult(matchId: string, homeScore: number, awayScore: number): Observable<any> {
    const command = {
      matchId: matchId,
      homeScore: homeScore,
      awayScore: awayScore,
      incidents: 'Carga rápida Admin'
    };
    return this.updateMatchResult(matchId, command);
  }
}