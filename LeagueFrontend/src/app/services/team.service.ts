import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  // Asegúrate de que este puerto sea el mismo de tu Swagger (7105)
  private apiUrl = 'https://localhost:7105/api/Teams';
  private http = inject(HttpClient);

  // Método auxiliar para obtener el token y armar el Header
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createTeam(team: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, team, { headers: this.getHeaders() });
  }
  updateTeam(id: string, team: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, team, { headers: this.getHeaders() });
  }

  deleteTeam(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}