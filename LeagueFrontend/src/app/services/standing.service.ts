import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StandingService {
  private apiUrl = 'https://localhost:7105/api/Standings';
  private http = inject(HttpClient);

  private getHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
  }

  getStandings(tournamentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${tournamentId}`, { headers: this.getHeaders() });
  }
  
}