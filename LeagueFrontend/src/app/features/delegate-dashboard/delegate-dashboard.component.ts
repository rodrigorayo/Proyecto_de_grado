import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TeamService } from '../../services/team.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-delegate-dashboard',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, FormsModule],
  templateUrl: './delegate-dashboard.component.html', // 👈 Conectado al HTML separado
  styleUrls: ['./delegate-dashboard.component.css']
})
export class DelegateDashboardComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private teamService = inject(TeamService);
  private playerService = inject(PlayerService);

  // --- ESTADO DE LA VISTA ---
  currentView = signal<string>('dashboard');
  
  // --- DATOS REALES ---
  teams = signal<any[]>([]);
  selectedTeamId = signal<string>('');
  players = signal<any[]>([]); 
  
  isLoading = signal(false);
  isSubmitting = signal(false);

  // --- DATOS MOCK (Relleno visual para gráficas/noticias) ---
  latestResults = signal([
    { id: 1, opponent: 'Atlético FC', date: '2024-10-26', score: '3 - 1', status: 'Victoria' },
    { id: 2, opponent: 'Unión SC', date: '2024-10-19', score: '0 - 2', status: 'Derrota' }
  ]);
  
  // --- FORMULARIOS ---
  // Formulario para editar datos del equipo (Colores, DT)
  editTeamForm = this.fb.group({
    name: [{ value: '', disabled: true }], 
    coach: ['', Validators.required],
    colorHome: ['#34a01c', Validators.required],
    colorAway: ['#ffffff', Validators.required]
  });

  // Formulario para crear jugador
  playerForm = this.fb.group({
    name: ['', Validators.required], 
    lastName: [''], 
    ci: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    birthDate: ['', Validators.required],
    position: ['', Validators.required],
    dorsal: [1, [Validators.required, Validators.min(1)]]
  });

  // --- INICIALIZACIÓN ---
  ngOnInit() {
    this.loadTeams();
  }

  // 1. Cargar Equipos (Usando getTeams para no romper Admin)
  loadTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.teams.set(data);
        if (data.length > 0) {
          // Auto-seleccionar el primer equipo
          this.selectedTeamId.set(data[0].id);
          this.loadPlayers();
          
          // Llenar formulario visual del equipo
          this.editTeamForm.patchValue({ name: data[0].name });
        }
      },
      error: (e) => console.error('Error cargando equipos', e)
    });
  }

  // Selector de equipo
  onTeamChange(event: any) {
    this.selectedTeamId.set(event.target.value);
    this.loadPlayers();
  }

  // 2. Cargar Jugadores (Usando getPlayersByTeam)
  loadPlayers() {
    const teamId = this.selectedTeamId();
    if (!teamId) return;

    this.isLoading.set(true);
    this.playerService.getPlayersByTeam(teamId).subscribe({
      next: (data) => {
        console.log('Jugadores cargados:', data);
        this.players.set(data);
        this.isLoading.set(false);
      },
      error: (e) => {
        console.error(e);
        this.isLoading.set(false);
        this.players.set([]);
      }
    });
  }

  // 3. Crear Jugador (Usando createPlayer)
  onSubmitPlayer() {
    if (this.playerForm.valid && this.selectedTeamId()) {
      this.isSubmitting.set(true);
      const val = this.playerForm.value;

      // Creamos el objeto tal cual lo espera el Backend
      const newPlayer = {
        teamId: this.selectedTeamId(),
        name: `${val.name} ${val.lastName || ''}`.trim(),
        dorsal: val.dorsal,
        position: val.position,
        ci: val.ci,
        // birthDate: val.birthDate // Habilita esto si tu backend lo guarda
      };

      this.playerService.createPlayer(newPlayer).subscribe({
        next: () => {
          alert('✅ Jugador inscrito exitosamente.');
          this.loadPlayers(); // Recargar lista
          this.playerForm.reset({ dorsal: 1, position: '' });
          this.currentView.set('mis-jugadores'); 
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error(err);
          // Mensaje de error amigable
          const msg = err.error?.error || 'Error al guardar. Verifique si el dorsal ya existe.';
          alert(`❌ ${msg}`);
          this.isSubmitting.set(false);
        }
      });
    }
  }

  // 4. Eliminar Jugador (Usando deletePlayer)
  deletePlayer(id: string) {
    if(confirm('¿Estás seguro de eliminar este jugador? Esta acción no se puede deshacer.')) {
      this.playerService.deletePlayer(id).subscribe({
        next: () => {
          this.loadPlayers();
          alert('Jugador eliminado correctamente.');
        },
        error: (e) => alert('Error al eliminar el jugador.')
      });
    }
  }

  // --- NAVEGACIÓN LATERAL ---
  menuItems = signal([
    { id: 'dashboard', label: 'Dashboard', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>' },
    { id: 'mi-equipo', label: 'Mi Equipo', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>' },
    { id: 'mis-jugadores', label: 'Mis Jugadores', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>' },
  ]);

  navigate(event: Event, viewId: string) {
    event.preventDefault();
    this.currentView.set(viewId);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}