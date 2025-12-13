import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatchService } from '../../services/match.service';
import { TournamentService } from '../../services/tournament.service'; // 👈 IMPORTANTE

@Component({
  selector: 'app-committee-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './committee-dashboard.component.html',
  styleUrls: ['./committee-dashboard.component.css']
})
export class CommitteeDashboardComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private matchService = inject(MatchService);
  private tournamentService = inject(TournamentService); // 👈 Inyectamos el servicio

  // --- ESTADO ---
  // Ya NO usamos ID fijo. Usamos estas señales:
  tournaments = signal<any[]>([]); 
  selectedTournamentId = signal<string>(''); 

  currentView = signal<string>('partidos');
  matchesList = signal<any[]>([]);
  isLoading = signal(false);

  // Mocks (Visuales)
  standingsList = signal([
    { pos: 1, team: 'Los Gigantes', pj: 10, pg: 8, pe: 1, pp: 1, pts: 25 },
    { pos: 2, team: 'Fuerza Verde', pj: 10, pg: 7, pe: 2, pp: 1, pts: 23 }
  ]);
  newsList = signal([
    { id: 1, title: 'Sistema Conectado', date: 'Hoy', excerpt: 'Lectura de datos en tiempo real.', image: 'https://picsum.photos/id/100/400/250' },
  ]);

  // Formulario
  selectedMatch = signal<any>(null);
  reportForm = this.fb.group({
      homeScore: [0, [Validators.required, Validators.min(0)]],
      awayScore: [0, [Validators.required, Validators.min(0)]],
      incidents: ['']
  });

  // Menú
  menuItems = signal([
    { id: 'dashboard', label: 'Dashboard', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>' },
    { id: 'partidos', label: 'Mis Partidos', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
  ]);

  ngOnInit() {
    // Al iniciar, cargamos la lista de torneos
    this.loadTournaments();
  }

  // 1. Cargar Torneos
  loadTournaments() {
    this.tournamentService.getAll().subscribe({
      next: (data) => {
        this.tournaments.set(data);
        // Si hay torneos, seleccionamos el primero por defecto
        if (data.length > 0) {
          this.selectedTournamentId.set(data[0].id);
          this.loadMatches(); // Y cargamos sus partidos
        }
      },
      error: (err) => console.error('Error cargando torneos', err)
    });
  }

  // 2. Detectar cambio de torneo en el Dropdown
  onTournamentChange(event: any) {
    this.selectedTournamentId.set(event.target.value);
    this.loadMatches();
  }

  // 3. Cargar Partidos (Usando el ID seleccionado)
  loadMatches() {
    const tournamentId = this.selectedTournamentId();
    if (!tournamentId) return;

    this.isLoading.set(true);
    this.matchService.getMatchesByTournament(tournamentId).subscribe({
      next: (data) => {
        console.log('Partidos cargados:', data);
        const formattedMatches = data.map(m => ({
          id: m.id,
          date: new Date(m.matchDate).toLocaleDateString(),
          time: new Date(m.matchDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          home: m.homeTeamName || 'Local',
          away: m.awayTeamName || 'Visita',
          location: m.venue,
          status: m.status,
          statusLabel: this.getStatusLabel(m.status)
        }));
        this.matchesList.set(formattedMatches);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando partidos', err);
        this.isLoading.set(false);
        this.matchesList.set([]); // Limpiamos la lista si falla
      }
    });
  }

  // Helpers
  getStatusLabel(status: number): string {
    switch(status) {
      case 0: return 'Pendiente';
      case 1: return 'Jugando';
      case 2: return 'Finalizado';
      case 3: return 'Cancelado';
      default: return 'Desconocido';
    }
  }

  countPending() { return this.matchesList().filter(m => m.status === 0).length; }
  countFinished() { return this.matchesList().filter(m => m.status === 2).length; }

  navigate(event: Event, viewId: string) {
    event.preventDefault();
    this.currentView.set(viewId);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getPageTitle(): string {
      const map: Record<string, string> = {
          'dashboard': 'Panel Principal',
          'partidos': 'Gestión de Resultados',
          'registrar-acta': 'Registro de Resultados'
      };
      return map[this.currentView()] || 'Panel del Comité';
  }

  openReportForm(match: any) {
      this.selectedMatch.set(match);
      this.reportForm.reset({ homeScore: 0, awayScore: 0, incidents: '' });
      this.currentView.set('registrar-acta');
  }

  submitReport() {
      if (this.reportForm.valid && this.selectedMatch()) {
          const formVal = this.reportForm.value;
          const matchId = this.selectedMatch().id;

          const command = {
            matchId: matchId,
            homeScore: Number(formVal.homeScore),
            awayScore: Number(formVal.awayScore),
            incidents: formVal.incidents || ''
          };

          this.matchService.updateMatchResult(matchId, command).subscribe({
            next: () => {
              alert('✅ Resultado registrado exitosamente');
              this.loadMatches(); // Recargamos la lista actualizada
              this.selectedMatch.set(null);
              this.currentView.set('partidos');
            },
            error: (err) => {
              console.error(err);
              // Mostramos el error exacto que manda el backend
              alert(`❌ Error: ${err.error?.error || 'No se pudo guardar'}`);
            }
          });
      }
  }
}