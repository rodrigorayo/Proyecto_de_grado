import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TournamentService } from '../services/tournament.service';
import { StandingService } from '../services/standing.service';

@Component({
  selector: 'app-public-standings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <div class="max-w-5xl mx-auto">
          <div class="mb-8 text-center md:text-left">
             <h2 class="text-3xl font-black text-gray-900 mb-2 tracking-tight">Tabla de Posiciones</h2>
             <p class="text-gray-500">Clasificación oficial actualizada en tiempo real.</p>
          </div>

          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row items-center gap-4">
             <label class="font-bold text-gray-700 whitespace-nowrap">Seleccionar Torneo:</label>
             <select 
                [ngModel]="selectedTournamentId()" 
                (ngModelChange)="onTournamentChange($event)" 
                class="w-full md:w-auto flex-1 border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-[#388e14] focus:border-[#388e14] transition-all cursor-pointer font-medium">
                <option [ngValue]="null" disabled>-- Elige una opción --</option>
                @for (t of tournaments(); track t.id) { 
                    <option [value]="t.id">{{ t.name }}</option> 
                }
             </select>
          </div>

          @if (isLoading()) {
              <div class="flex justify-center py-20">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#388e14]"></div>
              </div>
          } @else if (selectedTournamentId()) {
             <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                      <thead class="bg-[#388e14] text-white text-xs font-bold uppercase tracking-wider">
                        <tr>
                           <th class="px-6 py-4 text-center w-16">#</th>
                           <th class="px-6 py-4">Equipo</th>
                           <th class="px-4 py-4 text-center" title="Partidos Jugados">PJ</th>
                           <th class="px-4 py-4 text-center hidden sm:table-cell" title="Ganados">PG</th>
                           <th class="px-4 py-4 text-center hidden sm:table-cell" title="Empatados">PE</th>
                           <th class="px-4 py-4 text-center hidden sm:table-cell" title="Perdidos">PP</th>
                           <th class="px-4 py-4 text-center hidden md:table-cell" title="Goles Favor">GF</th>
                           <th class="px-4 py-4 text-center hidden md:table-cell" title="Goles Contra">GC</th>
                           <th class="px-4 py-4 text-center" title="Diferencia de Goles">DG</th>
                           <th class="px-6 py-4 text-center font-black text-lg bg-black/10">PTS</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                        @for (team of standings(); track team.teamId; let i = $index) {
                           <tr class="hover:bg-green-50/50 transition-colors text-sm group">
                              <td class="px-6 py-4 text-center font-bold text-gray-500">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-all" 
                                      [ngClass]="{
                                          'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400': i===0, 
                                          'bg-gray-100 group-hover:bg-white': i>0
                                      }">
                                    {{ i + 1 }}
                                </span>
                              </td>
                              <td class="px-6 py-4 font-bold text-gray-900 text-base">
                                  {{ team.teamName }}
                              </td>
                              <td class="px-4 py-4 text-center font-medium">{{ team.played }}</td>
                              <td class="px-4 py-4 text-center hidden sm:table-cell text-green-600 font-bold">{{ team.won }}</td>
                              <td class="px-4 py-4 text-center hidden sm:table-cell text-gray-400">{{ team.drawn }}</td>
                              <td class="px-4 py-4 text-center hidden sm:table-cell text-red-500">{{ team.lost }}</td>
                              <td class="px-4 py-4 text-center hidden md:table-cell text-gray-600">{{ team.goalsFor }}</td>
                              <td class="px-4 py-4 text-center hidden md:table-cell text-gray-600">{{ team.goalsAgainst }}</td>
                              <td class="px-4 py-4 text-center font-bold" 
                                  [class.text-green-600]="team.goalDifference > 0"
                                  [class.text-red-500]="team.goalDifference < 0">
                                  {{ team.goalDifference > 0 ? '+' : '' }}{{ team.goalDifference }}
                              </td>
                              <td class="px-6 py-4 text-center font-black text-xl text-[#388e14] bg-green-50/30 group-hover:bg-[#388e14]/10 transition-colors">
                                  {{ team.points }}
                              </td>
                           </tr>
                        } 
                        @empty { 
                            <tr>
                                <td colspan="10" class="px-6 py-16 text-center text-gray-400 flex flex-col items-center">
                                    <span class="text-4xl mb-2">⚽</span>
                                    <p>Aún no hay partidos jugados en este torneo.</p>
                                </td>
                            </tr> 
                        }
                      </tbody>
                  </table>
                </div>
             </div>
          } @else {
             <div class="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <p class="text-gray-400 text-lg font-medium">☝️ Selecciona un torneo arriba para ver la tabla.</p>
             </div>
          }
      </div>
    </div>
  `
})
export class PublicStandingsComponent implements OnInit {
  private tournamentService = inject(TournamentService);
  private standingService = inject(StandingService);

  tournaments = signal<any[]>([]);
  selectedTournamentId = signal<string | null>(null);
  standings = signal<any[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    // Cargar torneos
    this.tournamentService.getAll().subscribe({
        next: (data) => {
            this.tournaments.set(data);
            // Auto-seleccionar el primero si existe
            if (data.length > 0) {
                this.onTournamentChange(data[0].id);
            }
        },
        error: (err) => console.error(err)
    });
  }

  onTournamentChange(id: string) {
    if (!id) return;
    this.selectedTournamentId.set(id);
    this.isLoading.set(true);

    this.standingService.getStandings(id).subscribe({
        next: (data) => {
            this.standings.set(data);
            this.isLoading.set(false);
        },
        error: (err) => {
            console.error(err);
            this.isLoading.set(false);
        }
    });
  }
}