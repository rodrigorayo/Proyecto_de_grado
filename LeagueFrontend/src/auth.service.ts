import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // OJO: Cambia este puerto si tu Swagger dice otro (ej: 7154)
    private apiUrl = 'https://localhost:7105/api/Auth';

    private http = inject(HttpClient);

    login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response && response.token) {
                    // Guardamos el token en el navegador
                    localStorage.setItem('token', response.token);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('token');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }
}