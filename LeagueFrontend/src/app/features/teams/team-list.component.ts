import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Equipos de la Liga</h1>
        <button class="bg-[#388e14] text-white px-4 py-2 rounded-lg hover:bg-[#2e7510] transition-colors">
          + Nuevo Equipo
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-600 font-semibold text-sm uppercase">
            <tr>
              <th class="p-4">Logo</th>
              <th class="p-4">Nombre</th>
              <th class="p-4">Categoría</th>
              <th class="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (team of teams(); track team.id) {
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4">
                  <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    @if (team.logoUrl) {
                      <img [src]="team.logoUrl" alt="Logo" class="w-full h-full object-cover">
                    } @else {
                      <span class="text-xs text-gray-500">Sin img</span>
                    }
                  </div>
                </td>
                <td class="p-4 font-medium text-gray-900">{{ team.name }}</td>
                <td class="p-4 text-gray-600">{{ team.category }}</td>
                <td class="p-4 text-center">
                  <button class="text-blue-600 hover:underline text-sm font-medium">Ver Jugadores</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="p-8 text-center text-gray-500">
                  No hay equipos registrados aún.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class TeamListComponent implements OnInit {
  private teamService = inject(TeamService);
  teams = signal<any[]>([]);

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => {
        console.log('Equipos cargados:', data);
        this.teams.set(data);
      },
      error: (err) => console.error('Error cargando equipos:', err)
    });
  }
}