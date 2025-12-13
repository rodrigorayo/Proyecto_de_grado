import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StandingService {
  // Asegúrate que el puerto coincida con tu Swagger
  private apiUrl = 'https://localhost:7105/api/Standings';
  private http = inject(HttpClient);

  // ⚠️ CAMBIO: Quitamos los headers de autenticación porque es una vista PÚBLICA.
  // Los fans no tienen token, así que si lo enviamos, fallará.
  getStandings(tournamentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${tournamentId}`);
  }
}