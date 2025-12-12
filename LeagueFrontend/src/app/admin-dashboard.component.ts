import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { TeamService } from './services/team.service';
import { PlayerService } from './services/player.service';
import { TournamentService } from './services/tournament.service'; // <--- NUEVO

// --- INTERFACES ---
interface NewsItem { id: number; title: string; body: string; date: string; status: 'DRAFT' | 'PUBLISHED'; matchInfo?: string; image: string; }
interface FinishedMatch { id: number; homeTeam: string; awayTeam: string; score: string; date: string; }
interface PredictionResult { homeProb: number; drawProb: number; awayProb: number; confidence: 'Alta' | 'Media' | 'Baja'; }
interface PredictionMatch { id: number; homeTeam: string; awayTeam: string; date: string; time: string; venue: string; homeLogo?: string; awayLogo?: string; result?: PredictionResult; loading?: boolean; }
interface User { id: number; name: string; email: string; role: 'Administrador' | 'Delegado' | 'Árbitro' | 'Aficionado'; status: 'Activo' | 'Inactivo'; teamId?: number; avatar: string; }
interface AuditLog { id: number; user: string; action: string; timestamp: string; type: 'info' | 'warning' | 'danger'; }
interface LeagueRules { pointsPerWin: number; pointsPerDraw: number; yellowCardsLimit: number; }

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, FormsModule],
  template: `
    <div class="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      
      <aside class="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20">
        <div class="h-16 flex items-center px-6 border-b border-gray-50">
           <svg class="w-6 h-6 text-[#388e14] mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
           <span class="text-lg font-bold text-[#388e14] tracking-tight">LigaAdmin</span>
        </div>
        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
           @for (item of menuItems(); track item.id) {
             <a href="#" (click)="navigate($event, item.id)" 
                class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group"
                [ngClass]="{'bg-gray-100 text-gray-900': currentView() === item.id, 'text-gray-500 hover:bg-gray-50 hover:text-gray-900': currentView() !== item.id}">
                <span class="mr-3" [innerHTML]="item.icon"></span>
                {{ item.label }}
             </a>
           }
        </nav>
        <div class="p-4 border-t border-gray-100">
            <button (click)="logout()" class="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg transition-colors font-semibold text-sm shadow-sm">Cerrar Sesión</button>
        </div>
      </aside>

      <div class="ml-64 flex-1 flex flex-col min-w-0">
        <header class="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
           <h1 class="text-xl font-bold text-gray-800 capitalize">{{ currentView().replace('-', ' ') }}</h1>
           <div class="flex items-center gap-4"><span class="text-sm font-medium text-gray-600">Admin</span><div class="w-9 h-9 bg-[#388e14] rounded-full flex items-center justify-center text-white font-bold">A</div></div>
        </header>

        <div class="p-8 pb-20">
          
          @if (currentView() === 'dashboard') {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between"><div><p class="text-sm font-medium text-gray-500 mb-1">Total Equipos</p><h3 class="text-3xl font-bold text-gray-900">{{ teamsList().length }}</h3></div><div class="p-2 bg-green-50 rounded-lg text-[#388e14]"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg></div></div>
               <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between"><div><p class="text-sm font-medium text-gray-500 mb-1">Total Jugadores</p><h3 class="text-3xl font-bold text-gray-900">{{ globalPlayerCount() }}</h3></div><div class="p-2 bg-blue-50 rounded-lg text-blue-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div></div>
               <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between"><div><p class="text-sm font-medium text-gray-500 mb-1">Torneos</p><h3 class="text-3xl font-bold text-gray-900">{{ tournamentsList().length }}</h3></div><div class="p-2 bg-yellow-50 rounded-lg text-yellow-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <button (click)="currentView.set('registrar-equipo')" class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-[#388e14]"><span class="font-bold text-2xl text-[#388e14]">+</span><span class="font-medium text-sm">Nuevo Equipo</span></button>
               <button (click)="currentView.set('registrar-jugador')" class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-[#388e14]"><span class="font-bold text-2xl text-[#388e14]">+</span><span class="font-medium text-sm">Nuevo Jugador</span></button>
               <button (click)="currentView.set('configuracion')" class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-[#388e14]"><span class="font-bold text-2xl text-[#388e14]">+</span><span class="font-medium text-sm">Nuevo Torneo</span></button>
            </div>

          } @else if (currentView() === 'equipos') {
            <div class="flex justify-between items-end mb-6">
               <h2 class="text-2xl font-bold text-gray-900">Gestión de Equipos</h2>
               <button (click)="startCreatingTeam()" class="bg-[#388e14] hover:bg-[#2e7510] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">+ Registrar Equipo</button>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
               <table class="w-full text-left">
                  <thead class="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                     <tr><th class="px-6 py-3">Nombre</th><th class="px-6 py-3">Categoría</th><th class="px-6 py-3 text-right">Acciones</th></tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                     @for (team of teamsList(); track team.id) {
                        <tr class="hover:bg-gray-50 text-sm">
                           <td class="px-6 py-4 font-medium text-gray-900">{{ team.name }}</td>
                           <td class="px-6 py-4 text-gray-600">{{ team.category }}</td>
                           <td class="px-6 py-4 text-right">
                              <button (click)="startEditingTeam(team)" class="text-blue-600 p-1 mr-2">Editar</button>
                              <button (click)="deleteTeam(team)" class="text-red-600 p-1">Borrar</button>
                           </td>
                        </tr>
                     } @empty { <tr><td colspan="3" class="px-6 py-8 text-center text-gray-500">Sin datos.</td></tr> }
                  </tbody>
               </table>
            </div>

          } @else if (currentView() === 'registrar-equipo') {
             <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h2 class="text-xl font-bold text-gray-900 mb-6">{{ editingTeamId() ? 'Editar Equipo' : 'Registrar Nuevo Equipo' }}</h2>
                <form [formGroup]="teamForm" (ngSubmit)="onSubmitTeam()" class="space-y-6">
                   <div><label class="block text-sm font-medium text-gray-700">Nombre</label><input formControlName="name" class="w-full border rounded-lg px-4 py-2"></div>
                   <div><label class="block text-sm font-medium text-gray-700">Categoría</label><select formControlName="category" class="w-full border rounded-lg px-4 py-2 bg-white"><option>Primera A</option><option>Ascenso B</option><option>Senior</option></select></div>
                   <div class="flex gap-4 pt-4"><button type="button" (click)="finalizeTeamAction()" class="flex-1 border rounded-lg py-2">Cancelar</button><button type="submit" [disabled]="teamForm.invalid" class="flex-1 bg-[#388e14] text-white rounded-lg py-2">Guardar</button></div>
                </form>
             </div>

          } @else if (currentView() === 'jugadores') {
             <div class="flex flex-col gap-6">
                <div class="flex justify-between items-end">
                   <h2 class="text-2xl font-bold text-gray-900">Jugadores</h2>
                   <button (click)="startCreatingPlayer()" class="bg-[#388e14] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">+ Nuevo Jugador</button>
                </div>
                <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                   <label class="font-bold text-gray-700">Filtrar por Equipo:</label>
                   <select [ngModel]="selectedTeamId()" (ngModelChange)="onTeamFilterChange($event)" class="border rounded-lg px-4 py-2 w-64 bg-white">
                      <option [ngValue]="null" disabled selected>-- Selecciona --</option>
                      @for (team of teamsList(); track team.id) { <option [value]="team.id">{{ team.name }}</option> }
                   </select>
                </div>
                @if (selectedTeamId()) {
                   <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <table class="w-full text-left">
                         <thead class="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase"><tr><th class="px-6 py-3">Nombre</th><th class="px-6 py-3">C.I.</th><th class="px-6 py-3">Pos</th><th class="px-6 py-3 text-right">Acciones</th></tr></thead>
                         <tbody class="divide-y divide-gray-100">
                            @for (player of playersList(); track player.id) {
                               <tr class="hover:bg-gray-50 text-sm">
                                  <td class="px-6 py-4 font-medium">{{ player.fullName }}</td>
                                  <td class="px-6 py-4">{{ player.ci }}</td>
                                  <td class="px-6 py-4">{{ player.positionLabel }}</td>
                                  <td class="px-6 py-4 text-right"><button (click)="startEditingPlayer(player)" class="text-blue-600 mr-2">Editar</button><button (click)="deletePlayer(player)" class="text-red-600">Borrar</button></td>
                               </tr>
                            } @empty { <tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">Sin jugadores.</td></tr> }
                         </tbody>
                      </table>
                   </div>
                } @else { <div class="p-12 text-center text-gray-400 bg-white border border-dashed rounded-lg">Selecciona un equipo.</div> }
             </div>

          } @else if (currentView() === 'registrar-jugador') {
             <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h2 class="text-xl font-bold text-gray-900 mb-6">{{ editingPlayerId() ? 'Editar Jugador' : 'Registrar Nuevo Jugador' }}</h2>
                <form [formGroup]="playerForm" (ngSubmit)="onSubmitPlayer()" class="space-y-6">
                   <div><label class="block text-sm font-medium text-gray-700">Equipo</label><select formControlName="teamId" class="w-full border rounded-lg px-4 py-2 bg-white"><option value="" disabled>Selecciona</option>@for (t of teamsList(); track t.id) {<option [value]="t.id">{{ t.name }}</option>}</select></div>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700">Nombre</label><input formControlName="fullName" class="w-full border rounded-lg px-4 py-2"></div>
                      <div><label class="block text-sm font-medium text-gray-700">C.I.</label><input formControlName="identityCard" class="w-full border rounded-lg px-4 py-2"></div>
                      <div><label class="block text-sm font-medium text-gray-700">Dorsal</label><input type="number" formControlName="jerseyNumber" class="w-full border rounded-lg px-4 py-2"></div>
                      <div><label class="block text-sm font-medium text-gray-700">Posición</label><select formControlName="position" class="w-full border rounded-lg px-4 py-2 bg-white"><option value="Goalkeeper">Arquero</option><option value="Defender">Defensor</option><option value="Midfielder">Medio</option><option value="Forward">Delantero</option></select></div>
                      <div><label class="block text-sm font-medium text-gray-700">Fecha Nac.</label><input type="date" formControlName="birthDate" class="w-full border rounded-lg px-4 py-2"></div>
                   </div>
                   <div class="flex gap-4 pt-4"><button type="button" (click)="finalizePlayerAction()" class="flex-1 border rounded-lg py-2">Cancelar</button><button type="submit" [disabled]="playerForm.invalid" class="flex-1 bg-[#388e14] text-white rounded-lg py-2">Guardar</button></div>
                </form>
             </div>

          } @else if (currentView() === 'configuracion') {
             <div class="flex flex-col gap-6">
                <div><h2 class="text-2xl font-bold text-gray-900">Gestión de Torneos</h2><p class="text-gray-500 text-sm">Crea y administra los campeonatos.</p></div>
                
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                   @if (showNewTournamentForm() || editingTournamentId()) {
                      <form [formGroup]="tournamentForm" (ngSubmit)="onSubmitTournament()">
                         <h3 class="font-bold text-gray-900 mb-4">{{ editingTournamentId() ? 'Editar Torneo' : 'Nuevo Torneo' }}</h3>
                         <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div class="md:col-span-3"><label class="text-xs font-bold text-gray-500">Nombre</label><input formControlName="name" class="w-full border rounded px-3 py-2"></div>
                            <div><label class="text-xs font-bold text-gray-500">Inicio</label><input type="date" formControlName="startDate" class="w-full border rounded px-3 py-2"></div>
                            <div><label class="text-xs font-bold text-gray-500">Fin (Opcional)</label><input type="date" formControlName="endDate" class="w-full border rounded px-3 py-2"></div>
                         </div>
                         <div class="flex gap-2 justify-end">
                            <button type="button" (click)="cancelTournamentEdit()" class="text-gray-500 font-medium text-sm">Cancelar</button>
                            <button type="submit" [disabled]="tournamentForm.invalid" class="bg-[#388e14] text-white px-4 py-2 rounded text-sm font-bold">Guardar</button>
                         </div>
                      </form>
                   } @else {
                      <div class="flex justify-between items-center">
                         <div><h3 class="font-bold text-gray-900">Panel de Control</h3><p class="text-sm text-gray-500">Gestiona los torneos activos e históricos.</p></div>
                         <button (click)="startCreatingTournament()" class="bg-[#388e14] text-white px-4 py-2 rounded text-sm font-bold">+ Crear Torneo</button>
                      </div>
                   }
                </div>

                <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                   <table class="w-full text-left">
                      <thead class="bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase"><tr><th class="px-6 py-3">Nombre</th><th class="px-6 py-3">Fechas</th><th class="px-6 py-3">Estado</th><th class="px-6 py-3 text-right">Acciones</th></tr></thead>
                      <tbody class="divide-y divide-gray-100">
                         @for (t of tournamentsList(); track t.id) {
                            <tr class="hover:bg-gray-50 text-sm">
                               <td class="px-6 py-4 font-medium">{{ t.name }}</td>
                               <td class="px-6 py-4 text-gray-600">{{ t.startDate | date:'shortDate' }} - {{ t.endDate ? (t.endDate | date:'shortDate') : '...' }}</td>
                               <td class="px-6 py-4">
                                  <span class="px-2 py-1 rounded text-xs font-bold" [ngClass]="(!t.endDate || isFuture(t.endDate)) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                                     {{ (!t.endDate || isFuture(t.endDate)) ? 'ACTIVO' : 'FINALIZADO' }}
                                  </span>
                               </td>
                               <td class="px-6 py-4 text-right">
                                  <button (click)="startEditingTournament(t)" class="text-blue-600 mr-2">Editar</button>
                                  <button (click)="deleteTournament(t)" class="text-red-600">Borrar</button>
                               </td>
                            </tr>
                         } @empty { <tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">No hay torneos.</td></tr> }
                      </tbody>
                   </table>
                </div>
             </div>

          } @else { <div class="p-12 text-center text-gray-500">Vista en construcción</div> }

        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private teamService = inject(TeamService);
  private playerService = inject(PlayerService);
  private tournamentService = inject(TournamentService);
  
  currentView = signal<string>('dashboard');
  
  // DATOS REALES
  teamsList = signal<any[]>([]);
  playersList = signal<any[]>([]);
  tournamentsList = signal<any[]>([]); // <--- HU-03
  
  globalPlayerCount = signal<number>(0);
  
  // ESTADOS EDICIÓN
  editingTeamId = signal<string | null>(null);
  selectedTeamId = signal<string | null>(null);
  editingPlayerId = signal<string | null>(null);
  
  // HU-03 ESTADOS
  editingTournamentId = signal<string | null>(null);
  showNewTournamentForm = signal<boolean>(false);

  // FORMS
  teamForm = this.fb.group({ name: ['', Validators.required], category: ['Primera A', Validators.required] });
  playerForm = this.fb.group({ teamId: ['', Validators.required], fullName: ['', Validators.required], identityCard: ['', Validators.required], jerseyNumber: ['', Validators.required], position: ['Midfielder', Validators.required], birthDate: [''] });
  
  // HU-03 FORM
  tournamentForm = this.fb.group({ name: ['', Validators.required], startDate: ['', Validators.required], endDate: [''] });

  // Dummy
  matchesManagementList = signal<any[]>([]);
  newsRepository = signal<any[]>([]);

  menuItems = signal([
    { id: 'dashboard', label: 'Dashboard', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>' },
    { id: 'equipos', label: 'Equipos', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>' },
    { id: 'jugadores', label: 'Jugadores', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>' },
    { id: 'configuracion', label: 'Configuración (Torneos)', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' }
  ]);

  ngOnInit() {
    this.loadRealTeams();
    this.loadTournaments(); // <--- Cargar Torneos al inicio
  }

  navigate(event: Event, viewId: string) { event.preventDefault(); this.currentView.set(viewId); }
  logout() { this.router.navigate(['/login']); }

  // --- EQUIPOS ---
  loadRealTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => {
        let total = 0;
        const mapped = data.map((t: any) => { const c = t.players?.length || 0; total += c; return { ...t, players: c }; });
        this.teamsList.set(mapped);
        this.globalPlayerCount.set(total);
      }
    });
  }
  startCreatingTeam() { this.editingTeamId.set(null); this.teamForm.reset({category: 'Primera A'}); this.currentView.set('registrar-equipo'); }
  startEditingTeam(t: any) { this.editingTeamId.set(t.id); this.teamForm.patchValue(t); this.currentView.set('registrar-equipo'); }
  deleteTeam(t: any) { if(confirm('Borrar?')) this.teamService.deleteTeam(t.id).subscribe(() => { this.loadRealTeams(); }); }
  onSubmitTeam() {
    if(this.teamForm.valid) {
      const d = {...this.teamForm.value, id: this.editingTeamId(), logoUrl: null};
      const r = this.editingTeamId() ? this.teamService.updateTeam(this.editingTeamId()!, d) : this.teamService.createTeam(d);
      r.subscribe(() => this.finalizeTeamAction());
    }
  }
  finalizeTeamAction() { this.loadRealTeams(); this.currentView.set('equipos'); this.editingTeamId.set(null); }

  // --- JUGADORES ---
  onTeamFilterChange(id: string) { this.selectedTeamId.set(id); this.loadPlayers(id); }
  loadPlayers(id: string) { 
    this.playerService.getPlayersByTeam(id).subscribe(d => {
      this.playersList.set(d.map((p:any) => ({...p, positionLabel: this.getPositionLabel(p.position)})));
    });
  }
  getPositionLabel(p: number) { return ['Arquero','Defensor','Medio','Delantero'][p] || 'Jugador'; }
  mapEnumToString(p: number) { return ['Goalkeeper','Defender','Midfielder','Forward'][p] || 'Midfielder'; }
  startCreatingPlayer() { this.editingPlayerId.set(null); this.playerForm.reset({ teamId: this.selectedTeamId() || '', position: 'Midfielder' }); this.currentView.set('registrar-jugador'); }
  startEditingPlayer(p: any) { 
    this.editingPlayerId.set(p.id); 
    this.playerForm.patchValue({ ...p, teamId: p.teamId, identityCard: p.ci, jerseyNumber: p.number, position: this.mapEnumToString(p.position), birthDate: p.birthDate?.split('T')[0] });
    this.currentView.set('registrar-jugador'); 
  }
  deletePlayer(p: any) { if(confirm('Borrar?')) this.playerService.deletePlayer(p.id).subscribe(() => { this.loadPlayers(this.selectedTeamId()!); this.loadRealTeams(); }); }
  onSubmitPlayer() {
    if(this.playerForm.valid) {
      const d = { id: this.editingPlayerId(), ...this.playerForm.value, ci: this.playerForm.value.identityCard, number: this.playerForm.value.jerseyNumber };
      const r = this.editingPlayerId() ? this.playerService.updatePlayer(this.editingPlayerId()!, d) : this.playerService.createPlayer(d);
      r.subscribe(() => this.finalizePlayerAction());
    }
  }
  finalizePlayerAction() {
    const tid = this.playerForm.get('teamId')?.value;
    if(tid) { this.selectedTeamId.set(tid); this.loadPlayers(tid); }
    this.loadRealTeams();
    this.currentView.set('jugadores');
    this.editingPlayerId.set(null);
  }

  // --- TORNEOS (HU-03 LOGIC) ---
  loadTournaments() {
    this.tournamentService.getAll().subscribe({
      next: (data) => this.tournamentsList.set(data),
      error: (e) => console.error(e)
    });
  }
  
  isFuture(dateString: string) { return new Date(dateString) > new Date(); }

  startCreatingTournament() { this.editingTournamentId.set(null); this.tournamentForm.reset(); this.showNewTournamentForm.set(true); }
  
  startEditingTournament(t: any) {
    this.editingTournamentId.set(t.id);
    this.tournamentForm.patchValue({ name: t.name, startDate: t.startDate.split('T')[0], endDate: t.endDate?.split('T')[0] });
    this.showNewTournamentForm.set(false); // Usamos el mismo form
  }

  cancelTournamentEdit() { this.editingTournamentId.set(null); this.showNewTournamentForm.set(false); }

  deleteTournament(t: any) {
    if(confirm(`Eliminar torneo "${t.name}"?`)) {
      this.tournamentService.delete(t.id).subscribe(() => { alert('Eliminado'); this.loadTournaments(); });
    }
  }

  onSubmitTournament() {
    if(this.tournamentForm.valid) {
      const d = { ...this.tournamentForm.value, id: this.editingTournamentId() };
      // Ajuste de fecha para que no envíe string vacío si es null
      if(!d.endDate) d.endDate = null;

      const req = this.editingTournamentId() 
        ? this.tournamentService.update(this.editingTournamentId()!, d) 
        : this.tournamentService.create(d);

      req.subscribe({
        next: () => { alert('Guardado!'); this.loadTournaments(); this.cancelTournamentEdit(); },
        error: (e) => alert('Error: ' + e.message)
      });
    }
  }
}