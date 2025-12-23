import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Solo FormsModule para el select
import { AuthService } from '../../services/auth.service';
import { TeamService } from '../../services/team.service';
import { PlayerService } from '../../services/player.service';
import { MatchService } from '../../services/match.service'; // Para ver sus partidos

@Component({
  selector: 'app-delegate-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], //NgOptimizedImage poner luego
  templateUrl: './delegate-dashboard.component.html',
  //styleUrls: ['./delegate-dashboard.component.css']
})
export class DelegateDashboardComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private teamService = inject(TeamService);
  private playerService = inject(PlayerService);
  private matchService = inject(MatchService);

  // --- ESTADO ---
  currentView = signal<string>('dashboard');
  
  // Datos
  teams = signal<any[]>([]);
  selectedTeamId = signal<string>('');
  players = signal<any[]>([]); 
  matches = signal<any[]>([]); // Para el fixture del equipo
  
  isLoading = signal(false);

  // Datos Mock para relleno (Noticias)
  delegateNewsList = signal([
    { 
      id: 1, 
      title: 'Inicio de Temporada', 
      date: 'Hoy', 
      description: 'Recuerda que debes presentar los carnets físicos en mesa de control.',
      image: 'https://picsum.photos/id/1015/400/250' 
    }
  ]);

  // Menú Lateral
  menuItems = signal([
    { id: 'dashboard', label: 'Dashboard', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>' },
    { id: 'mi-equipo', label: 'Mi Equipo', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>' },
    { id: 'mis-jugadores', label: 'Plantilla', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>' },
  ]);

  ngOnInit() {
    this.loadTeams();
  }

  // 1. Cargar Equipos (El delegado selecciona el suyo para ver)
  loadTeams() {
    // Usamos getTeams como definimos para no romper nada
    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.teams.set(data);
        if (data.length > 0) {
          this.selectedTeamId.set(data[0].id);
          this.loadTeamData();
        }
      },
      error: (e) => console.error(e)
    });
  }

  onTeamChange(event: any) {
    this.selectedTeamId.set(event.target.value);
    this.loadTeamData();
  }

  // 2. Cargar Datos del Equipo (Jugadores y Partidos)
  loadTeamData() {
    const teamId = this.selectedTeamId();
    if (!teamId) return;

    this.isLoading.set(true);

    // A. Cargar Jugadores
    this.playerService.getPlayersByTeam(teamId).subscribe({
      next: (data) => {
        this.players.set(data.map((p:any)=>({
            ...p, 
            positionLabel: this.getPositionLabel(p.position) // Helper para texto bonito
        })));
        this.isLoading.set(false);
      },
      error: () => {
        this.players.set([]);
        this.isLoading.set(false);
      }
    });

    // B. Cargar Partidos (Opcional, si tuviéramos endpoint por equipo)
    // Por ahora esto queda pendiente o usamos el de torneos filtrando en memoria
  }

  // Helpers
  getPositionLabel(pos: string | number): string {
    // Si viene como número (enum) o string en inglés
    const map: any = { 0: 'Arquero', 1: 'Defensor', 2: 'Mediocampista', 3: 'Delantero', 'Goalkeeper': 'Arquero', 'Defender': 'Defensor', 'Midfielder': 'Medio', 'Forward': 'Delantero' };
    return map[pos] || pos;
  }

  getTeamName() {
    return this.teams().find(t => t.id === this.selectedTeamId())?.name || 'Equipo';
  }

  navigate(event: Event, viewId: string) {
    event.preventDefault();
    this.currentView.set(viewId);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}