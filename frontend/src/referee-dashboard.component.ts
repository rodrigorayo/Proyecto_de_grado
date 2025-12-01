
import { Component, signal, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-referee-dashboard',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, FormsModule],
  template: `
    <div class="flex min-h-screen bg-white font-sans text-gray-800">
      
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-gray-50">
           <svg class="w-6 h-6 text-[#4a9f24] mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
           </svg>
           <span class="text-xl font-bold text-[#4a9f24] tracking-tight">SilbatoÁgil</span>
        </div>

        <!-- Menu -->
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
           @for (item of menuItems(); track item.id) {
             <a href="#" (click)="navigate($event, item.id)"
                class="flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors group"
                [ngClass]="{
                  'bg-gray-100 text-gray-900': currentView() === item.id,
                  'text-gray-500 hover:bg-gray-50 hover:text-gray-900': currentView() !== item.id
                }">
                <span class="mr-3" [innerHTML]="item.icon"></span>
                {{ item.label }}
             </a>
           }
        </nav>

        <!-- Logout Button -->
        <div class="p-4 border-t border-gray-100">
            <button (click)="logout()" class="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg transition-colors font-semibold text-sm shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Cerrar Sesión
            </button>
        </div>
      </aside>

      <!-- Main Content Layout -->
      <div class="ml-64 flex-1 flex flex-col min-w-0 bg-white">
        
        <!-- Header -->
        <header class="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
           <h1 class="text-lg font-bold text-gray-800">{{ getPageTitle() }}</h1>
           <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-gray-600">Árbitro Oficial</span>
              <img ngSrc="https://picsum.photos/id/1011/100/100" width="36" height="36" class="rounded-full border border-gray-200" alt="Avatar">
           </div>
        </header>

        <!-- Main Dashboard View -->
        <div class="p-8 max-w-7xl mx-auto w-full">
          
          @if (currentView() === 'dashboard') {
            <!-- DASHBOARD VIEW -->
            <div class="mb-8">
              <p class="text-sm text-gray-500">Bienvenido, revisa el estado de tus partidos asignados.</p>
            </div>

            <!-- Top Cards Row -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               
               <!-- Card 1: Pendientes -->
               <div class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
                 <div class="w-10 h-10 rounded-full bg-[#4a9f24] flex items-center justify-center text-white mb-4">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 </div>
                 <div class="flex items-baseline gap-2 mb-1">
                   <h3 class="text-4xl font-bold text-gray-900">{{ countPending() }}</h3>
                 </div>
                 <p class="text-sm font-semibold text-gray-900 mb-1">Partidos Pendientes</p>
                 <p class="text-xs text-gray-400">Por arbitrar esta temporada.</p>
               </div>

               <!-- Card 2: Recientes -->
               <div class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
                 <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 </div>
                 <div class="flex items-baseline gap-2 mb-1">
                   <h3 class="text-4xl font-bold text-gray-900">{{ countFinished() }}</h3>
                 </div>
                 <p class="text-sm font-semibold text-gray-900 mb-1">Partidos Finalizados</p>
                 <p class="text-xs text-gray-400">Actas cerradas correctamente.</p>
               </div>

               <!-- Card 3: Incidencias -->
               <div class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
                 <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-4">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                 </div>
                 <div class="flex items-baseline gap-2 mb-1">
                   <h3 class="text-4xl font-bold text-gray-900">3</h3>
                 </div>
                 <p class="text-sm font-semibold text-gray-900 mb-1">Incidencias Registradas</p>
                 <p class="text-xs text-gray-400">Tarjetas rojas reportadas.</p>
               </div>

            </div>

            <!-- Actions -->
            <div class="flex gap-4 mb-10">
              <button (click)="currentView.set('partidos')" class="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Ver Mi Calendario
              </button>
            </div>

            <!-- Recent Table -->
            <div class="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="text-lg font-bold text-gray-900">Próximos Partidos Asignados</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                                <th class="px-6 py-3 font-medium">Fecha</th>
                                <th class="px-6 py-3 font-medium">Encuentro</th>
                                <th class="px-6 py-3 font-medium">Lugar</th>
                                <th class="px-6 py-3 font-medium">Estado</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                             @for (match of matchesList().slice(0, 5); track match.id) {
                                <tr class="text-sm hover:bg-gray-50">
                                    <td class="px-6 py-4 text-gray-600">{{ match.date }}</td>
                                    <td class="px-6 py-4 font-bold text-gray-900">{{ match.home }} vs {{ match.away }}</td>
                                    <td class="px-6 py-4 text-gray-500">{{ match.location }}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-2 py-1 rounded-full text-xs font-bold border"
                                            [class.bg-yellow-50]="match.status === 'Pendiente'"
                                            [class.text-yellow-700]="match.status === 'Pendiente'"
                                            [class.border-yellow-200]="match.status === 'Pendiente'"
                                            [class.bg-green-50]="match.status === 'Finalizado'"
                                            [class.text-green-700]="match.status === 'Finalizado'"
                                            [class.border-green-200]="match.status === 'Finalizado'">
                                            {{ match.status }}
                                        </span>
                                    </td>
                                </tr>
                             }
                        </tbody>
                    </table>
                </div>
            </div>

          } @else if (currentView() === 'partidos') {
            <!-- MATCHES VIEW -->
             <div class="flex flex-col gap-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-900">Listado de Partidos</h2>
                    <div class="flex gap-2">
                        <span class="px-3 py-1 bg-yellow-50 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200">Pendientes: {{ countPending() }}</span>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50 uppercase tracking-wider">
                                    <th class="px-6 py-4">Fecha/Hora</th>
                                    <th class="px-6 py-4">Local</th>
                                    <th class="px-6 py-4">Visitante</th>
                                    <th class="px-6 py-4">Lugar</th>
                                    <th class="px-6 py-4 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                @for (match of matchesList(); track match.id) {
                                    <tr class="text-sm hover:bg-gray-50 transition-colors">
                                        <td class="px-6 py-4">
                                            <div class="flex flex-col">
                                                <span class="font-bold text-gray-900">{{ match.date }}</span>
                                                <span class="text-xs text-gray-500">{{ match.time }}</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 font-medium text-gray-800">{{ match.home }}</td>
                                        <td class="px-6 py-4 font-medium text-gray-800">{{ match.away }}</td>
                                        <td class="px-6 py-4 text-gray-600">{{ match.location }}</td>
                                        <td class="px-6 py-4 text-center">
                                            @if (match.status === 'Pendiente') {
                                                <button (click)="openReportForm(match)" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded shadow-sm text-white bg-[#4a9f24] hover:bg-[#3d8b1e] transition-colors focus:outline-none">
                                                    Registrar Acta
                                                </button>
                                            } @else {
                                                <button disabled class="inline-flex items-center px-3 py-1.5 border border-gray-200 bg-gray-50 text-gray-400 text-xs font-bold rounded cursor-not-allowed">
                                                    Acta Cerrada
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>

          } @else if (currentView() === 'registrar-acta') {
             <!-- REPORT FORM VIEW -->
             <div class="flex flex-col gap-6 animate-fade-in">
                <div class="flex items-center gap-4">
                    <button (click)="currentView.set('partidos')" class="text-gray-400 hover:text-[#4a9f24] transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </button>
                    <h2 class="text-2xl font-bold text-gray-900">Registrar Acta del Partido</h2>
                </div>

                @if (selectedMatch()) {
                    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <!-- Match Header Info -->
                        <div class="bg-gray-50 px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div class="text-center md:text-left">
                                <h3 class="text-lg font-bold text-gray-800">{{ selectedMatch()!.home }} vs {{ selectedMatch()!.away }}</h3>
                                <p class="text-sm text-gray-500">{{ selectedMatch()!.date }} • {{ selectedMatch()!.location }}</p>
                            </div>
                            <div class="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                                <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">ID Partido</span>
                                <span class="ml-2 font-mono font-bold text-gray-800">#{{ selectedMatch()!.id }}</span>
                            </div>
                        </div>

                        <form [formGroup]="reportForm" (ngSubmit)="submitReport()" class="p-8 space-y-8">
                            
                            <!-- Score Section -->
                            <div>
                                <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2 mb-4">Marcador Final</h4>
                                <div class="flex items-center justify-center gap-8 bg-gray-50 p-6 rounded-lg">
                                    <div class="text-center">
                                        <label class="block text-xs font-bold text-gray-500 mb-2">{{ selectedMatch()!.home }}</label>
                                        <input type="number" formControlName="homeScore" min="0" class="w-20 h-20 text-center text-4xl font-bold text-gray-900 border border-gray-300 rounded-lg focus:ring-4 focus:ring-[#4a9f24]/20 focus:border-[#4a9f24] focus:outline-none">
                                    </div>
                                    <span class="text-4xl font-light text-gray-300">-</span>
                                    <div class="text-center">
                                        <label class="block text-xs font-bold text-gray-500 mb-2">{{ selectedMatch()!.away }}</label>
                                        <input type="number" formControlName="awayScore" min="0" class="w-20 h-20 text-center text-4xl font-bold text-gray-900 border border-gray-300 rounded-lg focus:ring-4 focus:ring-[#4a9f24]/20 focus:border-[#4a9f24] focus:outline-none">
                                    </div>
                                </div>
                            </div>

                            <!-- Incidents / Comments -->
                            <div>
                                <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2 mb-4">Informe Arbitral & Incidencias</h4>
                                <p class="text-xs text-gray-500 mb-2">Detalle tarjetas amarillas, rojas, comportamiento de las barras o cualquier evento relevante.</p>
                                <textarea formControlName="incidents" rows="6" class="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-[#4a9f24]/20 focus:border-[#4a9f24] focus:outline-none text-sm leading-relaxed" placeholder="Ej: Min 15: Tarjeta Amarilla jugador #10 Local por falta temeraria..."></textarea>
                            </div>

                            <!-- Fair Play Check -->
                            <div class="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-lg">
                                <input type="checkbox" id="fairPlay" class="w-5 h-5 text-[#4a9f24] focus:ring-[#4a9f24] border-gray-300 rounded">
                                <label for="fairPlay" class="text-sm text-green-800 font-medium cursor-pointer">Confirmo que el partido se desarrolló bajo los estándares de Fair Play de la liga.</label>
                            </div>

                            <!-- Actions -->
                            <div class="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                <button type="button" (click)="currentView.set('partidos')" class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm">Cancelar</button>
                                <button type="submit" [disabled]="reportForm.invalid" class="px-6 py-3 bg-[#4a9f24] hover:bg-[#3d8b1e] text-white rounded-lg font-bold shadow-lg shadow-green-900/10 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                    Cerrar Acta Oficial
                                </button>
                            </div>

                        </form>
                    </div>
                }
             </div>

          } @else if (currentView() === 'posiciones') {
            <!-- STANDINGS VIEW (Read Only) -->
            <div class="flex flex-col gap-6">
               <h2 class="text-2xl font-bold text-gray-900">Tabla de Posiciones</h2>
               <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div class="overflow-x-auto">
                     <table class="w-full text-left">
                        <thead>
                           <tr class="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50 uppercase tracking-wider">
                              <th class="px-6 py-4">Pos</th>
                              <th class="px-6 py-4 w-1/3">Equipo</th>
                              <th class="px-6 py-4 text-center">PJ</th>
                              <th class="px-6 py-4 text-center">PG</th>
                              <th class="px-6 py-4 text-center">PE</th>
                              <th class="px-6 py-4 text-center">PP</th>
                              <th class="px-6 py-4 text-right">Pts</th>
                           </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                           @for (team of standingsList(); track team.pos) {
                              <tr class="hover:bg-gray-50 text-sm text-gray-700">
                                 <td class="px-6 py-4 font-medium">{{ team.pos }}</td>
                                 <td class="px-6 py-4 font-bold text-gray-900">{{ team.team }}</td>
                                 <td class="px-6 py-4 text-center">{{ team.pj }}</td>
                                 <td class="px-6 py-4 text-center">{{ team.pg }}</td>
                                 <td class="px-6 py-4 text-center">{{ team.pe }}</td>
                                 <td class="px-6 py-4 text-center">{{ team.pp }}</td>
                                 <td class="px-6 py-4 text-right font-bold text-[#4a9f24]">{{ team.pts }}</td>
                              </tr>
                           }
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

          } @else if (currentView() === 'noticias') {
             <!-- NEWS VIEW (Read Only) -->
             <div class="flex flex-col gap-6">
               <h2 class="text-2xl font-bold text-gray-900">Noticias de la Liga</h2>
               <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  @for (news of newsList(); track news.id) {
                     <div class="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                        <div class="h-40 bg-gray-200 relative">
                             <img [ngSrc]="news.image" width="400" height="250" class="w-full h-full object-cover" [alt]="news.title">
                        </div>
                        <div class="p-5 flex-1">
                           <h3 class="font-bold text-gray-900 mb-2">{{ news.title }}</h3>
                           <p class="text-xs text-gray-500 mb-3">{{ news.date }}</p>
                           <p class="text-sm text-gray-600 line-clamp-3">{{ news.excerpt }}</p>
                        </div>
                     </div>
                  }
               </div>
             </div>
          }

        </div>
      </div>
    </div>
  `
})
export class RefereeDashboardComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // State
  currentView = signal<string>('dashboard');
  
  // Data
  matchesList = signal([
    { id: 201, date: '2024-11-10', time: '14:00', home: 'Los Tigres', away: 'Halcones Azules', location: 'Estadio Central', status: 'Pendiente' },
    { id: 202, date: '2024-11-10', time: '16:30', home: 'Pumas FC', away: 'Guerreros Blancos', location: 'Cancha Norte', status: 'Pendiente' },
    { id: 203, date: '2024-11-11', time: '18:00', home: 'Estrellas Rojas', away: 'Deportiva Unión', location: 'Estadio Central', status: 'Pendiente' },
    { id: 198, date: '2024-11-03', time: '15:00', home: 'Rayo Veloz', away: 'Titanes FC', location: 'Cancha Sur', status: 'Finalizado' },
    { id: 195, date: '2024-11-02', time: '10:00', home: 'Fuerza Verde', away: 'Águilas Azules', location: 'Estadio Central', status: 'Finalizado' },
    { id: 190, date: '2024-10-28', time: '19:00', home: 'Los Leones', away: 'Dragones Rojos', location: 'Cancha Norte', status: 'Finalizado' },
    { id: 188, date: '2024-10-27', time: '16:00', home: 'Escorpiones FC', away: 'Unión Deportiva', location: 'Estadio Central', status: 'Finalizado' },
  ]);

  standingsList = signal([
    { pos: 1, team: 'Los Gigantes', pj: 10, pg: 8, pe: 1, pp: 1, pts: 25 },
    { pos: 2, team: 'Fuerza Verde', pj: 10, pg: 7, pe: 2, pp: 1, pts: 23 },
    { pos: 3, team: 'Campeones B', pj: 8, pg: 7, pe: 1, pp: 0, pts: 22 },
    { pos: 4, team: 'Rayo Veloz', pj: 10, pg: 6, pe: 3, pp: 1, pts: 21 },
    { pos: 5, team: 'Estrellas del Norte', pj: 8, pg: 6, pe: 1, pp: 1, pts: 19 },
  ]);

  newsList = signal([
    { id: 1, title: 'Nuevas Reglas de Arbitraje 2024', date: '01 Nov 2024', excerpt: 'Circular oficial sobre las modificaciones a la regla del fuera de juego y manos en el área.', image: 'https://picsum.photos/id/100/400/250' },
    { id: 2, title: 'Seminario de Capacitación Arbitral', date: '28 Oct 2024', excerpt: 'Este fin de semana se llevará a cabo el seminario anual de actualización para árbitros de primera división.', image: 'https://picsum.photos/id/160/400/250' },
  ]);

  // Logic for Reporting
  selectedMatch = signal<any>(null);
  
  reportForm = this.fb.group({
      homeScore: [0, [Validators.required, Validators.min(0)]],
      awayScore: [0, [Validators.required, Validators.min(0)]],
      incidents: ['']
  });

  // Computed Values (simulated via methods for simplicity in this pattern)
  countPending() {
    return this.matchesList().filter(m => m.status === 'Pendiente').length;
  }
  
  countFinished() {
    return this.matchesList().filter(m => m.status === 'Finalizado').length;
  }

  // Navigation
  menuItems = signal([
    { id: 'dashboard', label: 'Dashboard', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>' },
    { id: 'partidos', label: 'Mis Partidos', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
    { id: 'posiciones', label: 'Posiciones', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>' },
    { id: 'noticias', label: 'Noticias', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9"></path></svg>' },
  ]);

  navigate(event: Event, viewId: string) {
    event.preventDefault();
    this.currentView.set(viewId);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  getPageTitle(): string {
      const map: Record<string, string> = {
          'dashboard': 'Panel Principal',
          'partidos': 'Calendario de Partidos',
          'registrar-acta': 'Registro de Resultados',
          'posiciones': 'Tabla General',
          'noticias': 'Noticias & Circulares'
      };
      return map[this.currentView()] || 'Panel del Árbitro';
  }

  // Methods for Actions
  openReportForm(match: any) {
      this.selectedMatch.set(match);
      this.reportForm.reset({ homeScore: 0, awayScore: 0, incidents: '' });
      this.currentView.set('registrar-acta');
  }

  submitReport() {
      if (this.reportForm.valid && this.selectedMatch()) {
          const formVal = this.reportForm.value;
          
          // Update local list (Mock backend)
          this.matchesList.update(list => list.map(m => {
              if (m.id === this.selectedMatch().id) {
                  return { ...m, status: 'Finalizado' };
              }
              return m;
          }));

          alert(`Acta registrada correctamente.\nMarcador: ${formVal.homeScore} - ${formVal.awayScore}`);
          this.selectedMatch.set(null);
          this.currentView.set('partidos');
      }
  }
}
