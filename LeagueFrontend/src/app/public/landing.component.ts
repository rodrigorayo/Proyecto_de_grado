import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { StandingService } from '../services/standing.service';
import { MatchEventService } from '../services/match-event.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
    <div class="bg-gradient-to-br from-[#388e14] to-[#2e7d32] text-white py-20 px-4 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>

      <div class="container mx-auto text-center relative z-10">
        <span class="bg-yellow-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Temporada 2025</span>
        <h1 class="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
          LIGA GREMIO LABORAL <br/> <span class="text-yellow-300">YACUIBA</span>
        </h1>
        <p class="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto font-light">
          La plataforma oficial para seguir minuto a minuto la pasión del fútbol gremial. Resultados, estadísticas y noticias en tiempo real.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a routerLink="/posiciones" class="bg-yellow-400 text-green-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
            <span>🏆</span> Ver Tabla
          </a>
          <a routerLink="/partidos" class="bg-white/20 backdrop-blur px-8 py-3 rounded-full font-bold text-lg hover:bg-white/30 transition-all border border-white/30 flex items-center justify-center gap-2">
            <span>📅</span> Fixture y Noticias
          </a>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 -mt-10 relative z-20">
      <div class="grid md:grid-cols-3 gap-6">
        
        <div class="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
          <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏆</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Torneo Actual</h3>
          @if (currentTournament()) {
            <p class="text-2xl font-black text-blue-600 mb-1">{{ currentTournament()?.name }}</p>
            <p class="text-sm text-gray-500">Iniciado el {{ currentTournament()?.startDate | date:'mediumDate' }}</p>
          } @else {
            <p class="text-gray-400 italic">No hay torneo activo</p>
          }
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
          <div class="mx-auto mb-4 w-20 h-20 flex items-center justify-center">
              @if (leader()?.teamLogoUrl) {
                  <img [src]="leader()?.teamLogoUrl" class="w-full h-full object-contain drop-shadow-md">
              } @else {
                  <div class="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl">🥇</div>
              }
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Líder General</h3>
          @if (leader()) {
            <p class="text-2xl font-black text-[#388e14] mb-1">{{ leader()?.teamName }}</p>
            <p class="text-sm text-gray-500 font-bold">{{ leader()?.points }} Puntos</p>
          } @else {
            <p class="text-gray-400 italic">Esperando resultados...</p>
          }
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
          <div class="mx-auto mb-4 w-20 h-20 flex items-center justify-center">
              @if (topScorer()?.photoUrl) {
                  <img [src]="topScorer()?.photoUrl" class="w-full h-full object-cover rounded-full border-4 border-purple-50 shadow-sm">
              } @else {
                  <div class="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-3xl">⚽</div>
              }
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Pichichi</h3>
          @if (topScorer()) {
            <p class="text-2xl font-black text-purple-600 mb-1">{{ topScorer()?.playerName }}</p>
            <p class="text-sm text-gray-500">{{ topScorer()?.goals }} Goles ({{ topScorer()?.teamName }})</p>
          } @else {
            <p class="text-gray-400 italic">Sin goles registrados</p>
          }
        </div>

      </div>
    </div>

    <div class="container mx-auto px-4 py-20">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900">Máximos Artilleros</h2>
            <p class="text-gray-500">Los protagonistas del gol en esta temporada.</p>
        </div>

        <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th class="px-6 py-4 text-center">#</th>
                            <th class="px-6 py-4">Jugador</th>
                            <th class="px-6 py-4 text-right">Goles</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @for (scorer of topScorersList().slice(0, 5); track scorer.playerName; let i = $index) {
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 text-center font-bold text-gray-400">{{ i + 1 }}</td>
                                <td class="px-6 py-4 flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                                        @if(scorer.photoUrl) { <img [src]="scorer.photoUrl" class="w-full h-full object-cover"> }
                                        @else { <span class="text-lg">👤</span> }
                                    </div>
                                    <div>
                                        <p class="font-bold text-gray-900">{{ scorer.playerName }}</p>
                                        <p class="text-xs text-gray-500">{{ scorer.teamName }}</p>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-right font-black text-green-600 text-lg">{{ scorer.goals }}</td>
                            </tr>
                        } @empty {
                            <tr><td colspan="3" class="p-8 text-center text-gray-400">Aún no hay datos.</td></tr>
                        }
                    </tbody>
                </table>
            </div>
            <div class="p-4 border-t border-gray-100 text-center">
                <a routerLink="/partidos" class="text-sm font-bold text-[#388e14] hover:underline">Ver tabla completa →</a>
            </div>
        </div>
    </div>
  `
})
export class LandingComponent implements OnInit {
  private tournamentService = inject(TournamentService);
  private standingService = inject(StandingService);
  private matchEventService = inject(MatchEventService);

  currentTournament = signal<any>(null);
  leader = signal<any>(null);
  topScorer = signal<any>(null);
  topScorersList = signal<any[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // 1. Cargar último torneo
    this.tournamentService.getAll().subscribe(tournaments => {
      if (tournaments.length > 0) {
        const lastTournament = tournaments[0]; 
        this.currentTournament.set(lastTournament);

        // 2. Cargar Líder
        this.standingService.getStandings(lastTournament.id).subscribe(standings => {
          if (standings.length > 0) {
            this.leader.set(standings[0]);
          }
        });
      }
    });

    // 3. Cargar Goleadores
    this.matchEventService.getTopScorers().subscribe(scorers => {
      this.topScorersList.set(scorers);
      if (scorers.length > 0) {
        this.topScorer.set(scorers[0]);
      }
    });
  }
}