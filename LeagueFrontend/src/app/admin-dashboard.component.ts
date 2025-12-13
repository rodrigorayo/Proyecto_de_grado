import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TeamService } from './services/team.service';
import { PlayerService } from './services/player.service';
import { TournamentService } from './services/tournament.service';
import { MatchService } from './services/match.service';
import { StandingService } from './services/standing.service';
import { MatchEventService } from './services/match-event.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
               <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between"><div><p class="text-sm font-medium text-gray-500 mb-1">Total Equipos</p><h3 class="text-3xl font-bold text-gray-900">{{ teamsList().length }}</h3></div><div class="p-2 bg-green-50 rounded-lg text-[#388e14]"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg></div></div>
               <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between"><div><p class="text-sm font-medium text-gray-500 mb-1">Total Jugadores</p><h3 class="text-3xl font-bold text-gray-900">{{ globalPlayerCount() }}</h3></div><div class="p-2 bg-blue-50 rounded-lg text-blue-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div></div>
               <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between"><div><p class="text-sm font-medium text-gray-500 mb-1">Partidos</p><h3 class="text-3xl font-bold text-gray-900">{{ matchesList().length }}</h3></div><div class="p-2 bg-yellow-50 rounded-lg text-yellow-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div></div>
               <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between"><div><p class="text-sm font-medium text-gray-500 mb-1">Torneos</p><h3 class="text-3xl font-bold text-gray-900">{{ tournamentsList().length }}</h3></div><div class="p-2 bg-purple-50 rounded-lg text-purple-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9"/></svg></div></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <button (click)="currentView.set('registrar-equipo')" class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-[#388e14]"><span class="font-bold text-2xl text-[#388e14]">+</span><span class="font-medium text-sm">Nuevo Equipo</span></button>
               <button (click)="currentView.set('registrar-jugador')" class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-[#388e14]"><span class="font-bold text-2xl text-[#388e14]">+</span><span class="font-medium text-sm">Nuevo Jugador</span></button>
               <button (click)="currentView.set('partidos')" class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-[#388e14]"><span class="font-bold text-2xl text-[#388e14]">+</span><span class="font-medium text-sm">Gestionar Partidos</span></button>
            </div>

          } @else if (currentView() === 'equipos') {
            <div class="flex justify-between items-end mb-6">
               <h2 class="text-2xl font-bold text-gray-900">Gestión de Equipos</h2>
               <button (click)="startCreatingTeam()" class="bg-[#388e14] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">+ Registrar Equipo</button>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
               <table class="w-full text-left">
                  <thead class="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase"><tr><th class="px-6 py-3">Nombre</th><th class="px-6 py-3">Categoría</th><th class="px-6 py-3 text-right">Acciones</th></tr></thead>
                  <tbody class="divide-y divide-gray-100">
                     @for (team of teamsList(); track team.id) {
                        <tr class="hover:bg-gray-50 text-sm">
                           <td class="px-6 py-4 font-medium">{{ team.name }}</td><td class="px-6 py-4">{{ team.category }}</td>
                           <td class="px-6 py-4 text-right">
                              <button (click)="startEditingTeam(team)" class="text-blue-600 mr-2">Editar</button><button (click)="deleteTeam(team)" class="text-red-600">Borrar</button>
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
                   <h2 class="text-2xl font-bold text-gray-900">Gestión de Jugadores</h2>
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
                                  <td class="px-6 py-4 font-medium">{{ player.fullName }}</td><td class="px-6 py-4">{{ player.ci }}</td><td class="px-6 py-4">{{ player.positionLabel }}</td>
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

          } @else if (currentView() === 'partidos') {
             <div class="flex flex-col gap-6">
                <div class="flex justify-between items-end">
                   <div><h2 class="text-2xl font-bold text-gray-900">Partidos</h2><p class="text-gray-500 text-sm">Fixture, Resultados y Minuto a Minuto</p></div>
                   <button (click)="startProgrammingMatch()" [disabled]="!selectedTournamentIdMatchView()" class="bg-[#388e14] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm disabled:opacity-50">+ Programar Partido</button>
                </div>

                <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                   <label class="font-bold text-gray-700">Torneo:</label>
                   <select [ngModel]="selectedTournamentIdMatchView()" (ngModelChange)="onTournamentFilterChange($event)" class="border rounded-lg px-4 py-2 w-64 bg-white">
                      <option [ngValue]="null" disabled selected>-- Elige un Torneo --</option>
                      @for (t of tournamentsList(); track t.id) { <option [value]="t.id">{{ t.name }}</option> }
                   </select>
                </div>

                @if (managingEventMatchId()) {
                   <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div class="bg-white p-6 rounded-xl shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
                         <h3 class="text-lg font-bold mb-4 text-gray-900">Gestionar Eventos</h3>
                         
                         <form [formGroup]="eventForm" (ngSubmit)="onSubmitEvent()" class="bg-gray-50 p-4 rounded-lg border mb-6">
                            <div class="grid grid-cols-2 gap-4 mb-4">
                               <div class="col-span-2">
                                  <label class="text-xs font-bold text-gray-500 uppercase">Jugador</label>
                                  <select formControlName="playerId" class="w-full border rounded p-2 bg-white text-sm">
                                     <option value="" disabled>Selecciona Jugador</option>
                                     <optgroup label="Local">
                                        @for (p of matchPlayers().home; track p.id) { <option [value]="p.id">{{ p.number }} - {{ p.fullName }}</option> }
                                     </optgroup>
                                     <optgroup label="Visitante">
                                        @for (p of matchPlayers().away; track p.id) { <option [value]="p.id">{{ p.number }} - {{ p.fullName }}</option> }
                                     </optgroup>
                                  </select>
                               </div>
                               <div>
                                  <label class="text-xs font-bold text-gray-500 uppercase">Tipo</label>
                                  <select formControlName="type" class="w-full border rounded p-2 bg-white text-sm">
                                     <option value="0">⚽ Gol</option>
                                     <option value="1">🟨 Amarilla</option>
                                     <option value="2">🟥 Roja</option>
                                  </select>
                               </div>
                               <div>
                                  <label class="text-xs font-bold text-gray-500 uppercase">Minuto</label>
                                  <input type="number" formControlName="minute" class="w-full border rounded p-2 text-sm" min="0" max="130">
                               </div>
                            </div>
                            <button type="submit" [disabled]="eventForm.invalid" class="w-full bg-[#388e14] text-white py-2 rounded font-bold text-sm hover:bg-green-700 transition-colors">+ Agregar Evento</button>
                         </form>

                         <h4 class="text-xs font-bold text-gray-500 uppercase mb-2">Historial del Partido</h4>
                         <div class="space-y-2 mb-6">
                            @for (evt of currentMatchEvents(); track evt.id) {
                               <div class="flex items-center justify-between p-2 bg-white border rounded text-sm">
                                  <div class="flex items-center gap-2">
                                     <span class="font-mono font-bold text-gray-500 w-8 text-right">{{ evt.minute }}'</span>
                                     <span>{{ evt.player?.fullName }}</span>
                                  </div>
                                  <span class="text-lg" [title]="getEventTypeLabel(evt.type)">{{ getEventTypeIcon(evt.type) }}</span>
                               </div>
                            } @empty { <div class="text-center text-gray-400 italic text-sm py-4">Sin eventos registrados.</div> }
                         </div>

                         <button (click)="closeEventModal()" class="w-full py-2 border rounded hover:bg-gray-50 text-gray-700">Cerrar y Volver</button>
                      </div>
                   </div>
                }

                @if (selectedTournamentIdMatchView()) {
                   <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <table class="w-full text-left">
                         <thead class="bg-white border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase"><tr><th class="px-6 py-3">Encuentro</th><th class="px-6 py-3">Estado</th><th class="px-6 py-3 text-right">Acciones</th></tr></thead>
                         <tbody class="divide-y divide-gray-100">
                            @for (match of matchesList(); track match.id) {
                               <tr class="hover:bg-gray-50 text-sm">
                                  <td class="px-6 py-4">
                                     <div class="flex flex-col items-center">
                                        <div class="flex items-center gap-2 font-bold text-gray-900">
                                           <span>{{ match.homeTeam?.name }}</span>
                                           <span class="text-gray-400 font-light">vs</span>
                                           <span>{{ match.awayTeam?.name }}</span>
                                        </div>
                                        <span class="text-xs text-gray-500">{{ match.matchDate | date:'dd/MM HH:mm' }}</span>
                                     </div>
                                  </td>
                                  <td class="px-6 py-4">
                                     <span class="px-2 py-1 rounded text-xs font-bold" [ngClass]="match.status === 0 ? 'bg-blue-100 text-blue-800' : (match.status === 2 ? 'bg-green-100 text-green-800' : 'bg-gray-200')">
                                        {{ getMatchStatus(match.status) }}
                                     </span>
                                     @if (match.status === 2) { <div class="text-center font-mono font-bold mt-1">{{ match.homeScore }} - {{ match.awayScore }}</div> }
                                  </td>
                                  <td class="px-6 py-4 text-right space-x-2">
                                     <button (click)="openEventModal(match)" class="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-2 py-1 rounded hover:bg-blue-50">
                                        Gestionar Eventos
                                     </button>
                                     @if (match.status !== 2) {
                                        <button (click)="finishMatchQuickly(match)" class="text-[#388e14] hover:text-green-800 font-medium text-xs border border-green-200 px-2 py-1 rounded hover:bg-green-50">
                                           Finalizar
                                        </button>
                                     }
                                  </td>
                               </tr>
                            } @empty { <tr><td colspan="4" class="px-6 py-12 text-center text-gray-500">No hay partidos.</td></tr> }
                         </tbody>
                      </table>
                   </div>
                } @else { <div class="p-12 text-center text-gray-400 bg-white border border-dashed rounded-lg">Selecciona un torneo.</div> }
             </div>

          } @else if (currentView() === 'programar-partido') {
             <div class="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h2 class="text-xl font-bold text-gray-900 mb-6">Programar Nuevo Partido</h2>
                <form [formGroup]="matchForm" (ngSubmit)="onSubmitMatch()" class="space-y-6">
                   <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <span class="text-xs font-bold text-gray-500 uppercase">Torneo Seleccionado</span>
                      <p class="font-bold text-gray-900">{{ getTournamentName(selectedTournamentIdMatchView()) }}</p>
                   </div>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label class="block text-sm font-medium text-gray-700 mb-1">Local</label><select formControlName="homeTeamId" class="w-full border rounded-lg px-4 py-2 bg-white"><option value="" disabled>Selecciona Local</option>@for (t of teamsList(); track t.id) { <option [value]="t.id">{{ t.name }} ({{ t.category }})</option> }</select></div>
                      <div><label class="block text-sm font-medium text-gray-700 mb-1">Visitante</label><select formControlName="awayTeamId" class="w-full border rounded-lg px-4 py-2 bg-white"><option value="" disabled>Selecciona Visitante</option>@for (t of teamsList(); track t.id) { <option [value]="t.id">{{ t.name }} ({{ t.category }})</option> }</select></div>
                   </div>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label class="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label><input type="datetime-local" formControlName="matchDate" class="w-full border rounded-lg px-4 py-2"></div>
                      <div><label class="block text-sm font-medium text-gray-700 mb-1">Lugar / Estadio</label><input type="text" formControlName="venue" class="w-full border rounded-lg px-4 py-2" placeholder="Ej: Cancha Principal"></div>
                   </div>
                   @if (matchForm.hasError('sameTeam')) { <div class="p-3 bg-red-50 text-red-700 text-sm rounded-lg">Error: Un equipo no puede jugar contra sí mismo.</div> }
                   <div class="flex gap-4 pt-4"><button type="button" (click)="currentView.set('partidos')" class="flex-1 border rounded-lg py-2">Cancelar</button><button type="submit" [disabled]="matchForm.invalid" class="flex-1 bg-[#388e14] text-white rounded-lg font-bold disabled:opacity-50">Programar</button></div>
                </form>
             </div>

          } @else if (currentView() === 'posiciones') {
             <div class="flex flex-col gap-6">
                <div><h2 class="text-2xl font-bold text-gray-900">Tabla de Posiciones</h2><p class="text-gray-500 text-sm">Clasificación en tiempo real.</p></div>
                <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                   <label class="font-bold text-gray-700">Torneo:</label>
                   <select [ngModel]="selectedTournamentIdStandingView()" (ngModelChange)="onStandingFilterChange($event)" class="border rounded-lg px-4 py-2 w-64 bg-white">
                      <option [ngValue]="null" disabled selected>-- Elige un Torneo --</option>
                      @for (t of tournamentsList(); track t.id) { <option [value]="t.id">{{ t.name }}</option> }
                   </select>
                </div>
                @if (selectedTournamentIdStandingView()) {
                   <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <table class="w-full text-left">
                         <thead class="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                               <th class="px-4 py-3 text-center">#</th>
                               <th class="px-4 py-3">Equipo</th>
                               <th class="px-4 py-3 text-center" title="Partidos Jugados">PJ</th>
                               <th class="px-4 py-3 text-center hidden md:table-cell" title="Ganados">PG</th>
                               <th class="px-4 py-3 text-center hidden md:table-cell" title="Empatados">PE</th>
                               <th class="px-4 py-3 text-center hidden md:table-cell" title="Perdidos">PP</th>
                               <th class="px-4 py-3 text-center hidden md:table-cell" title="Goles Favor">GF</th>
                               <th class="px-4 py-3 text-center hidden md:table-cell" title="Goles Contra">GC</th>
                               <th class="px-4 py-3 text-center" title="Diferencia de Goles">DG</th>
                               <th class="px-4 py-3 text-center font-black text-gray-900 bg-gray-50" title="Puntos">PTS</th>
                            </tr>
                         </thead>
                         <tbody class="divide-y divide-gray-100">
                            @for (team of standingsList(); track team.teamId; let i = $index) {
                               <tr class="hover:bg-gray-50 text-sm">
                                  <td class="px-4 py-3 text-center font-bold text-gray-400">{{ i + 1 }}</td>
                                  <td class="px-4 py-3 font-bold text-gray-900">{{ team.teamName }}</td>
                                  <td class="px-4 py-3 text-center">{{ team.played }}</td>
                                  <td class="px-4 py-3 text-center hidden md:table-cell text-green-600">{{ team.won }}</td>
                                  <td class="px-4 py-3 text-center hidden md:table-cell text-gray-500">{{ team.drawn }}</td>
                                  <td class="px-4 py-3 text-center hidden md:table-cell text-red-500">{{ team.lost }}</td>
                                  <td class="px-4 py-3 text-center hidden md:table-cell">{{ team.goalsFor }}</td>
                                  <td class="px-4 py-3 text-center hidden md:table-cell">{{ team.goalsAgainst }}</td>
                                  <td class="px-4 py-3 text-center font-medium">{{ team.goalDifference > 0 ? '+' : '' }}{{ team.goalDifference }}</td>
                                  <td class="px-4 py-3 text-center font-black text-lg text-[#388e14] bg-green-50">{{ team.points }}</td>
                               </tr>
                            } @empty { <tr><td colspan="10" class="px-6 py-12 text-center text-gray-500">No hay datos para calcular la tabla.</td></tr> }
                         </tbody>
                      </table>
                   </div>
                } @else { <div class="p-12 text-center text-gray-400 bg-white border border-dashed rounded-lg">Selecciona un torneo.</div> }
             </div>

          } @else if (currentView() === 'estadisticas') {
             <div class="flex flex-col gap-6">
                <div><h2 class="text-2xl font-bold text-gray-900">Tabla de Goleadores</h2><p class="text-gray-500 text-sm">Top 10 Máximos Anotadores</p></div>
                <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                   <table class="w-full text-left">
                      <thead class="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                         <tr>
                            <th class="px-6 py-3 text-center">#</th>
                            <th class="px-6 py-3">Jugador</th>
                            <th class="px-6 py-3">Equipo</th>
                            <th class="px-6 py-3 text-right">Goles</th>
                         </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                         @for (scorer of statsList(); track scorer.playerName; let i = $index) {
                            <tr class="hover:bg-gray-50 text-sm">
                               <td class="px-6 py-4 text-center font-bold text-gray-400">{{ i + 1 }}</td>
                               <td class="px-6 py-4 font-bold text-gray-900">{{ scorer.playerName }}</td>
                               <td class="px-6 py-4 text-gray-600">{{ scorer.teamName }}</td>
                               <td class="px-6 py-4 text-right font-mono font-bold text-[#388e14] text-lg">{{ scorer.goals }}</td>
                            </tr>
                         } @empty { <tr><td colspan="4" class="px-6 py-12 text-center text-gray-500">Aún no hay goles registrados.</td></tr> }
                      </tbody>
                   </table>
                </div>
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
                               <td class="px-6 py-4 font-medium">{{ t.name }}</td><td class="px-6 py-4 text-gray-600">{{ t.startDate | date:'shortDate' }} - {{ t.endDate ? (t.endDate | date:'shortDate') : '...' }}</td>
                               <td class="px-6 py-4"><span class="px-2 py-1 rounded text-xs font-bold" [ngClass]="(!t.endDate || isFuture(t.endDate)) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">{{ (!t.endDate || isFuture(t.endDate)) ? 'ACTIVO' : 'FINALIZADO' }}</span></td>
                               <td class="px-6 py-4 text-right"><button (click)="startEditingTournament(t)" class="text-blue-600 mr-2">Editar</button><button (click)="deleteTournament(t)" class="text-red-600">Borrar</button></td>
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
  private matchService = inject(MatchService);
  private standingService = inject(StandingService);
  private matchEventService = inject(MatchEventService);
  
  currentView = signal<string>('dashboard');
  
  // DATOS
  teamsList = signal<any[]>([]);
  playersList = signal<any[]>([]);
  tournamentsList = signal<any[]>([]);
  matchesList = signal<any[]>([]);
  standingsList = signal<any[]>([]);
  statsList = signal<any[]>([]); // <--- NUEVA LISTA PARA GOLEADORES
  
  // DATOS PARA EVENTOS (HU-09)
  matchPlayers = signal<{home: any[], away: any[]}>({home: [], away: []});
  currentMatchEvents = signal<any[]>([]);
  
  globalPlayerCount = signal<number>(0);
  
  // ESTADOS
  editingTeamId = signal<string | null>(null);
  selectedTeamId = signal<string | null>(null);
  editingPlayerId = signal<string | null>(null);
  editingTournamentId = signal<string | null>(null);
  showNewTournamentForm = signal<boolean>(false);
  selectedTournamentIdMatchView = signal<string | null>(null);
  selectedTournamentIdStandingView = signal<string | null>(null);
  registeringResultMatchId = signal<string | null>(null); // <--- Modal ID
  managingEventMatchId = signal<string | null>(null);

  // FORMS
  teamsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => { 
    const home = control.get('homeTeamId'); 
    const away = control.get('awayTeamId'); 
    return home && away && home.value === away.value ? { sameTeam: true } : null; 
  };

  teamForm = this.fb.group({ name: ['', Validators.required], category: ['Primera A', Validators.required] });
  playerForm = this.fb.group({ teamId: ['', Validators.required], fullName: ['', Validators.required], identityCard: ['', Validators.required], jerseyNumber: ['', Validators.required], position: ['Midfielder', Validators.required], birthDate: [''] });
  tournamentForm = this.fb.group({ name: ['', Validators.required], startDate: ['', Validators.required], endDate: [''] });
  matchForm = this.fb.group({ homeTeamId: ['', Validators.required], awayTeamId: ['', Validators.required], matchDate: ['', Validators.required], venue: ['Estadio Principal', Validators.required] }, { validators: this.teamsMatchValidator });
  
  // FORM RESULTADO (HU-05)
  resultForm = this.fb.group({
    homeScore: [0, [Validators.required, Validators.min(0)]],
    awayScore: [0, [Validators.required, Validators.min(0)]]
  });

  // FORM EVENTO (HU-09)
  eventForm = this.fb.group({
    playerId: ['', Validators.required],
    type: ['0', Validators.required], // 0=Gol, 1=Amarilla
    minute: [0, [Validators.required, Validators.min(0)]]
  });

  menuItems = signal([
    { id: 'dashboard', label: 'Dashboard', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>' },
    { id: 'equipos', label: 'Equipos', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>' },
    { id: 'jugadores', label: 'Jugadores', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>' },
    { id: 'partidos', label: 'Partidos', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' },
    { id: 'posiciones', label: 'Tabla Posiciones', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>' },
    { id: 'estadisticas', label: 'Estadísticas', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>' },
    { id: 'configuracion', label: 'Configuración', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' }
  ]);

  ngOnInit() {
    this.loadRealTeams();
    this.loadTournaments();
  }

  navigate(event: Event, viewId: string) { 
    event.preventDefault(); 
    this.currentView.set(viewId);
    if(viewId === 'estadisticas') this.loadTopScorers(); // <--- Cargar datos al entrar
  }
  
  logout() { this.router.navigate(['/login']); }

  // --- LOGICA DE DATOS ---
  loadRealTeams() { this.teamService.getTeams().subscribe(d => { this.teamsList.set(d); this.globalPlayerCount.set(d.reduce((a:any,b:any)=>a+(b.players?.length||0),0)); }); }
  loadTournaments() { this.tournamentService.getAll().subscribe(d => this.tournamentsList.set(d)); }
  
  // EQUIPOS, JUGADORES, TORNEOS (Lógica resumida)
  startCreatingTeam() { this.editingTeamId.set(null); this.teamForm.reset({category: 'Primera A'}); this.currentView.set('registrar-equipo'); }
  startEditingTeam(t: any) { this.editingTeamId.set(t.id); this.teamForm.patchValue(t); this.currentView.set('registrar-equipo'); }
  deleteTeam(t: any) { if(confirm('Borrar?')) this.teamService.deleteTeam(t.id).subscribe(() => this.loadRealTeams()); }
  onSubmitTeam() { if(this.teamForm.valid) { const d={...this.teamForm.value, id:this.editingTeamId()}; (this.editingTeamId()?this.teamService.updateTeam(this.editingTeamId()!,d):this.teamService.createTeam(d)).subscribe(()=>this.finalizeTeamAction()); } }
  finalizeTeamAction() { this.loadRealTeams(); this.currentView.set('equipos'); this.editingTeamId.set(null); }

  onTeamFilterChange(id: string) { this.selectedTeamId.set(id); this.loadPlayers(id); }
  loadPlayers(id: string) { this.playerService.getPlayersByTeam(id).subscribe(d => this.playersList.set(d.map((p:any)=>({...p, positionLabel:['ARQ','DEF','MED','DEL'][p.position]})))); }
  startCreatingPlayer() { this.editingPlayerId.set(null); this.playerForm.reset({ teamId: this.selectedTeamId()||'' }); this.currentView.set('registrar-jugador'); }
  startEditingPlayer(p: any) { this.editingPlayerId.set(p.id); this.playerForm.patchValue({...p, birthDate: p.birthDate?.split('T')[0]}); this.currentView.set('registrar-jugador'); }
  deletePlayer(p: any) { if(confirm('Borrar?')) this.playerService.deletePlayer(p.id).subscribe(()=>{ this.loadPlayers(this.selectedTeamId()!); this.loadRealTeams(); }); }
  onSubmitPlayer() { if(this.playerForm.valid) { const d={id:this.editingPlayerId(), ...this.playerForm.value, ci:this.playerForm.value.identityCard, number:this.playerForm.value.jerseyNumber}; (this.editingPlayerId()?this.playerService.updatePlayer(this.editingPlayerId()!,d):this.playerService.createPlayer(d)).subscribe(()=>this.finalizePlayerAction()); } }
  finalizePlayerAction() { if(this.playerForm.value.teamId) { this.selectedTeamId.set(this.playerForm.value.teamId!); this.loadPlayers(this.playerForm.value.teamId!); } this.loadRealTeams(); this.currentView.set('jugadores'); this.editingPlayerId.set(null); }

  isFuture(d: string) { return new Date(d) > new Date(); }
  startCreatingTournament() { this.editingTournamentId.set(null); this.tournamentForm.reset(); this.showNewTournamentForm.set(true); }
  startEditingTournament(t: any) { this.editingTournamentId.set(t.id); this.tournamentForm.patchValue({name:t.name, startDate:t.startDate.split('T')[0], endDate:t.endDate?.split('T')[0]}); this.showNewTournamentForm.set(false); }
  cancelTournamentEdit() { this.editingTournamentId.set(null); this.showNewTournamentForm.set(false); }
  deleteTournament(t: any) { if(confirm('Borrar?')) this.tournamentService.delete(t.id).subscribe(()=>this.loadTournaments()); }
  onSubmitTournament() { if(this.tournamentForm.valid) { const d={...this.tournamentForm.value, id:this.editingTournamentId()}; if(!d.endDate) d.endDate=null; (this.editingTournamentId()?this.tournamentService.update(this.editingTournamentId()!,d):this.tournamentService.create(d)).subscribe(()=>{alert('Ok'); this.loadTournaments(); this.cancelTournamentEdit();}); } }

  // --- PARTIDOS ---
  onTournamentFilterChange(id: string) { this.selectedTournamentIdMatchView.set(id); this.loadMatches(id); }
  loadMatches(id: string) { this.matchService.getMatchesByTournament(id).subscribe(d => this.matchesList.set(d)); }
  getMatchStatus(s: number) { return ['Programado','En Juego','Finalizado','Cancelado'][s]; }
  getTournamentName(id: string | null) { return id ? this.tournamentsList().find(t => t.id === id)?.name : ''; }
  
  startProgrammingMatch() {
    if(!this.selectedTournamentIdMatchView()) { alert('Selecciona torneo'); return; }
    this.matchForm.reset({venue:'Estadio Principal', matchDate: new Date().toISOString().slice(0,16)});
    this.currentView.set('programar-partido');
  }
  onSubmitMatch() {
    if(this.matchForm.valid) {
      this.matchService.createMatch({tournamentId: this.selectedTournamentIdMatchView(), ...this.matchForm.value}).subscribe({
        next:()=>{ alert('Creado'); this.loadMatches(this.selectedTournamentIdMatchView()!); this.currentView.set('partidos'); },
        error:(e)=>alert(e.error?.error||e.message)
      });
    }
  }

  // --- GESTIÓN DE EVENTOS (HU-09) ---
  openEventModal(match: any) {
    this.managingEventMatchId.set(match.id);
    this.eventForm.reset({ type: '0', minute: 0, playerId: '' });
    this.matchPlayers.set({home: [], away: []});
    this.currentMatchEvents.set([]);

    this.playerService.getPlayersByTeam(match.homeTeamId).subscribe(h => {
        this.playerService.getPlayersByTeam(match.awayTeamId).subscribe(a => {
            this.matchPlayers.set({ home: h, away: a });
        });
    });

    this.loadMatchEvents(match.id);
  }

  loadMatchEvents(matchId: string) {
    this.matchEventService.getEventsByMatch(matchId).subscribe(events => {
        this.currentMatchEvents.set(events);
    });
  }

  onSubmitEvent() {
    const matchId = this.managingEventMatchId();
    if(matchId && this.eventForm.valid) {
        const { playerId, type, minute } = this.eventForm.value;
        this.matchEventService.addEvent(matchId, playerId!, Number(type), minute!).subscribe({
            next: () => {
                this.loadMatchEvents(matchId);
                this.eventForm.patchValue({ minute: minute! + 1, type: '0' }); 
            },
            error: (e) => alert(e.error?.error || e.message)
        });
    }
  }

  closeEventModal() {
    this.managingEventMatchId.set(null);
    if(this.selectedTournamentIdMatchView()) {
        this.loadMatches(this.selectedTournamentIdMatchView()!);
    }
  }

  getEventTypeIcon(type: number) { return ['⚽', '🟨', '🟥', '🥅'][type] || '?'; }
  getEventTypeLabel(type: number) { return ['Gol', 'Amarilla', 'Roja', 'Autogol'][type] || 'Evento'; }

  // Finalizar rápido (Solo cambia estado, sin detalles)
  finishMatchQuickly(match: any) {
     const home = prompt('Goles Local:', '0');
     const away = prompt('Goles Visita:', '0');
     if(home !== null && away !== null) {
        this.matchService.registerResult(match.id, +home, +away).subscribe(() => this.loadMatches(this.selectedTournamentIdMatchView()!));
     }
  }

  // --- TABLA DE POSICIONES (HU-06) ---
  onStandingFilterChange(tournamentId: string) {
    this.selectedTournamentIdStandingView.set(tournamentId);
    this.standingService.getStandings(tournamentId).subscribe({
      next: (data) => this.standingsList.set(data),
      error: (e) => console.error(e)
    });
  }

  // --- ESTADÍSTICAS (NUEVO HU-09) ---
  loadTopScorers() {
    this.matchEventService.getTopScorers().subscribe({
        next: (data) => this.statsList.set(data),
        error: (e) => console.error(e)
    });
  }
}