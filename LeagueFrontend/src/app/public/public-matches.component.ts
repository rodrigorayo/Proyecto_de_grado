import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TournamentService } from '../services/tournament.service';
import { MatchService } from '../services/match.service';
import { MatchEventService } from '../services/match-event.service';

@Component({
  selector: 'app-public-matches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      
      <div class="grid lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2">
            <h2 class="text-3xl font-black text-gray-900 mb-2">Partidos y Resultados</h2>
            <p class="text-gray-500 mb-6">Calendario oficial de encuentros.</p>

            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
                <label class="font-bold text-gray-700">Torneo:</label>
                <select [ngModel]="selectedTournamentId()" (ngModelChange)="onTournamentChange($event)" class="border rounded-lg px-4 py-2 flex-1 bg-white cursor-pointer">
                    <option [ngValue]="null" disabled selected>-- Selecciona un Torneo --</option>
                    @for (t of tournaments(); track t.id) { <option [value]="t.id">{{ t.name }}</option> }
                </select>
            </div>

            @if (selectedTournamentId()) {
                <div class="space-y-4">
                    @for (match of matches(); track match.id) {
                        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div class="text-center md:text-left min-w-[100px]">
                                    <span class="block text-sm font-bold text-gray-400 uppercase tracking-wider">{{ match.matchDate | date:'MMM d' }}</span>
                                    <span class="block text-xl font-black text-gray-800">{{ match.matchDate | date:'HH:mm' }}</span>
                                </div>

                                <div class="flex-1 flex items-center justify-center gap-4 w-full">
                                    <span class="text-lg md:text-xl font-bold text-gray-900 text-right flex-1">{{ match.homeTeam?.name }}</span>
                                    
                                    @if (match.status === 2) {
                                        <div class="bg-[#388e14] text-white px-4 py-2 rounded-lg font-black text-2xl shadow-lg min-w-[100px] text-center">
                                            {{ match.homeScore }} - {{ match.awayScore }}
                                        </div>
                                    } @else {
                                        <div class="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg font-bold text-xl min-w-[80px] text-center">
                                            VS
                                        </div>
                                    }

                                    <span class="text-lg md:text-xl font-bold text-gray-900 text-left flex-1">{{ match.awayTeam?.name }}</span>
                                </div>

                                <div class="min-w-[100px] text-center md:text-right">
                                    <span class="px-3 py-1 rounded-full text-xs font-bold uppercase" 
                                          [ngClass]="match.status === 2 ? 'bg-green-100 text-green-800' : (match.status === 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600')">
                                        {{ match.status === 2 ? 'Finalizado' : 'Programado' }}
                                    </span>
                                    <p class="text-xs text-gray-400 mt-1">{{ match.venue }}</p>
                                </div>
                            </div>
                        </div>
                    } @empty { <div class="p-12 text-center text-gray-400 bg-white border border-dashed rounded-lg">No hay partidos programados.</div> }
                </div>
            } @else {
                <div class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p class="text-gray-500 text-lg">☝️ Selecciona un torneo para ver el fixture.</p>
                </div>
            }
        </div>

        <div class="lg:col-span-1">
            <h2 class="text-2xl font-black text-gray-900 mb-2">Goleadores</h2>
            <p class="text-gray-500 mb-6">Top artilleros de la liga.</p>

            <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div class="bg-[#388e14] h-2 w-full"></div>
                <div class="divide-y divide-gray-100">
                    @for (scorer of topScorers(); track scorer.playerName; let i = $index) {
                        <div class="p-4 flex items-center gap-4 hover:bg-gray-50">
                            <span class="text-2xl font-black text-gray-300 w-8 text-center">{{ i + 1 }}</span>
                            <div class="flex-1">
                                <p class="font-bold text-gray-900">{{ scorer.playerName }}</p>
                                <p class="text-xs text-gray-500 uppercase font-bold">{{ scorer.teamName }}</p>
                            </div>
                            <div class="bg-green-50 text-[#388e14] w-10 h-10 rounded-full flex items-center justify-center font-black text-lg border border-green-100">
                                {{ scorer.goals }}
                            </div>
                        </div>
                    } @empty { <div class="p-8 text-center text-gray-400">Aún no hay goles registrados.</div> }
                </div>
            </div>
        </div>

      </div>
    </div>
  `
})
export class PublicMatchesComponent implements OnInit {
  private tournamentService = inject(TournamentService);
  private matchService = inject(MatchService);
  private matchEventService = inject(MatchEventService);

  tournaments = signal<any[]>([]);
  selectedTournamentId = signal<string | null>(null);
  matches = signal<any[]>([]);
  topScorers = signal<any[]>([]);

  ngOnInit() {
    this.tournamentService.getAll().subscribe(data => this.tournaments.set(data));
    this.loadTopScorers();
  }

  onTournamentChange(id: string) {
    this.selectedTournamentId.set(id);
    this.matchService.getMatchesByTournament(id).subscribe(data => this.matches.set(data));
  }

  loadTopScorers() {
    this.matchEventService.getTopScorers().subscribe(data => this.topScorers.set(data));
  }
}