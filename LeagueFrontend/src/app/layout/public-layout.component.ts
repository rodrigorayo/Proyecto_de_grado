import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      <header class="bg-[#388e14] text-white shadow-lg sticky top-0 z-50">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
          <a routerLink="/" class="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity">
            <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#388e14]">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
            </div>
            LigaYacuiba
          </a>

          <nav class="hidden md:flex gap-6 text-sm font-medium">
            <a routerLink="/" routerLinkActive="text-yellow-300 font-bold" [routerLinkActiveOptions]="{exact: true}" class="hover:text-green-100 transition-colors">Inicio</a>
            <a routerLink="/posiciones" routerLinkActive="text-yellow-300 font-bold" class="hover:text-green-100 transition-colors">Tabla de Posiciones</a>
            <a routerLink="/partidos" routerLinkActive="text-yellow-300 font-bold" class="hover:text-green-100 transition-colors">Partidos y Resultados</a>
          </nav>

          <a routerLink="/login" class="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition-all border border-white/20">
            Ingreso Admin
          </a>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <footer class="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div class="container mx-auto px-4 text-center">
          <p class="text-sm">© 2025 Liga Deportiva Yacuiba. Todos los derechos reservados.</p>
          <p class="text-xs mt-2 text-gray-600">Desarrollado con pasión por el fútbol.</p>
        </div>
      </footer>
    </div>
  `
})
export class PublicLayoutComponent {}