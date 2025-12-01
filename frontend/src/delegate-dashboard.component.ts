
import { Component, signal, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delegate-dashboard',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, FormsModule],
  template: `
    <div class="flex min-h-screen bg-white font-sans text-gray-800">
      
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-gray-50">
           <svg class="w-6 h-6 text-[#34a01c] mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.07 4.93L17.66 6.34C18.5 7.18 19 8.24 19 9.41V10H21V9.41C21 7.74 20.26 6.13 19.07 4.93ZM21 14H19V14.59C19 16.5 17.5 18 15.59 18H15V20H15.59C18.57 20 21 17.57 21 14.59V14ZM10 4C7 4 4.5 6.5 4.5 9.5V10H6.5V9.5C6.5 7.57 8.07 6 10 6H10.5V4H10ZM6.5 14V14.59C6.5 15.76 7 16.82 7.84 17.66L6.43 19.07C5.24 17.87 4.5 16.26 4.5 14.59V14H6.5ZM12.75 2C12.75 1.59 12.41 1.25 12 1.25C11.59 1.25 11.25 1.59 11.25 2V8H5.25C4.84 8 4.5 8.34 4.5 8.75V15.25C4.5 15.66 4.84 16 5.25 16H11.25V22C11.25 22.41 11.59 22.75 12 22.75C12.41 22.75 12.75 22.41 12.75 22V16H18.75C19.16 16 19.5 15.66 19.5 15.25V8.75C19.5 8.34 19.16 8 18.75 8H12.75V2Z"/>
           </svg>
           <span class="text-xl font-bold text-[#34a01c] tracking-tight italic">FútbolGestor</span>
        </div>

        <!-- Menu -->
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
           @for (item of menuItems(); track item.id) {
             <a href="#" (click)="navigate($event, item.id)"
                class="flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors group"
                [ngClass]="{
                  'bg-gray-50 text-[#34a01c]': currentView() === item.id,
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
      <div class="ml-64 flex-1 flex flex-col min-w-0 bg-gray-50/30">
        
        <!-- Header -->
        <header class="h-16 px-8 flex items-center justify-end bg-white border-b border-gray-100">
           <!-- User Avatar -->
           <div class="relative cursor-pointer">
             <img ngSrc="https://picsum.photos/id/1005/100/100" width="36" height="36" class="rounded-full border border-gray-100" alt="Delegate Avatar">
           </div>
        </header>

        <!-- Main Dashboard View -->
        <div class="p-8 max-w-7xl mx-auto w-full">
          
          @if (currentView() === 'dashboard') {
            <!-- DASHBOARD VIEW -->
            <!-- Top Cards Row -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
               
               <!-- Card 1 -->
               <div class="bg-[#f0fdf4] p-6 rounded-lg flex flex-col items-center justify-center text-center border border-green-50 shadow-sm">
                 <div class="text-[#34a01c] mb-2">
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                 </div>
                 <p class="text-sm text-gray-600 font-medium mb-1">Total de Jugadores</p>
                 <h3 class="text-3xl font-bold text-gray-900">28</h3>
               </div>

               <!-- Card 2 -->
               <div class="bg-white p-6 rounded-lg flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm">
                 <div class="text-gray-400 mb-2">
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 </div>
                 <p class="text-sm text-gray-600 font-medium mb-1">Próximos Partidos</p>
                 <h3 class="text-3xl font-bold text-gray-900">2</h3>
               </div>

               <!-- Card 3 -->
               <div class="bg-white p-6 rounded-lg flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm">
                 <div class="text-gray-400 mb-2">
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                 </div>
                 <p class="text-sm text-gray-600 font-medium mb-1">Posición en Liga</p>
                 <h3 class="text-3xl font-bold text-gray-900">3º</h3>
               </div>

               <!-- Card 4 (Actions) -->
               <div class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-center">
                  <h4 class="text-sm font-semibold text-gray-900 mb-4 text-center">Acciones Rápidas</h4>
                  <div class="space-y-3">
                     <button (click)="currentView.set('editar-equipo')" class="w-full py-2 px-4 border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Editar Equipo
                     </button>
                     <button (click)="currentView.set('registrar-jugador')" class="w-full py-2 px-4 bg-[#34a01c] hover:bg-[#2b8517] text-white rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                        Registrar Jugador
                     </button>
                     <button class="w-full py-1 text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Ver Calendario
                     </button>
                  </div>
               </div>
            </div>

            <!-- Middle Section: Results & Chart (Content Preserved) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <!-- Latest Results -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-6">Últimos Resultados</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-left">
                    <thead>
                      <tr class="text-xs font-medium text-gray-400 border-b border-gray-100">
                        <th class="pb-3 font-normal">Oponente</th>
                        <th class="pb-3 font-normal">Fecha</th>
                        <th class="pb-3 font-normal">Resultado</th>
                        <th class="pb-3 font-normal text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      @for (match of latestResults(); track match.id) {
                        <tr class="text-sm">
                          <td class="py-4 text-gray-700 font-medium">{{ match.opponent }}</td>
                          <td class="py-4 text-gray-500 text-xs">{{ match.date }}</td>
                          <td class="py-4 text-gray-900 font-bold">{{ match.score }}</td>
                          <td class="py-4 text-right">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              [class.bg-green-100]="match.status === 'Victoria'"
                              [class.text-green-800]="match.status === 'Victoria'"
                              [class.bg-red-100]="match.status === 'Derrota'"
                              [class.text-red-800]="match.status === 'Derrota'"
                              [class.bg-gray-100]="match.status === 'Empate'"
                              [class.text-gray-800]="match.status === 'Empate'">
                              {{ match.status }}
                            </span>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- Team Performance Chart -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex flex-col">
                <div class="mb-6">
                  <h3 class="text-lg font-bold text-gray-900">Rendimiento del Equipo</h3>
                  <p class="text-xs text-gray-500">Puntos por mes</p>
                </div>
                <!-- SVG Chart -->
                <div class="flex-1 w-full h-64 relative mt-2">
                   <div class="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-gray-400 w-6">
                     <span>32</span><span>24</span><span>16</span><span>8</span><span>0</span>
                   </div>
                   <div class="absolute left-8 right-0 top-2 bottom-6 border-l border-b border-gray-100">
                      <div class="w-full h-1/4 border-t border-gray-100 border-dashed absolute top-0"></div>
                      <div class="w-full h-1/4 border-t border-gray-100 border-dashed absolute top-1/4"></div>
                      <div class="w-full h-1/4 border-t border-gray-100 border-dashed absolute top-2/4"></div>
                      <div class="w-full h-1/4 border-t border-gray-100 border-dashed absolute top-3/4"></div>
                      <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <polyline fill="none" stroke="#34a01c" stroke-width="2" vector-effect="non-scaling-stroke" points="0,53 16,38 32,44 48,25 64,32 80,13 100,7" />
                        <circle cx="0" cy="53" r="3" fill="#34a01c" vector-effect="non-scaling-stroke"/>
                        <circle cx="16" cy="38" r="3" fill="#34a01c" vector-effect="non-scaling-stroke"/>
                        <circle cx="32" cy="44" r="3" fill="#34a01c" vector-effect="non-scaling-stroke"/>
                        <circle cx="48" cy="25" r="3" fill="#34a01c" vector-effect="non-scaling-stroke"/>
                        <circle cx="64" cy="32" r="3" fill="#34a01c" vector-effect="non-scaling-stroke"/>
                        <circle cx="80" cy="13" r="3" fill="#34a01c" vector-effect="non-scaling-stroke"/>
                        <circle cx="100" cy="7" r="3" fill="#34a01c" vector-effect="non-scaling-stroke"/>
                      </svg>
                   </div>
                   <div class="absolute left-8 right-0 bottom-0 flex justify-between text-[10px] text-gray-400 pt-2">
                     <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span><span>Jul</span>
                   </div>
                </div>
              </div>
            </div>

            <!-- News Section -->
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-6">Noticias Recientes</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                @for (news of recentNews(); track news.id) {
                  <div class="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                    <div class="h-40 overflow-hidden relative">
                      <img [ngSrc]="news.image" width="400" height="250" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" [alt]="news.title">
                    </div>
                    <div class="p-5 flex-1 flex flex-col">
                      <h4 class="font-bold text-gray-900 text-sm mb-1 leading-snug">{{ news.title }}</h4>
                      <div class="flex items-center gap-2 text-gray-400 text-[10px] mb-3">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {{ news.date }}
                      </div>
                      <p class="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">{{ news.excerpt }}</p>
                      <a href="#" class="mt-auto text-xs font-semibold text-[#34a01c] hover:underline">Leer más</a>
                    </div>
                  </div>
                }
              </div>
            </div>

          } @else if (currentView() === 'mi-equipo') {
            <!-- MY TEAM VIEW -->
            <div class="flex flex-col gap-6">
               <h2 class="text-2xl font-bold text-gray-900">Mi Equipo</h2>

               <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Team Details Form (Left Column) -->
                  <div class="lg:col-span-2">
                     <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-8">
                        <h3 class="text-lg font-bold text-gray-900 mb-6">Detalles del Equipo</h3>
                        
                        <div class="flex flex-col gap-6">
                           <!-- Logo Section -->
                           <div class="flex items-center gap-6">
                              <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                 <svg class="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                              </div>
                              <button (click)="currentView.set('editar-equipo')" class="px-4 py-2 border border-gray-200 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                 Editar Datos
                              </button>
                           </div>

                           <!-- Read Only Fields in this View -->
                           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div class="space-y-1">
                                 <label class="block text-xs font-medium text-gray-600">Nombre del Equipo</label>
                                 <input type="text" value="Halcones Verdes F.C." readonly class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-600 bg-gray-50">
                              </div>
                              <div class="space-y-1">
                                 <label class="block text-xs font-medium text-gray-600">Categoría</label>
                                 <input type="text" value="Senior Masculino" readonly class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-600 bg-gray-50">
                              </div>
                              <div class="space-y-1 md:col-span-2">
                                 <label class="block text-xs font-medium text-gray-600">Director Técnico</label>
                                 <input type="text" value="Juan Pérez" readonly class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-600 bg-gray-50">
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <!-- Squad List (Right Column) -->
                  <div>
                     <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <div class="flex items-center justify-between mb-4">
                           <h3 class="text-lg font-bold text-gray-900">Plantilla</h3>
                           <button (click)="currentView.set('registrar-jugador')" class="text-xs text-[#34a01c] font-bold hover:underline">
                              + Añadir
                           </button>
                        </div>
                        <div class="overflow-hidden">
                           <table class="w-full text-left">
                              <thead>
                                 <tr class="text-xs text-gray-500 border-b border-gray-50">
                                    <th class="pb-2 font-medium">Nombre</th>
                                    <th class="pb-2 font-medium">Posición</th>
                                    <th class="pb-2 font-medium w-1/2">No.</th>
                                 </tr>
                              </thead>
                              <tbody class="divide-y divide-gray-50">
                                 @for (player of squadList(); track player.id) {
                                    <tr class="text-xs">
                                       <td class="py-3 pr-2">
                                          <div class="flex flex-col">
                                             <span class="font-medium text-gray-800">{{ player.name }}</span>
                                             <span class="text-[10px] text-gray-400">{{ player.lastName }}</span>
                                          </div>
                                       </td>
                                       <td class="py-3 text-gray-600">{{ player.position }}</td>
                                       <td class="py-3 text-gray-800 font-medium">{{ player.number }}</td>
                                    </tr>
                                 }
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

          } @else if (currentView() === 'editar-equipo') {
             <!-- EDIT TEAM FORM (DELEGATE) -->
             <div class="flex flex-col gap-6 animate-fade-in">
               <div class="flex items-center gap-4">
                  <button (click)="currentView.set('mi-equipo')" class="text-gray-500 hover:text-[#34a01c] transition-colors">
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  </button>
                  <h2 class="text-2xl font-bold text-gray-900">Editar Información del Equipo</h2>
               </div>

               <div class="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <form [formGroup]="editTeamForm" (ngSubmit)="onSubmitEditTeam()" class="space-y-8">
                     
                     <!-- Top Section: Logo & Read-only Info -->
                     <div class="flex flex-col md:flex-row gap-8 items-start">
                        <!-- Logo Upload -->
                        <div class="flex flex-col items-center gap-4">
                           <div class="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative group">
                              @if (teamLogoPreview()) {
                                 <img [src]="teamLogoPreview()" class="w-full h-full object-cover">
                              } @else {
                                 <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                              }
                              <input type="file" (change)="onLogoSelected($event)" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*">
                              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                 <span class="text-white text-xs font-bold">Cambiar</span>
                              </div>
                           </div>
                           <span class="text-xs text-gray-500">Formato: PNG, JPG</span>
                        </div>

                        <!-- Read Only Fields -->
                        <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div class="space-y-1">
                              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Nombre del Equipo</label>
                              <input type="text" formControlName="name" readonly class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed">
                              <p class="text-[10px] text-gray-400">Contacte al administrador para cambiar el nombre.</p>
                           </div>
                           <div class="space-y-1">
                              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Categoría</label>
                              <input type="text" formControlName="category" readonly class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed">
                           </div>
                           <div class="md:col-span-2 space-y-1">
                              <label class="block text-xs font-medium text-gray-700 uppercase tracking-wide">Director Técnico (D.T.)</label>
                              <input type="text" formControlName="coach" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34a01c]/20 focus:border-[#34a01c] text-sm">
                           </div>
                        </div>
                     </div>

                     <hr class="border-gray-100">

                     <!-- Editable Colors Section -->
                     <div>
                        <h3 class="text-lg font-bold text-gray-900 mb-4">Colores del Uniforme</h3>
                        <p class="text-sm text-gray-500 mb-6">Defina los colores oficiales según el Art. 57 del reglamento.</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <!-- Primary Color -->
                           <div class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                              <input type="color" formControlName="colorHome" class="w-12 h-12 rounded-full cursor-pointer border-0 p-0 overflow-hidden shadow-sm">
                              <div>
                                 <label class="block text-sm font-bold text-gray-900">Uniforme Principal</label>
                                 <span class="text-xs text-gray-500">{{ editTeamForm.get('colorHome')?.value }}</span>
                              </div>
                           </div>
                           
                           <!-- Secondary Color -->
                           <div class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                              <input type="color" formControlName="colorAway" class="w-12 h-12 rounded-full cursor-pointer border-0 p-0 overflow-hidden shadow-sm">
                              <div>
                                 <label class="block text-sm font-bold text-gray-900">Uniforme Alternativo</label>
                                 <span class="text-xs text-gray-500">{{ editTeamForm.get('colorAway')?.value }}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <!-- Actions -->
                     <div class="flex justify-end gap-4 pt-4">
                        <button type="button" (click)="currentView.set('mi-equipo')" class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                           Cancelar
                        </button>
                        <button type="submit" [disabled]="editTeamForm.invalid" class="px-6 py-2.5 bg-[#34a01c] hover:bg-[#2b8517] text-white rounded-lg font-bold shadow-sm transition-colors text-sm disabled:opacity-50">
                           Guardar Cambios
                        </button>
                     </div>
                  </form>
               </div>
             </div>

          } @else if (currentView() === 'registrar-jugador') {
             <!-- REGISTER PLAYER FORM (DELEGATE) -->
             <div class="flex flex-col gap-6 animate-fade-in">
               <div class="flex items-center gap-4">
                  <button (click)="currentView.set('mis-jugadores')" class="text-gray-500 hover:text-[#34a01c] transition-colors">
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  </button>
                  <h2 class="text-2xl font-bold text-gray-900">Inscribir Nuevo Jugador</h2>
               </div>

               <div class="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div class="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg flex gap-3">
                     <svg class="w-5 h-5 text-green-700 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     <div class="text-sm text-green-800">
                        <p class="font-bold">Inscripción para: Halcones Verdes F.C.</p>
                        <p class="text-xs mt-1">Asegúrese de tener el documento de identidad escaneado para validación posterior.</p>
                     </div>
                  </div>

                  <form [formGroup]="playerForm" (ngSubmit)="onSubmitPlayer()" class="space-y-8">
                     
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Left Col: Personal Info -->
                        <div class="space-y-6">
                           <div class="space-y-1.5">
                              <label class="block text-sm font-medium text-gray-700">Nombres y Apellidos <span class="text-red-500">*</span></label>
                              <input type="text" formControlName="fullName" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34a01c]/20 focus:border-[#34a01c] text-sm" placeholder="Ej: Roberto Carlos">
                           </div>
                           
                           <div class="space-y-1.5">
                              <label class="block text-sm font-medium text-gray-700">Cédula de Identidad (C.I.) <span class="text-red-500">*</span></label>
                              <input type="text" formControlName="ci" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34a01c]/20 focus:border-[#34a01c] text-sm" placeholder="Sólo números">
                              @if (playerForm.get('ci')?.hasError('pattern') && playerForm.get('ci')?.touched) {
                                 <p class="text-xs text-red-500">Ingrese solo números válidos.</p>
                              }
                           </div>

                           <div class="space-y-1.5">
                              <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento <span class="text-red-500">*</span></label>
                              <input type="date" formControlName="birthDate" (change)="calculateAge($event)" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34a01c]/20 focus:border-[#34a01c] text-sm text-gray-600">
                              
                              <!-- Auto Age Badge -->
                              @if (currentPlayerAge() !== null) {
                                 <div class="mt-2 flex items-center gap-2">
                                    <span class="text-xs text-gray-500">Edad calculada:</span>
                                    <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                                       [class.bg-green-100]="currentPlayerAge()! >= 24"
                                       [class.text-green-800]="currentPlayerAge()! >= 24"
                                       [class.border-green-200]="currentPlayerAge()! >= 24"
                                       [class.bg-yellow-100]="currentPlayerAge()! < 24"
                                       [class.text-yellow-800]="currentPlayerAge()! < 24"
                                       [class.border-yellow-200]="currentPlayerAge()! < 24">
                                       {{ currentPlayerAge() }} Años
                                    </span>
                                    @if (currentPlayerAge()! < 24) {
                                       <span class="text-[10px] text-yellow-600 font-medium">(Categoría Honor/Ascenso)</span>
                                    }
                                 </div>
                              }
                           </div>
                        </div>

                        <!-- Right Col: Sports Info & Photo -->
                        <div class="space-y-6">
                           <div class="grid grid-cols-2 gap-4">
                              <div class="space-y-1.5">
                                 <label class="block text-sm font-medium text-gray-700">Posición <span class="text-red-500">*</span></label>
                                 <select formControlName="position" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34a01c]/20 focus:border-[#34a01c] text-sm bg-white">
                                    <option value="" disabled selected>Seleccione</option>
                                    <option value="Portero">Portero</option>
                                    <option value="Defensa">Defensa</option>
                                    <option value="Mediocampista">Mediocampista</option>
                                    <option value="Delantero">Delantero</option>
                                 </select>
                              </div>
                              <div class="space-y-1.5">
                                 <label class="block text-sm font-medium text-gray-700">No. Camiseta</label>
                                 <input type="number" formControlName="number" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34a01c]/20 focus:border-[#34a01c] text-sm" placeholder="#">
                              </div>
                           </div>

                           <div class="space-y-1.5">
                              <label class="block text-sm font-medium text-gray-700">Fotografía Digital</label>
                              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer relative">
                                 <div class="space-y-1 text-center">
                                    @if (playerPhotoPreview()) {
                                       <img [src]="playerPhotoPreview()" class="mx-auto h-32 w-32 object-cover rounded-md">
                                       <p class="text-xs text-green-600 font-bold">Imagen cargada</p>
                                    } @else {
                                       <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                       </svg>
                                       <div class="flex text-sm text-gray-600 justify-center">
                                          <label class="relative cursor-pointer bg-white rounded-md font-medium text-[#34a01c] hover:text-[#2b8517] focus-within:outline-none">
                                             <span>Subir un archivo</span>
                                          </label>
                                       </div>
                                       <p class="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                                    }
                                 </div>
                                 <input type="file" (change)="onPlayerPhotoSelected($event)" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*">
                              </div>
                           </div>
                        </div>
                     </div>

                     <!-- Actions -->
                     <div class="flex justify-end gap-4 pt-4 border-t border-gray-100">
                        <button type="button" (click)="currentView.set('mis-jugadores')" class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                           Cancelar
                        </button>
                        <button type="submit" [disabled]="playerForm.invalid" class="px-6 py-2.5 bg-[#34a01c] hover:bg-[#2b8517] text-white rounded-lg font-bold shadow-sm transition-colors text-sm disabled:opacity-50">
                           Guardar Jugador
                        </button>
                     </div>
                  </form>
               </div>
             </div>

          } @else if (currentView() === 'mis-jugadores') {
            <!-- MY PLAYERS VIEW (Existing View) -->
             <div class="flex flex-col gap-8">
               
               <!-- Page Header -->
               <div>
                  <h2 class="text-2xl font-bold text-gray-900 mb-6">Mis Jugadores</h2>
               </div>

               <!-- Players Table Card -->
               <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div class="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                     <h3 class="text-xl font-bold text-gray-900">Listado de Jugadores</h3>
                     <button (click)="currentView.set('registrar-jugador')" class="flex items-center gap-2 bg-[#34a01c] hover:bg-[#2b8517] text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Registrar Jugador
                     </button>
                  </div>
                  
                  <div class="overflow-x-auto">
                     <table class="w-full text-left border-collapse">
                        <thead>
                           <tr class="text-sm text-gray-500 border-b border-gray-100">
                              <th class="px-8 py-4 font-normal">Foto</th>
                              <th class="px-8 py-4 font-normal">Nombre</th>
                              <th class="px-8 py-4 font-normal">Posición</th>
                              <th class="px-8 py-4 font-normal">Camiseta</th>
                              <th class="px-8 py-4 font-normal">Edad</th>
                              <th class="px-8 py-4 font-normal text-right">Acciones</th>
                           </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                           @for (player of myPlayersList(); track player.id) {
                              <tr class="hover:bg-gray-50 text-sm text-gray-700">
                                 <td class="px-8 py-4">
                                    <img [ngSrc]="player.avatar" width="40" height="40" class="rounded-full object-cover" [alt]="player.name">
                                 </td>
                                 <td class="px-8 py-4 font-medium text-gray-900">{{ player.name }}</td>
                                 <td class="px-8 py-4 text-gray-600">{{ player.position }}</td>
                                 <td class="px-8 py-4 text-gray-600">{{ player.number }}</td>
                                 <td class="px-8 py-4 text-gray-600">{{ player.age }}</td>
                                 <td class="px-8 py-4 text-right">
                                    <div class="flex items-center justify-end gap-3">
                                       <button class="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors text-xs font-medium">
                                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                          Editar
                                       </button>
                                       <button class="flex items-center gap-2 px-3 py-1.5 bg-[#ef4444] text-white rounded hover:bg-red-600 transition-colors text-xs font-medium">
                                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                          Eliminar
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           }
                        </tbody>
                     </table>
                  </div>
               </div>
             </div>
          } @else if (currentView() === 'mis-partidos') {
            <!-- MY MATCHES VIEW -->
            <div class="flex flex-col gap-8">
               
               <!-- Page Header -->
               <div>
                  <h2 class="text-2xl font-bold text-gray-900 mb-6">Mis Partidos</h2>
                  
                  <!-- Filters -->
                  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-wrap gap-6 items-center">
                     <div class="flex flex-col gap-1">
                        <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Filtrar por Fecha</label>
                        <div class="relative">
                           <input type="date" class="border border-gray-200 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#34a01c] focus:ring-1 focus:ring-[#34a01c] min-w-[180px] text-gray-600">
                        </div>
                     </div>
                     <div class="flex flex-col gap-1">
                        <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Filtrar por Estado</label>
                        <select class="border border-gray-200 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#34a01c] focus:ring-1 focus:ring-[#34a01c] min-w-[160px] text-gray-800">
                           <option>Todos</option>
                           <option>Jugado</option>
                           <option>Pendiente</option>
                           <option>Cancelado</option>
                        </select>
                     </div>
                  </div>
               </div>

               <!-- Matches Table Card -->
               <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div class="px-8 py-6 border-b border-gray-100">
                     <h3 class="text-xl font-bold text-gray-900">Listado de Partidos</h3>
                  </div>
                  
                  <div class="overflow-x-auto">
                     <table class="w-full text-left border-collapse">
                        <thead>
                           <tr class="text-sm text-gray-500 border-b border-gray-100 bg-gray-50/50">
                              <th class="px-6 py-4 font-normal">Fecha</th>
                              <th class="px-6 py-4 font-normal">Hora</th>
                              <th class="px-6 py-4 font-normal">Equipo Rival</th>
                              <th class="px-6 py-4 font-normal">Lugar</th>
                              <th class="px-6 py-4 font-normal">Estado</th>
                              <th class="px-6 py-4 font-normal">Resultado</th>
                           </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                           @for (match of myMatchesList(); track match.id) {
                              <tr class="hover:bg-gray-50 text-sm text-gray-700">
                                 <td class="px-6 py-4 whitespace-nowrap">{{ match.date }}</td>
                                 <td class="px-6 py-4">{{ match.time }}</td>
                                 <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                       <img [ngSrc]="match.logo" width="24" height="24" class="w-6 h-6 object-contain" [alt]="match.opponent">
                                       <span class="font-medium text-gray-900">{{ match.opponent }}</span>
                                    </div>
                                 </td>
                                 <td class="px-6 py-4 text-gray-600">{{ match.location }}</td>
                                 <td class="px-6 py-4">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                                       [ngClass]="{
                                          'bg-[#16a34a] text-white border-[#16a34a]': match.status === 'Jugado',
                                          'bg-gray-300 text-gray-700 border-gray-400': match.status === 'Pendiente',
                                          'bg-[#ef4444] text-white border-[#ef4444]': match.status === 'Cancelado'
                                       }">
                                       {{ match.status }}
                                    </span>
                                 </td>
                                 <td class="px-6 py-4 font-medium">{{ match.result }}</td>
                              </tr>
                           }
                        </tbody>
                     </table>
                  </div>
               </div>

               <!-- Bottom Widgets -->
               <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- Featured Upcoming Matches -->
                  <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                     <div class="px-6 py-5 border-b border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900">Próximos Partidos Destacados</h3>
                     </div>
                     <div class="divide-y divide-gray-100">
                        @for (match of featuredUpcomingMatches(); track match.opponent) {
                           <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                              <div class="flex gap-4 items-start">
                                 <div class="mt-1">
                                    <svg class="w-5 h-5 text-[#34a01c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                 </div>
                                 <div>
                                    <h4 class="font-bold text-sm text-gray-900 mb-1">{{ match.opponent }}</h4>
                                    <p class="text-xs text-gray-500 mb-0.5">{{ match.date }}</p>
                                    <p class="text-xs text-gray-400">{{ match.location }}</p>
                                 </div>
                              </div>
                              <button class="border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-600 font-medium hover:bg-gray-100 transition-colors">
                                 Ver Detalles
                              </button>
                           </div>
                        }
                     </div>
                  </div>

                  <!-- Team News -->
                  <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                     <div class="px-6 py-5 border-b border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900">Noticias del Equipo</h3>
                     </div>
                     <div class="divide-y divide-gray-100">
                        @for (item of teamNewsList(); track item.title) {
                           <div class="p-6 hover:bg-gray-50 transition-colors">
                              <div class="flex gap-3">
                                 <div class="mt-0.5 text-gray-400">
                                     <span [innerHTML]="item.icon"></span>
                                 </div>
                                 <div>
                                    <h4 class="font-bold text-sm text-gray-900 mb-1">{{ item.title }}</h4>
                                    <p class="text-xs text-gray-500 leading-relaxed">{{ item.description }}</p>
                                 </div>
                              </div>
                           </div>
                        }
                     </div>
                  </div>
               </div>

            </div>
          } @else if (currentView() === 'posiciones') {
            <!-- STANDINGS VIEW -->
            <div class="flex flex-col gap-8">
               <!-- Header with title -->
               <div>
                 <h2 class="text-2xl font-bold text-gray-900 mb-6">Tabla de Posiciones</h2>
                 
                 <!-- Filters -->
                 <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex gap-6 items-center">
                   <div class="flex items-center gap-3">
                      <label class="text-sm font-medium text-gray-600">Categoría:</label>
                      <select class="border border-gray-200 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#34a01c] focus:ring-1 focus:ring-[#34a01c] min-w-[140px]">
                        <option>Todas</option>
                        <option>Masculina</option>
                        <option>Femenina</option>
                      </select>
                   </div>
                   <div class="flex items-center gap-3">
                      <label class="text-sm font-medium text-gray-600">Torneo:</label>
                      <select class="border border-gray-200 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#34a01c] focus:ring-1 focus:ring-[#34a01c] min-w-[140px]">
                        <option>Todos</option>
                        <option>Apertura</option>
                        <option>Clausura</option>
                      </select>
                   </div>
                 </div>
               </div>

               <!-- Table Card -->
               <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div class="px-8 py-6 border-b border-gray-100">
                     <h3 class="text-xl font-bold text-gray-900">Clasificación de la Liga</h3>
                  </div>
                  <div class="overflow-x-auto">
                     <table class="w-full text-left border-collapse">
                        <thead>
                           <tr class="text-xs font-semibold text-gray-500 bg-gray-50/50 border-b border-gray-100 uppercase tracking-wider">
                              <th class="px-6 py-4">Pos</th>
                              <th class="px-6 py-4 w-1/3">Equipo</th>
                              <th class="px-6 py-4 text-center">PJ</th>
                              <th class="px-6 py-4 text-center">PG</th>
                              <th class="px-6 py-4 text-center">PE</th>
                              <th class="px-6 py-4 text-center">PP</th>
                              <th class="px-6 py-4 text-center">GF</th>
                              <th class="px-6 py-4 text-center">GC</th>
                              <th class="px-6 py-4 text-center">DG</th>
                              <th class="px-6 py-4 text-right">Pts</th>
                           </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                           @for (team of standingsList(); track team.team) {
                              <tr class="hover:bg-gray-50 text-sm text-gray-700">
                                 <td class="px-6 py-4 font-medium">{{ team.pos }}</td>
                                 <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                       <img [ngSrc]="team.logo" width="24" height="24" class="w-6 h-6 object-contain" [alt]="team.team">
                                       <span class="font-medium text-gray-900">{{ team.team }}</span>
                                    </div>
                                 </td>
                                 <td class="px-6 py-4 text-center">{{ team.pj }}</td>
                                 <td class="px-6 py-4 text-center">{{ team.pg }}</td>
                                 <td class="px-6 py-4 text-center">{{ team.pe }}</td>
                                 <td class="px-6 py-4 text-center">{{ team.pp }}</td>
                                 <td class="px-6 py-4 text-center">{{ team.gf }}</td>
                                 <td class="px-6 py-4 text-center">{{ team.gc }}</td>
                                 <td class="px-6 py-4 text-center">{{ team.dg }}</td>
                                 <td class="px-6 py-4 text-right font-bold text-[#34a01c]">{{ team.pts }}</td>
                              </tr>
                           }
                        </tbody>
                     </table>
                  </div>
               </div>
               
               <!-- Info Banner -->
               <div class="bg-[#f0fdf4]/50 p-4 rounded-lg text-sm text-gray-700 border border-green-100 flex items-center justify-center">
                  ¡Mantente al día con todas las estadísticas de tus equipos favoritos y no te pierdas ningún detalle de la liga!
               </div>
            </div>
          } @else if (currentView() === 'noticias') {
            <!-- NEWS VIEW -->
            <div class="flex flex-col gap-8">
               
               <!-- Header -->
               <div>
                  <h2 class="text-2xl font-bold text-gray-900 mb-6">Noticias</h2>
               </div>

               <!-- News Grid -->
               <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  @for (news of delegateNewsList(); track news.id) {
                     <div class="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group">
                        <div class="h-48 overflow-hidden relative bg-gray-100">
                           <img [ngSrc]="news.image" width="400" height="300" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" [alt]="news.title">
                        </div>
                        <div class="p-6 flex-1 flex flex-col">
                           <h3 class="font-bold text-gray-900 text-lg mb-2 leading-snug">{{ news.title }}</h3>
                           <p class="text-xs text-gray-400 mb-3">{{ news.date }}</p>
                           <p class="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">{{ news.description }}</p>
                           <div class="mt-auto">
                              <button class="text-[#34a01c] font-medium text-sm hover:underline">Leer más</button>
                           </div>
                        </div>
                     </div>
                  }
               </div>
            </div>
          } @else if (currentView() === 'predicciones') {
            <!-- PREDICTIONS VIEW -->
             <div class="flex flex-col gap-8">
               
               <!-- Page Header -->
               <div>
                  <h2 class="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Predicciones de Resultados</h2>
               </div>

               <!-- Prediction Form Card -->
               <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-4xl">
                  <h3 class="text-xl font-bold text-gray-900 mb-8">Seleccionar Equipos</h3>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <!-- Team A Input -->
                    <div class="space-y-2">
                       <label class="block text-sm font-medium text-gray-700">Equipo A</label>
                       <div class="relative">
                          <select class="block w-full pl-4 pr-10 py-3 text-sm text-gray-600 border border-gray-200 rounded-lg focus:outline-none focus:border-[#34a01c] focus:ring-1 focus:ring-[#34a01c] appearance-none bg-white">
                             <option value="" disabled selected>Selecciona el Equipo A</option>
                             @for (team of standingsList(); track team.pos) {
                                <option [value]="team.team">{{ team.team }}</option>
                             }
                          </select>
                          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                             <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                       </div>
                    </div>

                    <!-- Team B Input -->
                    <div class="space-y-2">
                       <label class="block text-sm font-medium text-gray-700">Equipo B</label>
                       <div class="relative">
                          <select class="block w-full pl-4 pr-10 py-3 text-sm text-gray-600 border border-gray-200 rounded-lg focus:outline-none focus:border-[#34a01c] focus:ring-1 focus:ring-[#34a01c] appearance-none bg-white">
                             <option value="" disabled selected>Selecciona el Equipo B</option>
                             @for (team of standingsList(); track team.pos) {
                                <option [value]="team.team">{{ team.team }}</option>
                             }
                          </select>
                          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                             <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                       </div>
                    </div>
                  </div>

                  <!-- Button -->
                  <button class="w-full bg-[#34a01c] hover:bg-[#2b8517] text-white font-bold py-3.5 rounded-lg shadow-sm transition-colors text-sm">
                     Predecir Resultado
                  </button>
               </div>
             </div>
          }

        </div>

      </div>

    </div>
  `
})
export class DelegateDashboardComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Navigation State
  currentView = signal<string>('dashboard');

  // --- NEW FORMS ---
  editTeamForm = this.fb.group({
    name: [{ value: 'Halcones Verdes F.C.', disabled: true }],
    category: [{ value: 'Senior Masculino', disabled: true }],
    coach: ['Juan Pérez', Validators.required],
    colorHome: ['#34a01c', Validators.required], // Emerald green default
    colorAway: ['#ffffff', Validators.required],
    logo: [null]
  });

  playerForm = this.fb.group({
    fullName: ['', Validators.required],
    ci: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Only numbers
    birthDate: ['', Validators.required],
    position: ['', Validators.required],
    number: [''],
    photo: [null]
  });

  teamLogoPreview = signal<string | null>(null);
  playerPhotoPreview = signal<string | null>(null);
  currentPlayerAge = signal<number | null>(null);

  // --- FORM METHODS ---
  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.teamLogoPreview.set(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  onSubmitEditTeam() {
    if (this.editTeamForm.valid) {
      alert('Información del equipo actualizada correctamente.');
      this.currentView.set('mi-equipo');
    }
  }

  onPlayerPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.playerPhotoPreview.set(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  calculateAge(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      const birthDate = new Date(input.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.currentPlayerAge.set(age);
    }
  }

  onSubmitPlayer() {
    if (this.playerForm.valid) {
      const newPlayer = {
        id: Date.now(),
        name: this.playerForm.get('fullName')?.value,
        position: this.playerForm.get('position')?.value,
        number: this.playerForm.get('number')?.value,
        age: this.currentPlayerAge(),
        avatar: this.playerPhotoPreview() || 'https://picsum.photos/100'
      };
      
      // Update local list for demo
      this.myPlayersList.update(list => [...list, newPlayer as any]);
      
      alert('Jugador inscrito exitosamente.');
      this.currentView.set('mis-jugadores');
      this.playerForm.reset();
      this.currentPlayerAge.set(null);
      this.playerPhotoPreview.set(null);
    }
  }

  menuItems = signal([
    { id: 'dashboard', label: 'Dashboard', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>' },
    { id: 'mi-equipo', label: 'Mi Equipo', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>' },
    { id: 'mis-jugadores', label: 'Mis Jugadores', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>' },
    { id: 'mis-partidos', label: 'Mis Partidos', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
    { id: 'posiciones', label: 'Tabla de Posiciones', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>' },
    { id: 'noticias', label: 'Noticias', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9"></path></svg>' },
    { id: 'predicciones', label: 'Predicciones', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>' },
  ]);

  latestResults = signal([
    { id: 1, opponent: 'Atlético FC', date: '2024-10-26', score: '3 - 1', status: 'Victoria' },
    { id: 2, opponent: 'Unión SC', date: '2024-10-19', score: '0 - 2', status: 'Derrota' },
    { id: 3, opponent: 'Estrellas CF', date: '2024-10-12', score: '1 - 1', status: 'Empate' },
    { id: 4, opponent: 'Deportivo Sol', date: '2024-10-05', score: '2 - 0', status: 'Victoria' },
    { id: 5, opponent: 'Rayo Verde', date: '2024-09-28', score: '1 - 0', status: 'Victoria' },
  ]);

  recentNews = signal([
    { 
      id: 1, 
      title: 'Victoria Contundente en el Clásico Local', 
      date: '26 Oct, 2024', 
      excerpt: 'Deportivo Águilas demostró su poderío al vencer a su rival histórico con un marcador de 3-1, consolidándose en la cima de la tabla.',
      image: 'https://picsum.photos/id/1058/400/250'
    },
    { 
      id: 2, 
      title: 'Nuevo Talento Juvenil se Une al Equipo', 
      date: '24 Oct, 2024', 
      excerpt: 'El club anuncia la incorporación de una joven promesa a sus filas, esperando que aporte frescura y dinamismo al plantel.',
      image: 'https://picsum.photos/id/452/400/250'
    },
    { 
      id: 3, 
      title: 'Preparación Intensa para Próximo Partido Crucial', 
      date: '23 Oct, 2024', 
      excerpt: 'El equipo se entrena a fondo para el enfrentamiento decisivo de la próxima semana, buscando mantener su racha ganadora.',
      image: 'https://picsum.photos/id/1059/400/250'
    },
  ]);

  // Squad Data for "Mi Equipo"
  squadList = signal([
    { id: 1, name: 'Carlos', lastName: 'Ruiz', position: 'Delantero', number: 9 },
    { id: 2, name: 'Ana', lastName: 'Torres', position: 'Defensa', number: 4 },
    { id: 3, name: 'Luis', lastName: 'García', position: 'Centrocampista', number: 10 },
    { id: 4, name: 'Sofía', lastName: 'Vargas', position: 'Portera', number: 1 },
    { id: 5, name: 'Pedro', lastName: 'Soto', position: 'Defensa', number: 3 },
  ]);

  // Players Data for "Mis Jugadores"
  myPlayersList = signal([
    { id: 1, name: 'Lionel Messi', position: 'Delantero', number: 10, age: 36, avatar: 'https://picsum.photos/id/1005/100/100' },
    { id: 2, name: 'Cristiano Ronaldo', position: 'Delantero', number: 7, age: 39, avatar: 'https://picsum.photos/id/1011/100/100' },
    { id: 3, name: 'Kylian Mbappé', position: 'Delantero', number: 7, age: 25, avatar: 'https://picsum.photos/id/1027/100/100' },
    { id: 4, name: 'Erling Haaland', position: 'Delantero', number: 9, age: 23, avatar: 'https://picsum.photos/id/1062/100/100' },
    { id: 5, name: 'Virgil van Dijk', position: 'Defensa', number: 4, age: 32, avatar: 'https://picsum.photos/id/338/100/100' },
  ]);

  // Matches Data for "Mis Partidos"
  myMatchesList = signal([
    { id: 1, date: '2024-03-10', time: '15:00', opponent: 'Águilas FC', location: 'Estadio Central', status: 'Jugado', result: '3-1', logo: 'https://picsum.photos/id/111/50/50' },
    { id: 2, date: '2024-03-17', time: '17:30', opponent: 'Pumas Rojos', location: 'Cancha Municipal', status: 'Jugado', result: '2-2', logo: 'https://picsum.photos/id/222/50/50' },
    { id: 3, date: '2024-03-24', time: '19:00', opponent: 'Leones Verdes', location: 'Estadio Principal', status: 'Jugado', result: '1-0', logo: 'https://picsum.photos/id/333/50/50' },
    { id: 4, date: '2024-04-01', time: '16:00', opponent: 'Fénix Dorado', location: 'Campo Deportivo', status: 'Pendiente', result: '-', logo: 'https://picsum.photos/id/444/50/50' },
    { id: 5, date: '2024-04-08', time: '18:30', opponent: 'Dragones Azules', location: 'Estadio Central', status: 'Pendiente', result: '-', logo: 'https://picsum.photos/id/555/50/50' },
    { id: 6, date: '2024-04-15', time: '14:00', opponent: 'Lobos Blancos', location: 'Cancha La Unión', status: 'Cancelado', result: 'Cancelado', logo: 'https://picsum.photos/id/666/50/50' },
  ]);

  // Upcoming Featured Matches
  featuredUpcomingMatches = signal([
    { opponent: 'Fénix Dorado', date: '2024-04-01(16:00)', location: 'Campo Deportivo' },
    { opponent: 'Dragones Azules', date: '2024-04-08(18:30)', location: 'Estadio Central' },
    { opponent: 'Halcones Negros', date: '2024-04-22(20:00)', location: 'Estadio Principal' },
  ]);

  // Team News
  teamNewsList = signal([
    { 
       title: 'Victoria Contundente en el Clásico Local', 
       description: 'El equipo demuestra su superioridad con un 3-1 contra Águilas FC.',
       icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    },
    { 
       title: 'Próximo Desafío: Visita a Dragones Azules', 
       description: 'Preparativos intensos para el partido crucial fuera de casa.',
       icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>'
    },
    { 
       title: 'Entrenamiento Matutino con Novedades', 
       description: 'Se anuncian rotaciones en la alineación titular para el siguiente encuentro.',
       icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>'
    },
  ]);

  // Standings Data
  standingsList = signal([
    { pos: 1, team: 'Los Gigantes', pj: 10, pg: 8, pe: 1, pp: 1, gf: 25, gc: 8, dg: 17, pts: 25, logo: 'https://picsum.photos/id/111/50/50' },
    { pos: 2, team: 'Fuerza Verde', pj: 10, pg: 7, pe: 2, pp: 1, gf: 20, gc: 7, dg: 13, pts: 23, logo: 'https://picsum.photos/id/222/50/50' },
    { pos: 3, team: 'Campeones B', pj: 8, pg: 7, pe: 1, pp: 0, gf: 18, gc: 5, dg: 13, pts: 22, logo: 'https://picsum.photos/id/333/50/50' },
    { pos: 4, team: 'Rayo Veloz', pj: 10, pg: 6, pe: 3, pp: 1, gf: 18, gc: 9, dg: 9, pts: 21, logo: 'https://picsum.photos/id/444/50/50' },
    { pos: 5, team: 'Estrellas del Norte', pj: 8, pg: 6, pe: 1, pp: 1, gf: 15, gc: 6, dg: 9, pts: 19, logo: 'https://picsum.photos/id/555/50/50' },
    { pos: 6, team: 'Titanes FC', pj: 10, pg: 5, pe: 3, pp: 2, gf: 15, gc: 10, dg: 5, pts: 18, logo: 'https://picsum.photos/id/666/50/50' },
    { pos: 7, team: 'Águilas Azules', pj: 10, pg: 4, pe: 4, pp: 2, gf: 12, gc: 10, dg: 2, pts: 16, logo: 'https://picsum.photos/id/777/50/50' },
    { pos: 8, team: 'Unión Deportiva', pj: 10, pg: 4, pe: 2, pp: 4, gf: 11, gc: 13, dg: -2, pts: 14, logo: 'https://picsum.photos/id/888/50/50' },
    { pos: 9, team: 'Los Leones', pj: 10, pg: 3, pe: 3, pp: 4, gf: 10, gc: 12, dg: -2, pts: 12, logo: 'https://picsum.photos/id/999/50/50' },
    { pos: 10, team: 'Dragones Rojos', pj: 10, pg: 3, pe: 1, pp: 6, gf: 9, gc: 15, dg: -6, pts: 10, logo: 'https://picsum.photos/id/101/50/50' },
    { pos: 11, team: 'Escorpiones FC', pj: 10, pg: 2, pe: 2, pp: 6, gf: 8, gc: 18, dg: -10, pts: 8, logo: 'https://picsum.photos/id/202/50/50' },
    { pos: 12, team: 'Guerreros del Sur', pj: 10, pg: 1, pe: 1, pp: 8, gf: 6, gc: 20, dg: -14, pts: 4, logo: 'https://picsum.photos/id/303/50/50' },
  ]);

  // News Data for "Noticias" View
  delegateNewsList = signal([
    {
      id: 1,
      title: "Victoria Histórica del Deportivo Gremio",
      date: "25 de Octubre de 2024",
      description: "El Deportivo Gremio se impuso con un contundente 3-1 ante su eterno rival, el Atlético Yacuiba, en un partido lleno de emociones y...",
      image: "https://picsum.photos/id/1015/400/250"
    },
    {
      id: 2,
      title: "Nuevo Fichaje Estrella: Martín 'El Rayo'",
      date: "24 de Octubre de 2024",
      description: "El Club Lobos confirma la llegada de Martín Velasco, delantero de renombre, quien promete revolucionar el ataque.",
      image: "https://picsum.photos/id/1025/400/250"
    },
    {
      id: 3,
      title: "Análisis Táctico: Cambios en la Liga",
      date: "23 de Octubre de 2024",
      description: "Expertos debaten las posibles modificaciones tácticas y estratégicas que podrían implementarse en la segunda mitad de la temporada.",
      image: "https://picsum.photos/id/1060/400/250"
    },
    {
      id: 4,
      title: "Juventud en Ascenso: Talentos Sub-20",
      date: "22 de Octubre de 2024",
      description: "Un repaso por las jóvenes promesas que están dejando su huella en la Liga, destacando su habilidad y potencial para el futuro.",
      image: "https://picsum.photos/id/1052/400/250"
    },
    {
      id: 5,
      title: "La Hinchada, el 'Jugador Número 12'",
      date: "21 de Octubre de 2024",
      description: "Conoce la pasión inigualable de los aficionados que, partido tras partido, brindan un apoyo incondicional a sus equipos.",
      image: "https://picsum.photos/id/1033/400/250"
    },
    {
      id: 6,
      title: "Compromiso Social de la Liga",
      date: "20 de Octubre de 2024",
      description: "La Liga no solo es fútbol; también es una plataforma para el desarrollo social y la promoción de valores en la comunidad.",
      image: "https://picsum.photos/id/1080/400/250"
    }
  ]);

  navigate(event: Event, viewId: string) {
    event.preventDefault();
    this.currentView.set(viewId);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
