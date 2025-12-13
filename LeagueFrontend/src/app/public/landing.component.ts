import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-gradient-to-br from-[#388e14] to-[#2e7d32] text-white py-20 px-4">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-black mb-4 tracking-tight">VIVE LA PASIÓN DEL FÚTBOL</h1>
        <p class="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Sigue minuto a minuto los resultados, la tabla de posiciones y las estadísticas de la liga más emocionante de Yacuiba.
        </p>
        <div class="flex justify-center gap-4">
          <a routerLink="/posiciones" class="bg-yellow-400 text-green-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition-transform hover:scale-105 shadow-lg">
            Ver Tabla
          </a>
          <a routerLink="/partidos" class="bg-white/20 backdrop-blur px-8 py-3 rounded-full font-bold text-lg hover:bg-white/30 transition-all border border-white/30">
            Fixture
          </a>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
          <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🏆</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Tabla en Vivo</h3>
          <p class="text-gray-500 mb-4">Actualización automática al finalizar cada partido.</p>
          <a routerLink="/posiciones" class="text-blue-600 font-bold hover:underline">Ver posiciones →</a>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
          <div class="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚽</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Goleadores</h3>
          <p class="text-gray-500 mb-4">Descubre quién es el máximo artillero del torneo.</p>
          <a routerLink="/partidos" class="text-green-600 font-bold hover:underline">Ver estadísticas →</a>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
          <div class="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📅</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Fixture Completo</h3>
          <p class="text-gray-500 mb-4">Programa tus fines de semana con los próximos encuentros.</p>
          <a routerLink="/partidos" class="text-purple-600 font-bold hover:underline">Ver calendario →</a>
        </div>
      </div>
    </div>
  `
})
export class LandingComponent {}