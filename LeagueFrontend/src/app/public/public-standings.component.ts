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
    <div class="container mx-auto px-4 py-12">
      <h2 class="text-3xl font-black text-gray-900 mb-2">Tabla de Posiciones</h2>
      <p class="text-gray-500 mb-8">Clasificación oficial actualizada en tiempo real.</p>

      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex items-center gap-4 max-w-md">
         <label class="font-bold text-gray-700">Torneo:</label>
         <select [ngModel]="selectedTournamentId()" (ngModelChange)="onTournamentChange($event)" class="border rounded-lg px-4 py-2 flex-1 bg-white cursor-pointer">
            <option [ngValue]="null" disabled selected>-- Selecciona un Torneo --</option>
            @for (t of tournaments(); track t.id) { <option [value]="t.id">{{ t.name }}</option> }
         </select>
      </div>

      @if (selectedTournamentId()) {
         <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                 <thead class="bg-[#388e14] text-white text-xs font-bold uppercase tracking-wider">
                    <tr>
                       <th class="px-6 py-4 text-center">Pos</th>
                       <th class="px-6 py-4">Equipo</th>
                       <th class="px-4 py-4 text-center">PJ</th>
                       <th class="px-4 py-4 text-center hidden md:table-cell">PG</th>
                       <th class="px-4 py-4 text-center hidden md:table-cell">PE</th>
                       <th class="px-4 py-4 text-center hidden md:table-cell">PP</th>
                       <th class="px-4 py-4 text-center hidden md:table-cell">GF</th>
                       <th class="px-4 py-4 text-center hidden md:table-cell">GC</th>
                       <th class="px-4 py-4 text-center">DG</th>
                       <th class="px-6 py-4 text-center font-black text-lg bg-black/10">PTS</th>
                    </tr>
                 </thead>
                 <tbody class="divide-y divide-gray-100">
                    @for (team of standings(); track team.teamId; let i = $index) {
                       <tr class="hover:bg-green-50/50 transition-colors text-sm">
                          <td class="px-6 py-4 text-center font-bold text-gray-500">
                            <span class="w-8 h-8 rounded-full flex items-center justify-center mx-auto" [ngClass]="{'bg-yellow-100 text-yellow-700': i===0, 'bg-gray-100': i>0}">{{ i + 1 }}</span>
                          </td>
                          <td class="px-6 py-4 font-bold text-gray-900 text-lg">{{ team.teamName }}</td>
                          <td class="px-4 py-4 text-center font-medium">{{ team.played }}</td>
                          <td class="px-4 py-4 text-center hidden md:table-cell text-green-600 font-bold">{{ team.won }}</td>
                          <td class="px-4 py-4 text-center hidden md:table-cell text-gray-500">{{ team.drawn }}</td>
                          <td class="px-4 py-4 text-center hidden md:table-cell text-red-500">{{ team.lost }}</td>
                          <td class="px-4 py-4 text-center hidden md:table-cell">{{ team.goalsFor }}</td>
                          <td class="px-4 py-4 text-center hidden md:table-cell">{{ team.goalsAgainst }}</td>
                          <td class="px-4 py-4 text-center font-medium">{{ team.goalDifference > 0 ? '+' : '' }}{{ team.goalDifference }}</td>
                          <td class="px-6 py-4 text-center font-black text-xl text-[#388e14] bg-green-50/30">{{ team.points }}</td>
                       </tr>
                    } @empty { <tr><td colspan="10" class="px-6 py-12 text-center text-gray-500">No hay datos disponibles.</td></tr> }
                 </tbody>
              </table>
            </div>
         </div>
      } @else {
         <div class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p class="text-gray-500 text-lg">☝️ Selecciona un torneo arriba para ver la tabla.</p>
         </div>
      }
    </div>
  `
})
export class PublicStandingsComponent implements OnInit {
  private tournamentService = inject(TournamentService);
  private standingService = inject(StandingService);

  tournaments = signal<any[]>([]);
  selectedTournamentId = signal<string | null>(null);
  standings = signal<any[]>([]);

  ngOnInit() {
    this.tournamentService.getAll().subscribe(data => this.tournaments.set(data));
  }

  onTournamentChange(id: string) {
    this.selectedTournamentId.set(id);
    this.standingService.getStandings(id).subscribe(data => this.standings.set(data));
  }
}