import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TournamentService {
  private apiUrl = 'https://localhost:7105/api/Tournaments';
  private http = inject(HttpClient);

  private getHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
  }

  getAll(): Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
  create(data: any): Observable<any> { return this.http.post(this.apiUrl, data, { headers: this.getHeaders() }); }
  update(id: string, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() }); }
  delete(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }); }
}