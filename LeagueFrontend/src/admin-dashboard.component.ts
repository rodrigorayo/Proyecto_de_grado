
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

interface NewsItem {
  id: number;
  title: string;
  body: string;
  date: string;
  status: 'DRAFT' | 'PUBLISHED';
  matchInfo?: string;
  image: string;
}

interface FinishedMatch {
  id: number;
  homeTeam: string;
  awayTeam: string;
  score: string;
  date: string;
}

// Prediction Interfaces
interface PredictionResult {
  homeProb: number;
  drawProb: number;
  awayProb: number;
  confidence: 'Alta' | 'Media' | 'Baja';
}

interface PredictionMatch {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  homeLogo?: string;
  awayLogo?: string;
  result?: PredictionResult;
  loading?: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Administrador' | 'Delegado' | 'Árbitro' | 'Aficionado';
  status: 'Activo' | 'Inactivo';
  teamId?: number; // Only for Delegado
  avatar: string;
}

// Settings Interfaces
interface Tournament {
  name: string;
  startDate: string;
  endDate: string;
  status: 'Activo' | 'Finalizado' | 'Planificación';
}

interface AuditLog {
  id: number;
  user: string;
  action: string;
  timestamp: string;
  type: 'info' | 'warning' | 'danger';
}

interface LeagueRules {
  pointsPerWin: number;
  pointsPerDraw: number;
  yellowCardsLimit: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, FormsModule],
  template: `
    <div class="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20">
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-gray-50">
           <svg class="w-6 h-6 text-[#388e14] mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
           </svg>
           <span class="text-lg font-bold text-[#388e14] tracking-tight">AdminPanel</span>
        </div>

        <!-- Menu -->
        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
           @for (item of menuItems(); track item.id) {
             <a href="#" (click)="navigate($event, item.id)" 
                class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group"
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
      <div class="ml-64 flex-1 flex flex-col min-w-0">
        
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
           
           <!-- Search -->
           <div class="flex-1 max-w-lg">
             <div class="relative">
               <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
               </div>
               <input type="text" class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:border-gray-300 focus:ring-0 sm:text-sm transition duration-150 ease-in-out" placeholder="Buscar en el panel...">
             </div>
           </div>

           <!-- Right Actions -->
           <div class="flex items-center gap-6">
              <button class="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Perfil
              </button>
              <div class="relative">
                <img ngSrc="https://picsum.photos/id/64/100/100" width="36" height="36" class="rounded-full border border-gray-200" alt="Admin Avatar">
                <span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"></span>
              </div>
           </div>
        </header>

        <!-- Main Dashboard View Logic -->
        <div class="p-8 pb-20">
          
          @if (currentView() === 'dashboard') {
            <!-- Original Dashboard Content -->
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Panel de administración</h2>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               
               <!-- Card 1 -->
               <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                 <div>
                   <p class="text-sm font-medium text-gray-500 mb-1">Total Equipos</p>
                   <h3 class="text-3xl font-bold text-gray-900">45</h3>
                 </div>
                 <div class="p-2 bg-green-50 rounded-lg">
                   <svg class="w-6 h-6 text-[#388e14]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 21h18M5 11l7-7 7 7"></path></svg>
                 </div>
               </div>

               <!-- Card 2 -->
               <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                 <div>
                   <p class="text-sm font-medium text-gray-500 mb-1">Total Jugadores</p>
                   <h3 class="text-3xl font-bold text-gray-900">1,200</h3>
                 </div>
                 <div class="p-2 bg-green-50 rounded-lg">
                   <svg class="w-6 h-6 text-[#388e14]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                 </div>
               </div>

               <!-- Card 3 -->
               <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                 <div>
                   <p class="text-sm font-medium text-gray-500 mb-1">Partidos Programados</p>
                   <h3 class="text-3xl font-bold text-gray-900">18</h3>
                 </div>
                 <div class="p-2 bg-green-50 rounded-lg">
                   <svg class="w-6 h-6 text-[#388e14]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 </div>
               </div>

               <!-- Card 4 -->
               <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                 <div>
                   <p class="text-sm font-medium text-gray-500 mb-1">Noticias IA Generadas</p>
                   <h3 class="text-3xl font-bold text-gray-900">{{ newsRepository().length }}</h3>
                 </div>
                 <div class="p-2 bg-green-50 rounded-lg">
                   <svg class="w-6 h-6 text-[#388e14]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                 </div>
               </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <button (click)="currentView.set('registrar-equipo')" class="flex flex-col items-center justify-center p-6 bg-[#388e14] hover:bg-[#2e7510] text-white rounded-lg shadow-md transition-colors group">
                  <svg class="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                  <span class="font-bold text-sm">Registrar equipo</span>
               </button>
               <button (click)="currentView.set('registrar-jugador')" class="flex flex-col items-center justify-center p-6 bg-[#388e14] hover:bg-[#2e7510] text-white rounded-lg shadow-md transition-colors group">
                  <svg class="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                  <span class="font-bold text-sm">Registrar jugador</span>
               </button>
               <button (click)="currentView.set('programar-partido')" class="flex flex-col items-center justify-center p-6 bg-[#388e14] hover:bg-[#2e7510] text-white rounded-lg shadow-md transition-colors group">
                  <svg class="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span class="font-bold text-sm">Programar partido</span>
               </button>
               <button (click)="currentView.set('noticias')" class="flex flex-col items-center justify-center p-6 bg-[#388e14] hover:bg-[#2e7510] text-white rounded-lg shadow-md transition-colors group text-center">
                  <svg class="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                  <span class="font-bold text-sm">Gestión de Noticias IA</span>
               </button>
            </div>

            <!-- Tables Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Latest Matches -->
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                 <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="text-lg font-bold text-gray-900">Últimos Partidos Registrados</h3>
                 </div>
                 <div class="overflow-x-auto">
                   <table class="w-full text-left">
                      <thead>
                        <tr class="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                          <th class="px-6 py-3">Equipos</th>
                          <th class="px-6 py-3">Fecha</th>
                          <th class="px-6 py-3">Resultado</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                        @for (match of matchesForNews().slice(0,5); track match.id) {
                          <tr class="hover:bg-gray-50 text-sm text-gray-700">
                             <td class="px-6 py-4">
                               <div class="flex flex-col">
                                 <span class="font-medium text-gray-900">{{ match.homeTeam }} vs.</span>
                                 <span>{{ match.awayTeam }}</span>
                               </div>
                             </td>
                             <td class="px-6 py-4">{{ match.date }}</td>
                             <td class="px-6 py-4 font-bold">{{ match.score }}</td>
                          </tr>
                        }
                      </tbody>
                   </table>
                 </div>
              </div>

              <!-- Latest News -->
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                 <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="text-lg font-bold text-gray-900">Últimas Noticias (Públicas)</h3>
                 </div>
                 <div class="overflow-x-auto">
                   <table class="w-full text-left">
                      <thead>
                        <tr class="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                          <th class="px-6 py-3">Título</th>
                          <th class="px-6 py-3 text-right">Fecha</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                        @for (news of newsRepository(); track news.id) {
                          @if (news.status === 'PUBLISHED') {
                            <tr class="hover:bg-gray-50 text-sm">
                               <td class="px-6 py-4 text-gray-700 font-medium truncate max-w-[200px]">{{ news.title }}</td>
                               <td class="px-6 py-4 text-gray-500 text-right">{{ news.date }}</td>
                            </tr>
                          }
                        }
                      </tbody>
                   </table>
                 </div>
              </div>

            </div>

          } @else if (currentView() === 'configuracion') {
            <!-- CONFIGURATION & SETTINGS VIEW -->
            <div class="flex flex-col gap-6">
               
               <!-- Header -->
               <div>
                  <h2 class="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
                  <p class="text-gray-500 text-sm">Gestión de torneos, reglas de la liga y seguridad.</p>
               </div>

               <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  
                  <!-- Left Column: Settings Cards -->
                  <div class="xl:col-span-2 space-y-8">
                     
                     <!-- 1. Active Tournament Management -->
                     <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                        <div class="absolute top-0 right-0 p-4 opacity-10">
                           <svg class="w-32 h-32 text-[#388e14]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l-5.5 9h11L12 2zm0 3.8l2.6 4.2h-5.2L12 5.8zM5 13c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4v-2H5v-4h4v-2H5zm10 0v2h4v4h-4v2h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2h-4z"></path></svg>
                        </div>

                        <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                           <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                           Gestión de Torneos
                        </h3>

                        @if (currentTournament().status === 'Activo') {
                           <!-- Active State -->
                           <div class="bg-green-50 border border-green-100 rounded-lg p-5 mb-6">
                              <div class="flex items-center justify-between">
                                 <div>
                                    <span class="text-xs font-bold text-green-700 uppercase tracking-wide">Torneo Actual</span>
                                    <h4 class="text-2xl font-black text-green-800 mt-1">{{ currentTournament().name }}</h4>
                                    <p class="text-sm text-green-600 mt-1">{{ currentTournament().startDate }} - {{ currentTournament().endDate }}</p>
                                 </div>
                                 <span class="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full animate-pulse">EN CURSO</span>
                              </div>
                           </div>
                           <div class="flex justify-end">
                              <button (click)="closeTournament()" class="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-lg text-sm shadow-sm transition-colors flex items-center gap-2">
                                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                 Cerrar Torneo Actual
                              </button>
                           </div>
                        } @else {
                           <!-- Closed/Planning State -->
                           <div class="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6 text-center">
                              <p class="text-gray-500 mb-2">No hay un torneo activo en este momento.</p>
                              @if (!showNewTournamentForm()) {
                                 <button (click)="showNewTournamentForm.set(true)" class="bg-[#388e14] hover:bg-[#2e7510] text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors text-sm">
                                    Iniciar Nuevo Torneo
                                 </button>
                              }
                           </div>
                           
                           @if (showNewTournamentForm()) {
                              <form [formGroup]="newTournamentForm" (ngSubmit)="createTournament()" class="bg-white border border-gray-100 rounded-lg p-5 shadow-sm animate-fade-in">
                                 <h4 class="font-bold text-gray-800 mb-4">Configurar Nuevo Torneo</h4>
                                 <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div class="md:col-span-2">
                                       <label class="block text-xs font-medium text-gray-500 mb-1">Nombre del Torneo</label>
                                       <input type="text" formControlName="name" class="w-full border-gray-200 rounded-md text-sm focus:ring-[#388e14] focus:border-[#388e14]" placeholder="Ej: Apertura 2025">
                                    </div>
                                    <div>
                                       <label class="block text-xs font-medium text-gray-500 mb-1">Fecha Inicio</label>
                                       <input type="date" formControlName="startDate" class="w-full border-gray-200 rounded-md text-sm focus:ring-[#388e14] focus:border-[#388e14]">
                                    </div>
                                    <div>
                                       <label class="block text-xs font-medium text-gray-500 mb-1">Fecha Fin</label>
                                       <input type="date" formControlName="endDate" class="w-full border-gray-200 rounded-md text-sm focus:ring-[#388e14] focus:border-[#388e14]">
                                    </div>
                                 </div>
                                 <div class="flex justify-end gap-3">
                                    <button type="button" (click)="showNewTournamentForm.set(false)" class="text-gray-500 hover:text-gray-700 text-sm font-medium">Cancelar</button>
                                    <button type="submit" [disabled]="newTournamentForm.invalid" class="bg-[#388e14] text-white py-2 px-4 rounded-md text-sm font-bold shadow-sm disabled:opacity-50">Crear Torneo</button>
                                 </div>
                              </form>
                           }
                        }
                     </div>

                     <!-- 2. League Parameters -->
                     <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                           <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                           Reglas y Parámetros
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div>
                              <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Puntos por Victoria</label>
                              <div class="flex items-center">
                                 <input type="number" [(ngModel)]="leagueRules().pointsPerWin" class="w-20 border border-gray-200 rounded-l-md py-2 px-3 text-center font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#388e14]">
                                 <span class="bg-gray-100 border border-l-0 border-gray-200 rounded-r-md py-2 px-3 text-sm text-gray-500">pts</span>
                              </div>
                           </div>
                           <div>
                              <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Puntos por Empate</label>
                              <div class="flex items-center">
                                 <input type="number" [(ngModel)]="leagueRules().pointsPerDraw" class="w-20 border border-gray-200 rounded-l-md py-2 px-3 text-center font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#388e14]">
                                 <span class="bg-gray-100 border border-l-0 border-gray-200 rounded-r-md py-2 px-3 text-sm text-gray-500">pts</span>
                              </div>
                           </div>
                           <div class="flex items-end">
                              <button (click)="saveRules()" class="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors text-sm">
                                 Guardar Reglas
                              </button>
                           </div>
                        </div>
                     </div>

                     <!-- 3. System Backup -->
                     <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                           Respaldo y Seguridad
                        </h3>
                        <div class="flex items-center justify-between">
                           <div>
                              <p class="text-sm text-gray-600 font-medium">Copia de Seguridad de la Base de Datos</p>
                              <p class="text-xs text-gray-400">Último respaldo: Hace 2 días</p>
                           </div>
                           <button (click)="generateBackup()" [disabled]="isBackupLoading()" class="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 font-bold py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50">
                              @if (isBackupLoading()) {
                                 <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                 Generando...
                              } @else {
                                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                 Generar Backup Ahora
                              }
                           </button>
                        </div>
                     </div>

                  </div>

                  <!-- Right Column: Audit Logs -->
                  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-[600px]">
                     <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Bitácora de Auditoría
                     </h3>
                     
                     <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <table class="w-full text-left">
                           <tbody class="divide-y divide-gray-50">
                              @for (log of auditLogs(); track log.id) {
                                 <tr>
                                    <td class="py-3">
                                       <div class="flex items-start gap-3">
                                          <div class="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                                             [class.bg-blue-400]="log.type === 'info'"
                                             [class.bg-yellow-400]="log.type === 'warning'"
                                             [class.bg-red-400]="log.type === 'danger'">
                                          </div>
                                          <div>
                                             <p class="text-xs font-bold text-gray-800">{{ log.action }}</p>
                                             <p class="text-[10px] text-gray-500">
                                                <span class="font-medium text-gray-600">{{ log.user }}</span> • {{ log.timestamp }}
                                             </p>
                                          </div>
                                       </div>
                                    </td>
                                 </tr>
                              }
                           </tbody>
                        </table>
                     </div>
                  </div>

               </div>

            </div>

          } @else if (currentView() === 'noticias') {
            <!-- NEW: ADVANCED AI NEWS MANAGEMENT -->
            <div class="flex flex-col gap-6 h-full">
               
               <!-- Header & Tabs -->
               <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900">Gestión de Noticias IA</h2>
                    <p class="text-sm text-gray-500">Genera borradores con Inteligencia Artificial y revisa antes de publicar.</p>
                  </div>
                  
                  <!-- Tabs -->
                  <div class="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                     <button (click)="activeNewsTab.set('generation')" 
                        class="px-4 py-2 rounded-md text-sm font-medium transition-all"
                        [ngClass]="{
                           'bg-[#388e14] text-white': activeNewsTab() === 'generation',
                           'text-gray-600 hover:bg-gray-50': activeNewsTab() !== 'generation'
                        }">
                        Generación (Pendientes)
                     </button>
                     <button (click)="activeNewsTab.set('management')" 
                        class="px-4 py-2 rounded-md text-sm font-medium transition-all"
                        [ngClass]="{
                           'bg-[#388e14] text-white': activeNewsTab() === 'management',
                           'text-gray-600 hover:bg-gray-50': activeNewsTab() !== 'management'
                        }">
                        Bandeja de Noticias
                     </button>
                  </div>
               </div>

               <!-- Tab Content -->
               @if (activeNewsTab() === 'generation') {
                  <!-- SECTION A: GENERATION -->
                  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                     <div class="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 class="text-lg font-bold text-gray-800">Partidos Finalizados sin Cobertura</h3>
                        <p class="text-xs text-gray-500 mt-1">Selecciona un partido para que la IA redacte un primer borrador.</p>
                     </div>
                     
                     <div class="overflow-x-auto">
                        <table class="w-full text-left">
                           <thead>
                              <tr class="text-xs font-semibold text-gray-500 border-b border-gray-100 uppercase tracking-wider">
                                 <th class="px-8 py-4">Enfrentamiento</th>
                                 <th class="px-8 py-4">Resultado</th>
                                 <th class="px-8 py-4">Fecha</th>
                                 <th class="px-8 py-4 text-right">Acción IA</th>
                              </tr>
                           </thead>
                           <tbody class="divide-y divide-gray-100">
                              @for (match of matchesForNews(); track match.id) {
                                 <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-8 py-5">
                                       <div class="flex items-center gap-3">
                                          <div class="flex flex-col">
                                             <span class="font-bold text-gray-900">{{ match.homeTeam }}</span>
                                             <span class="text-xs text-gray-400">vs</span>
                                             <span class="font-bold text-gray-900">{{ match.awayTeam }}</span>
                                          </div>
                                       </div>
                                    </td>
                                    <td class="px-8 py-5 font-mono font-bold text-lg text-gray-700">{{ match.score }}</td>
                                    <td class="px-8 py-5 text-sm text-gray-500">{{ match.date }}</td>
                                    <td class="px-8 py-5 text-right">
                                       <button (click)="generateDraft(match)" [disabled]="isGenerating()" 
                                          class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 disabled:cursor-wait">
                                          @if (isGenerating() && generatingMatchId() === match.id) {
                                             <svg class="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                             Redactando...
                                          } @else {
                                             <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                             Generar Borrador
                                          }
                                       </button>
                                    </td>
                                 </tr>
                              } @empty {
                                 <tr>
                                    <td colspan="4" class="px-8 py-12 text-center text-gray-400">
                                       <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                       <p>No hay partidos pendientes de cobertura.</p>
                                    </td>
                                 </tr>
                              }
                           </tbody>
                        </table>
                     </div>
                  </div>

               } @else {
                  <!-- SECTION B: MANAGEMENT TRAY -->
                  <div class="grid grid-cols-1 gap-6">
                     @for (news of newsRepository(); track news.id) {
                        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow">
                           <!-- Image Thumbnail -->
                           <div class="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img [src]="news.image" class="w-full h-full object-cover" alt="News thumbnail">
                           </div>
                           
                           <!-- Content -->
                           <div class="flex-1">
                              <div class="flex items-center gap-3 mb-2">
                                 <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                                    [class.bg-yellow-100]="news.status === 'DRAFT'"
                                    [class.text-yellow-800]="news.status === 'DRAFT'"
                                    [class.border-yellow-200]="news.status === 'DRAFT'"
                                    [class.bg-green-100]="news.status === 'PUBLISHED'"
                                    [class.text-green-800]="news.status === 'PUBLISHED'"
                                    [class.border-green-200]="news.status === 'PUBLISHED'">
                                    {{ news.status === 'DRAFT' ? 'Borrador (Revisión Pendiente)' : 'Publicado Oficialmente' }}
                                 </span>
                                 <span class="text-xs text-gray-400">{{ news.date }}</span>
                              </div>
                              
                              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ news.title }}</h3>
                              <p class="text-sm text-gray-600 line-clamp-2 mb-4">{{ news.body }}</p>

                              @if (news.status === 'DRAFT') {
                                 <div class="flex gap-3">
                                    <button (click)="openEditor(news)" class="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                       Editar y Aprobar
                                    </button>
                                 </div>
                              } @else {
                                 <div class="flex gap-3">
                                    <button class="text-sm font-semibold text-gray-400 cursor-default flex items-center gap-1">
                                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                       Publicado en Portal
                                    </button>
                                 </div>
                              }
                           </div>
                        </div>
                     } @empty {
                        <div class="p-12 text-center text-gray-500 bg-white rounded-lg border border-gray-100">
                           No hay noticias en el sistema. Ve a la pestaña de Generación para crear una.
                        </div>
                     }
                  </div>
               }
            </div>

            <!-- EDITOR MODAL (Overlay) -->
            @if (editingNews()) {
               <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                  <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                     
                     <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeEditor()"></div>

                     <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                     <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                        
                        <!-- Modal Header -->
                        <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-100">
                           <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Editor de Noticia</h3>
                           <button (click)="closeEditor()" class="text-gray-400 hover:text-gray-500">
                              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                           </button>
                        </div>

                        <!-- Modal Body -->
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                           <div class="space-y-4">
                              <div>
                                 <label class="block text-sm font-bold text-gray-700 mb-1">Título</label>
                                 <input type="text" [(ngModel)]="editingNews()!.title" class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#388e14] focus:border-[#388e14] sm:text-sm font-bold text-gray-900">
                              </div>
                              <div>
                                 <label class="block text-sm font-bold text-gray-700 mb-1">Cuerpo de la Noticia</label>
                                 <textarea [(ngModel)]="editingNews()!.body" rows="12" class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#388e14] focus:border-[#388e14] sm:text-sm leading-relaxed"></textarea>
                              </div>
                              <div class="flex items-center gap-2 text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-100">
                                 <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                 <span>Estás editando un borrador. El contenido no será visible al público hasta que hagas clic en "Publicar Oficialmente".</span>
                              </div>
                           </div>
                        </div>

                        <!-- Modal Footer -->
                        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                           <button type="button" (click)="publishNews()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#388e14] text-base font-medium text-white hover:bg-[#2e7510] focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                              Publicar Oficialmente
                           </button>
                           <button type="button" (click)="saveDraft()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                              Guardar Cambios (Borrador)
                           </button>
                           <button type="button" (click)="deleteDraft()" class="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                              Eliminar Borrador
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            }

          } @else if (currentView() === 'equipos') {
            <!-- TEAMS VIEW -->
            <div class="flex flex-col gap-8">
              
              <!-- Page Header -->
              <div class="flex items-end justify-between">
                <div>
                   <h2 class="text-2xl font-bold text-gray-900 mb-2">Gestión de Equipos</h2>
                   <p class="text-lg text-gray-700 font-medium">Listado de Equipos</p>
                </div>
                <button (click)="currentView.set('registrar-equipo')" class="flex items-center gap-2 bg-[#388e14] hover:bg-[#2e7510] text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                  Registrar Nuevo Equipo
                </button>
              </div>

              <!-- Teams Table Card -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                 <div class="px-8 py-6 border-b border-gray-100">
                    <h3 class="text-xl font-bold text-gray-900">Equipos Registrados</h3>
                 </div>
                 
                 <div class="overflow-x-auto">
                   <table class="w-full text-left border-collapse">
                     <thead>
                       <tr class="text-sm text-gray-500 border-b border-gray-100">
                         <th class="px-8 py-4 font-semibold w-1/3">Nombre del Equipo</th>
                         <th class="px-8 py-4 font-semibold">Categoría</th>
                         <th class="px-8 py-4 font-semibold">Jugadores</th>
                         <th class="px-8 py-4 font-semibold">Estado</th>
                         <th class="px-8 py-4 font-semibold text-right">Acciones</th>
                       </tr>
                     </thead>
                     <tbody class="divide-y divide-gray-100">
                       @for (team of teamsList(); track team.id) {
                         <tr class="hover:bg-gray-50 text-sm text-gray-700">
                           <td class="px-8 py-5 font-medium text-gray-900">{{ team.name }}</td>
                           <td class="px-8 py-5">
                             <span class="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
                               {{ team.category }}
                             </span>
                           </td>
                           <td class="px-8 py-5 text-gray-600">{{ team.players }}</td>
                           <td class="px-8 py-5">
                             <span class="inline-block text-xs px-3 py-1 rounded-full font-bold text-white"
                               [ngClass]="{
                                 'bg-[#388e14]': team.status === 'Activo',
                                 'bg-red-500': team.status === 'Inactivo'
                               }">
                               {{ team.status }}
                             </span>
                           </td>
                           <td class="px-8 py-5 text-right">
                             <div class="flex items-center justify-end gap-3">
                               <button class="text-[#388e14] hover:text-[#2e7510] border border-[#388e14] hover:bg-[#388e14]/10 rounded p-1.5 transition-colors">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                               </button>
                               <button class="text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 rounded p-1.5 transition-colors">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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

          } @else if (currentView() === 'registrar-equipo') {
             <!-- REGISTER TEAM VIEW -->
             <div class="flex flex-col gap-8">
               <div class="flex items-center gap-4">
                  <button (click)="currentView.set('equipos')" class="text-gray-500 hover:text-[#388e14] transition-colors">
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  </button>
                  <h2 class="text-2xl font-bold text-gray-900">Registrar Nuevo Equipo</h2>
               </div>

               <div class="w-full max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <div class="mb-8 text-center">
                     <h3 class="text-xl font-bold text-gray-800">Datos del Equipo</h3>
                     <p class="text-gray-500 text-sm mt-1">Ingresa la información para dar de alta un nuevo equipo en la liga.</p>
                  </div>

                  <form [formGroup]="teamForm" (ngSubmit)="onSubmitTeam()" class="space-y-6">
                     <!-- Same team form content as before -->
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1.5">
                           <label for="name" class="block text-sm font-medium text-gray-700">Nombre del Equipo</label>
                           <input type="text" id="name" formControlName="name" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388e14]/20 focus:border-[#388e14] transition-all text-sm" placeholder="Ej: Los Halcones">
                        </div>
                        <div class="space-y-1.5">
                           <label for="category" class="block text-sm font-medium text-gray-700">Categoría</label>
                           <div class="relative">
                              <select id="category" formControlName="category" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388e14]/20 focus:border-[#388e14] transition-all text-sm appearance-none bg-white">
                                 <option value="" disabled selected>Selecciona una categoría</option>
                                 <option value="Primera A">Primera A</option>
                                 <option value="Ascenso B">Ascenso B</option>
                                 <option value="Ascenso C">Ascenso C</option>
                                 <option value="Senior">Senior</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                 <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="space-y-1.5">
                        <label for="guild" class="block text-sm font-medium text-gray-700">Gremio / Institución Base</label>
                        <input type="text" id="guild" formControlName="guild" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388e14]/20 focus:border-[#388e14] transition-all text-sm" placeholder="Ej: Sindicato de Transportistas">
                     </div>
                     <div class="pt-4 flex gap-4">
                        <button type="button" (click)="currentView.set('equipos')" class="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm">
                           Cancelar
                        </button>
                        <button type="submit" [disabled]="teamForm.invalid" class="flex-1 py-3 px-4 bg-[#388e14] hover:bg-[#2e7510] text-white rounded-lg font-bold shadow-md transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                           Registrar Equipo
                        </button>
                     </div>
                  </form>
               </div>
             </div>

          } @else if (currentView() === 'jugadores') {
            <!-- PLAYERS VIEW -->
             <div class="flex flex-col gap-8">
              <div class="flex items-end justify-between">
                <div>
                   <h2 class="text-2xl font-bold text-gray-900 mb-2">Jugadores – Gestión de Jugadores</h2>
                   <p class="text-lg text-gray-700 font-medium">Listado de Jugadores</p>
                </div>
                <button (click)="currentView.set('registrar-jugador')" class="flex items-center gap-2 bg-[#388e14] hover:bg-[#2e7510] text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                  Registrar Nuevo Jugador
                </button>
              </div>
              <!-- Players Table -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                 <div class="px-8 py-6 border-b border-gray-100">
                    <h3 class="text-xl font-bold text-gray-900">Listado de Jugadores</h3>
                 </div>
                 <div class="overflow-x-auto">
                   <table class="w-full text-left border-collapse">
                     <thead>
                       <tr class="text-sm text-gray-500 border-b border-gray-100">
                         <th class="px-8 py-4 font-semibold">Nombre del Jugador</th>
                         <th class="px-8 py-4 font-semibold">Equipo</th>
                         <th class="px-8 py-4 font-semibold">Posición</th>
                         <th class="px-8 py-4 font-semibold">Número</th>
                         <th class="px-8 py-4 font-semibold">Edad</th>
                         <th class="px-8 py-4 font-semibold">Estado</th>
                         <th class="px-8 py-4 font-semibold text-right">Acciones</th>
                       </tr>
                     </thead>
                     <tbody class="divide-y divide-gray-100">
                       @for (player of playersList(); track player.id) {
                         <tr class="hover:bg-gray-50 text-sm text-gray-700">
                           <td class="px-8 py-5">
                              <div class="flex items-center gap-3">
                                 <img [ngSrc]="player.avatar" width="40" height="40" class="rounded-full object-cover" [alt]="player.name">
                                 <span class="font-medium text-gray-900">{{ player.name }}</span>
                              </div>
                           </td>
                           <td class="px-8 py-5 text-gray-600">{{ player.team }}</td>
                           <td class="px-8 py-5 text-gray-600">{{ player.position }}</td>
                           <td class="px-8 py-5 text-gray-600">{{ player.number }}</td>
                           <td class="px-8 py-5 text-gray-600">{{ player.age }}</td>
                           <td class="px-8 py-5">
                             <span class="inline-block text-xs px-3 py-1 rounded-full font-medium"
                               [class.bg-[#ecfccb]]="player.status === 'Activo'"
                               [class.text-[#365314]]="player.status === 'Activo'"
                               [class.bg-red-100]="player.status === 'Inactivo'"
                               [class.text-red-700]="player.status === 'Inactivo'"
                               [class.bg-yellow-100]="player.status === 'Lesionado'"
                               [class.text-yellow-700]="player.status === 'Lesionado'">
                               {{ player.status }}
                             </span>
                           </td>
                           <td class="px-8 py-5 text-right">
                             <div class="flex items-center justify-end gap-3">
                               <button class="text-gray-400 hover:text-[#388e14] transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                               <button class="text-gray-400 hover:text-red-600 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                             </div>
                           </td>
                         </tr>
                       }
                     </tbody>
                   </table>
                 </div>
              </div>
            </div>

          } @else if (currentView() === 'registrar-jugador') {
             <!-- REGISTER PLAYER VIEW -->
             <div class="flex flex-col gap-8">
               <div class="flex items-center gap-4">
                  <button (click)="currentView.set('jugadores')" class="text-gray-500 hover:text-[#388e14] transition-colors">
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  </button>
                  <h2 class="text-2xl font-bold text-gray-900">Registrar Nuevo Jugador</h2>
               </div>
               <!-- Player form content (simplified for brevity, reused from before) -->
               <div class="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <form [formGroup]="playerForm" (ngSubmit)="onSubmitPlayer()" class="space-y-6">
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1.5 md:col-span-2">
                           <label class="block text-sm font-medium text-gray-700">Selección de Equipo</label>
                           <select formControlName="teamId" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388e14]/20 focus:border-[#388e14] text-sm bg-white">
                                 <option value="" disabled selected>Seleccione un equipo</option>
                                 @for (team of teamsList(); track team.id) { <option [value]="team.id">{{ team.name }}</option> }
                           </select>
                        </div>
                        <div class="space-y-1.5">
                           <label class="block text-sm font-medium text-gray-700">Nombres y Apellidos</label>
                           <input type="text" formControlName="fullName" class="w-full px-4 py-3 border rounded-lg focus:outline-none text-sm">
                        </div>
                        <div class="space-y-1.5">
                           <label class="block text-sm font-medium text-gray-700">Cédula</label>
                           <input type="text" formControlName="identityCard" class="w-full px-4 py-3 border rounded-lg focus:outline-none text-sm">
                        </div>
                        <div class="space-y-1.5">
                           <label class="block text-sm font-medium text-gray-700">Fecha Nacimiento</label>
                           <input type="date" formControlName="birthDate" (change)="calculateAge($event)" class="w-full px-4 py-3 border rounded-lg focus:outline-none text-sm">
                           @if (currentPlayerAge() !== null) { <p class="text-sm font-semibold text-[#388e14] mt-1">Edad Actual: {{ currentPlayerAge() }} años</p> }
                        </div>
                     </div>
                     <div class="pt-6 flex gap-4 border-t border-gray-100 mt-6">
                        <button type="button" (click)="currentView.set('jugadores')" class="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm">Cancelar</button>
                        <button type="submit" class="flex-1 py-3 px-4 bg-[#388e14] hover:bg-[#2e7510] text-white rounded-lg font-bold shadow-md transition-colors text-sm">Guardar Jugador</button>
                     </div>
                  </form>
               </div>
             </div>

          } @else if (currentView() === 'partidos') {
            <!-- MATCHES VIEW -->
             <!-- Matches content (simplified) -->
             <div class="flex flex-col gap-8">
               <div class="flex items-end justify-between">
                  <h2 class="text-2xl font-bold text-gray-900 mb-2">Gestión de partidos</h2>
                  <button (click)="currentView.set('programar-partido')" class="flex items-center gap-2 bg-[#388e14] hover:bg-[#2e7510] text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors">Programar Partido</button>
               </div>
               <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                 <div class="overflow-x-auto">
                   <table class="w-full text-left border-collapse">
                     <thead><tr class="text-sm text-gray-500 border-b border-gray-100 bg-gray-50/50"><th class="px-8 py-4">Fecha</th><th class="px-8 py-4">Equipos</th><th class="px-8 py-4">Estado</th></tr></thead>
                     <tbody>
                       @for (match of matchesManagementList(); track match.id) {
                         <tr class="hover:bg-gray-50 text-sm text-gray-700">
                           <td class="px-8 py-5">{{ match.date }}</td>
                           <td class="px-8 py-5 font-medium">{{ match.teams }}</td>
                           <td class="px-8 py-5">{{ match.status }}</td>
                         </tr>
                       }
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>

          } @else if (currentView() === 'programar-partido') {
             <!-- SCHEDULE MATCH VIEW -->
             <div class="flex flex-col gap-8">
               <div class="flex items-center gap-4">
                  <button (click)="currentView.set('partidos')" class="text-gray-500 hover:text-[#388e14] transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></button>
                  <h2 class="text-2xl font-bold text-gray-900">Programar Nuevo Partido</h2>
               </div>
               <div class="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <form [formGroup]="matchForm" (ngSubmit)="onSubmitMatch()" class="space-y-8">
                     <!-- Tournament & Matchday -->
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1.5"><label class="block text-sm font-medium text-gray-700">Torneo</label><select formControlName="tournamentId" class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white"><option value="apertura2024">Apertura 2024</option></select></div>
                        <div class="space-y-1.5"><label class="block text-sm font-medium text-gray-700">Jornada</label><input type="text" formControlName="matchday" class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm"></div>
                     </div>
                     <!-- Matchup -->
                     <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                           <div class="flex-1 w-full space-y-2"><label class="text-xs font-semibold text-gray-500 uppercase">Local</label><select formControlName="homeTeamId" class="w-full px-4 py-3 border rounded-lg font-bold bg-white"><option value="" disabled selected>Seleccionar</option>@for (team of teamsList(); track team.id) {<option [value]="team.id">{{ team.name }}</option>}</select></div>
                           <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-black text-gray-500">VS</div>
                           <div class="flex-1 w-full space-y-2"><label class="text-xs font-semibold text-gray-500 uppercase">Visitante</label><select formControlName="awayTeamId" class="w-full px-4 py-3 border rounded-lg font-bold bg-white"><option value="" disabled selected>Seleccionar</option>@for (team of teamsList(); track team.id) {<option [value]="team.id">{{ team.name }}</option>}</select></div>
                        </div>
                     </div>
                     <div class="pt-4 flex gap-4 border-t border-gray-100">
                        <button type="button" (click)="currentView.set('partidos')" class="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-600 font-medium">Cancelar</button>
                        <button type="submit" [disabled]="matchForm.invalid" class="flex-1 py-3 px-4 bg-[#388e14] text-white rounded-lg font-bold">Programar Partido</button>
                     </div>
                  </form>
               </div>
             </div>

          } @else if (currentView() === 'posiciones') {
            <!-- STANDINGS VIEW -->
            <div class="flex flex-col gap-8">
               <div><h2 class="text-2xl font-bold text-gray-900 mb-6">Tabla de Posiciones</h2></div>
               <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div class="px-8 py-6 border-b border-gray-100"><h3 class="text-xl font-bold text-gray-900">Clasificación</h3></div>
                  <div class="overflow-x-auto">
                     <table class="w-full text-left border-collapse">
                        <thead><tr class="text-xs font-semibold text-gray-500 bg-gray-50/50 border-b border-gray-100 uppercase tracking-wider"><th class="px-6 py-4">Pos</th><th class="px-6 py-4">Equipo</th><th class="px-6 py-4 text-right">Pts</th></tr></thead>
                        <tbody>
                           @for (team of standingsList(); track team.team) {
                              <tr class="hover:bg-gray-50 text-sm text-gray-700">
                                 <td class="px-6 py-4 font-medium">{{ team.pos }}</td>
                                 <td class="px-6 py-4 font-medium">{{ team.team }}</td>
                                 <td class="px-6 py-4 text-right font-bold text-[#388e14]">{{ team.pts }}</td>
                              </tr>
                           }
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          } @else if (currentView() === 'predicciones') {
             <!-- PREDICTIONS VIEW (AI ANALYTICS) -->
             <div class="flex flex-col gap-8 h-full">
               
               <div>
                  <h2 class="text-2xl font-bold text-gray-900">Predicciones de IA</h2>
                  <p class="text-sm text-gray-500">Análisis probabilístico para los próximos encuentros.</p>
               </div>

               <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                 @for (match of predictionMatches(); track match.id) {
                   <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-6">
                     <!-- Match content preserved -->
                      <div class="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">{{ match.date }} • {{ match.time }}</div>
                        <div class="text-xs font-medium text-gray-400">{{ match.venue }}</div>
                     </div>
                     <div class="flex items-center justify-between px-4">
                        <div class="flex flex-col items-center gap-2 w-1/3">
                           <div class="w-16 h-16 rounded-full bg-gray-100 p-2 flex items-center justify-center">
                              <img [src]="match.homeLogo" class="w-12 h-12 object-contain" alt="Home">
                           </div>
                           <span class="font-bold text-gray-900 text-center text-sm leading-tight">{{ match.homeTeam }}</span>
                        </div>
                        <div class="flex flex-col items-center gap-1">
                           <span class="text-2xl font-black text-gray-300">VS</span>
                           @if (match.result) {
                              <span class="px-2 py-0.5 rounded text-[10px] font-bold border" 
                                 [class.bg-green-50]="match.result.confidence === 'Alta'"
                                 [class.text-green-700]="match.result.confidence === 'Alta'"
                                 [class.border-green-200]="match.result.confidence === 'Alta'"
                                 [class.bg-yellow-50]="match.result.confidence === 'Media'"
                                 [class.text-yellow-700]="match.result.confidence === 'Media'"
                                 [class.border-yellow-200]="match.result.confidence === 'Media'">
                                 Confianza {{ match.result.confidence }}
                              </span>
                           }
                        </div>
                        <div class="flex flex-col items-center gap-2 w-1/3">
                           <div class="w-16 h-16 rounded-full bg-gray-100 p-2 flex items-center justify-center">
                              <img [src]="match.awayLogo" class="w-12 h-12 object-contain" alt="Away">
                           </div>
                           <span class="font-bold text-gray-900 text-center text-sm leading-tight">{{ match.awayTeam }}</span>
                        </div>
                     </div>
                     <div class="mt-auto">
                        @if (match.loading) {
                           <div class="py-8 flex flex-col items-center justify-center text-gray-400 gap-3">
                              <svg class="animate-spin h-8 w-8 text-[#388e14]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              <span class="text-xs font-medium animate-pulse">Analizando estadísticas históricas...</span>
                           </div>
                        } @else if (match.result) {
                           <div class="space-y-4">
                              <div class="space-y-1">
                                 <div class="flex justify-between text-xs font-semibold"><span class="text-gray-600">Victoria Local</span><span class="text-gray-900">{{ match.result.homeProb }}%</span></div>
                                 <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden"><div class="bg-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out" [style.width.%]="match.result.homeProb"></div></div>
                              </div>
                              <div class="space-y-1">
                                 <div class="flex justify-between text-xs font-semibold"><span class="text-gray-500">Empate</span><span class="text-gray-700">{{ match.result.drawProb }}%</span></div>
                                 <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden"><div class="bg-gray-400 h-2.5 rounded-full transition-all duration-1000 ease-out" [style.width.%]="match.result.drawProb"></div></div>
                              </div>
                              <div class="space-y-1">
                                 <div class="flex justify-between text-xs font-semibold"><span class="text-gray-600">Victoria Visitante</span><span class="text-gray-900">{{ match.result.awayProb }}%</span></div>
                                 <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden"><div class="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out" [style.width.%]="match.result.awayProb"></div></div>
                              </div>
                              <button (click)="runPrediction(match)" class="w-full mt-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 border border-transparent hover:border-gray-200 rounded transition-colors">Recalcular Probabilidades</button>
                           </div>
                        } @else {
                           <button (click)="runPrediction(match)" class="w-full py-4 bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 group transition-all">
                              <svg class="w-6 h-6 text-gray-400 group-hover:text-[#388e14] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                              <span class="text-sm font-bold text-gray-500 group-hover:text-[#388e14]">Ejecutar Análisis IA</span>
                           </button>
                        }
                     </div>
                   </div>
                 }
               </div>

             </div>

          } @else if (currentView() === 'usuarios') {
             <!-- USERS VIEW -->
             <div class="flex flex-col gap-8 relative">
               
               <!-- Header -->
               <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h2>
                    <p class="text-lg text-gray-700 font-medium">Administración de accesos y roles</p>
                  </div>
                  <button (click)="openCreateUserModal()" class="flex items-center gap-2 bg-[#388e14] hover:bg-[#2e7510] text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                     Registrar Nuevo Usuario
                  </button>
               </div>

               <!-- Users Table -->
               <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div class="overflow-x-auto">
                     <table class="w-full text-left border-collapse">
                        <thead>
                           <tr class="text-sm text-gray-500 border-b border-gray-100 bg-gray-50/50">
                              <th class="px-8 py-4 font-semibold">Usuario</th>
                              <th class="px-8 py-4 font-semibold">Rol</th>
                              <th class="px-8 py-4 font-semibold">Estado</th>
                              <th class="px-8 py-4 font-semibold text-right">Acciones</th>
                           </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                           @for (user of usersList(); track user.id) {
                              <tr class="hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                                 <td class="px-8 py-5">
                                    <div class="flex items-center gap-4">
                                       <img [ngSrc]="user.avatar" width="40" height="40" class="rounded-full object-cover border border-gray-200" [alt]="user.name">
                                       <div class="flex flex-col">
                                          <span class="font-bold text-gray-900">{{ user.name }}</span>
                                          <span class="text-xs text-gray-500">{{ user.email }}</span>
                                       </div>
                                    </div>
                                 </td>
                                 <td class="px-8 py-5">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                                       [class.bg-red-100]="user.role === 'Administrador'"
                                       [class.text-red-800]="user.role === 'Administrador'"
                                       [class.border-red-200]="user.role === 'Administrador'"
                                       [class.bg-blue-100]="user.role === 'Delegado'"
                                       [class.text-blue-800]="user.role === 'Delegado'"
                                       [class.border-blue-200]="user.role === 'Delegado'"
                                       [class.bg-yellow-100]="user.role === 'Árbitro'"
                                       [class.text-yellow-800]="user.role === 'Árbitro'"
                                       [class.border-yellow-200]="user.role === 'Árbitro'"
                                       [class.bg-gray-100]="user.role === 'Aficionado'"
                                       [class.text-gray-800]="user.role === 'Aficionado'"
                                       [class.border-gray-200]="user.role === 'Aficionado'">
                                       {{ user.role }}
                                    </span>
                                    @if (user.teamId && user.role === 'Delegado') {
                                       <div class="text-[10px] text-gray-400 mt-1 pl-1">
                                          Equipo ID: {{ user.teamId }}
                                       </div>
                                    }
                                 </td>
                                 <td class="px-8 py-5">
                                    <div class="flex items-center gap-2">
                                       <span class="w-2 h-2 rounded-full" [class.bg-green-500]="user.status === 'Activo'" [class.bg-red-500]="user.status === 'Inactivo'"></span>
                                       <span class="text-gray-700 font-medium">{{ user.status }}</span>
                                    </div>
                                 </td>
                                 <td class="px-8 py-5 text-right">
                                    <div class="flex items-center justify-end gap-3">
                                       <button (click)="resetPassword(user)" class="text-xs text-blue-600 hover:underline mr-2">Resetear Clave</button>
                                       <button (click)="openEditUserModal(user)" class="text-gray-400 hover:text-[#388e14] transition-colors p-1 hover:bg-green-50 rounded">
                                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                       </button>
                                       <button (click)="deleteUser(user)" class="text-gray-400 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded">
                                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           }
                        </tbody>
                     </table>
                  </div>
               </div>

               <!-- User Modal Overlay -->
               @if (isUserModalOpen()) {
                  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                     <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" (click)="closeUserModal()"></div>
                        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                           <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-5" id="modal-title">
                                 {{ editingUserId() ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}
                              </h3>
                              
                              <form [formGroup]="userForm" class="space-y-4">
                                 <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                    <input type="text" formControlName="name" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#388e14] focus:border-[#388e14] sm:text-sm">
                                 </div>
                                 <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                    <input type="email" formControlName="email" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#388e14] focus:border-[#388e14] sm:text-sm">
                                 </div>
                                 @if (!editingUserId()) {
                                    <div>
                                       <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                       <input type="password" formControlName="password" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#388e14] focus:border-[#388e14] sm:text-sm">
                                    </div>
                                 }
                                 <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                                    <select formControlName="role" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#388e14] focus:border-[#388e14] sm:text-sm bg-white">
                                       <option value="Administrador">Administrador</option>
                                       <option value="Delegado">Delegado</option>
                                       <option value="Árbitro">Árbitro</option>
                                       <option value="Aficionado">Aficionado</option>
                                    </select>
                                 </div>
                                 
                                 <!-- Conditional Team Select for Delegates -->
                                 @if (userForm.get('role')?.value === 'Delegado') {
                                    <div class="p-3 bg-blue-50 rounded-md border border-blue-100 animate-fade-in">
                                       <label class="block text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">Asignar Equipo (Delegado)</label>
                                       <select formControlName="teamId" class="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-blue-900">
                                          <option [ngValue]="null">Sin asignar</option>
                                          @for (team of teamsList(); track team.id) {
                                             <option [value]="team.id">{{ team.name }}</option>
                                          }
                                       </select>
                                    </div>
                                 }

                                 <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                    <select formControlName="status" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#388e14] focus:border-[#388e14] sm:text-sm bg-white">
                                       <option value="Activo">Activo</option>
                                       <option value="Inactivo">Inactivo</option>
                                    </select>
                                 </div>
                              </form>
                           </div>
                           <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                              <button type="button" (click)="saveUser()" [disabled]="userForm.invalid" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#388e14] text-base font-medium text-white hover:bg-[#2e7510] focus:outline-none disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm">
                                 {{ editingUserId() ? 'Guardar Cambios' : 'Crear Usuario' }}
                              </button>
                              <button type="button" (click)="closeUserModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                 Cancelar
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               }

             </div>
          }

        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  // State for internal navigation
  currentView = signal<string>('dashboard');

  // AI NEWS MANAGEMENT STATE
  activeNewsTab = signal<'generation' | 'management'>('generation');
  isGenerating = signal<boolean>(false);
  generatingMatchId = signal<number | null>(null);
  
  // Matches pending news coverage
  matchesForNews = signal<FinishedMatch[]>([
     { id: 101, homeTeam: 'Los Tigres', awayTeam: 'Pumas FC', score: '3-1', date: '2024-10-25' },
     { id: 102, homeTeam: 'Halcones Azules', awayTeam: 'Guerreros', score: '2-2', date: '2024-10-24' },
     { id: 103, homeTeam: 'Estrellas Rojas', awayTeam: 'Dep. Unión', score: '0-1', date: '2024-10-23' }
  ]);

  // News Repository (Drafts + Published)
  newsRepository = signal<NewsItem[]>([
    { 
      id: 1, 
      title: 'Análisis IA: El Rendimiento Sobresaliente del Equipo Alfa', 
      body: 'Un análisis profundo de las estadísticas muestra cómo el Equipo Alfa dominó la posesión...', 
      date: '2024-10-15', 
      status: 'PUBLISHED', 
      image: 'https://picsum.photos/id/101/400/250' 
    },
    { 
      id: 2, 
      title: 'Borrador: Resumen Jornada 5', 
      body: 'La jornada 5 trajo sorpresas inesperadas...', 
      date: '2024-10-26', 
      status: 'DRAFT', 
      image: 'https://picsum.photos/id/102/400/250' 
    }
  ]);

  // Editor Modal State
  editingNews = signal<NewsItem | null>(null);

  // --- PREDICTIONS STATE ---
  predictionMatches = signal<PredictionMatch[]>([
    { 
      id: 1, 
      homeTeam: 'Los Tigres', 
      awayTeam: 'Halcones Azules', 
      date: '2024-11-01', 
      time: '18:00', 
      venue: 'Estadio Central',
      homeLogo: 'https://picsum.photos/id/111/50/50',
      awayLogo: 'https://picsum.photos/id/222/50/50'
    },
    { 
      id: 2, 
      homeTeam: 'Pumas FC', 
      awayTeam: 'Guerreros Blancos', 
      date: '2024-11-02', 
      time: '16:30', 
      venue: 'Cancha Principal',
      homeLogo: 'https://picsum.photos/id/333/50/50',
      awayLogo: 'https://picsum.photos/id/444/50/50'
    },
    { 
      id: 3, 
      homeTeam: 'Estrellas Rojas', 
      awayTeam: 'Deportiva Unión', 
      date: '2024-11-03', 
      time: '20:00', 
      venue: 'Estadio Olímpico',
      homeLogo: 'https://picsum.photos/id/555/50/50',
      awayLogo: 'https://picsum.photos/id/666/50/50'
    }
  ]);

  // --- USER MANAGEMENT STATE ---
  usersList = signal<User[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan.perez@example.com', role: 'Administrador', status: 'Activo', avatar: 'https://picsum.photos/id/1005/100/100' },
    { id: 2, name: 'María García', email: 'maria.garcia@example.com', role: 'Árbitro', status: 'Activo', avatar: 'https://picsum.photos/id/1011/100/100' },
    { id: 3, name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', role: 'Delegado', status: 'Inactivo', teamId: 1, avatar: 'https://picsum.photos/id/1027/100/100' },
    { id: 4, name: 'Ana López', email: 'ana.lopez@example.com', role: 'Aficionado', status: 'Inactivo', avatar: 'https://picsum.photos/id/1062/100/100' },
    { id: 5, name: 'Pedro González', email: 'pedro.gonzalez@example.com', role: 'Aficionado', status: 'Activo', avatar: 'https://picsum.photos/id/338/100/100' },
    { id: 6, name: 'Laura Fernández', email: 'laura.fernandez@example.com', role: 'Delegado', status: 'Activo', teamId: 2, avatar: 'https://picsum.photos/id/64/100/100' }
  ]);

  isUserModalOpen = signal(false);
  editingUserId = signal<number | null>(null);
  
  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''], // Only required for creation
    role: ['Aficionado', Validators.required],
    status: ['Activo', Validators.required],
    teamId: [null as number | null]
  });

  // --- SETTINGS STATE ---
  currentTournament = signal<Tournament>({
    name: 'Torneo Clausura 2024',
    startDate: '2024-07-01',
    endDate: '2024-12-15',
    status: 'Activo'
  });

  leagueRules = signal<LeagueRules>({
    pointsPerWin: 3,
    pointsPerDraw: 1,
    yellowCardsLimit: 5
  });

  auditLogs = signal<AuditLog[]>([
    { id: 1, user: 'Admin', action: 'Actualización de Resultados (Partido ID: 101)', timestamp: 'Hace 5 min', type: 'info' },
    { id: 2, user: 'Admin', action: 'Registro de Nuevo Jugador (Juan P.)', timestamp: 'Hace 2 horas', type: 'info' },
    { id: 3, user: 'System', action: 'Backup Automático Completado', timestamp: 'Hace 1 día', type: 'warning' }
  ]);

  showNewTournamentForm = signal(false);
  isBackupLoading = signal(false);
  
  newTournamentForm = this.fb.group({
    name: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });

  // --- SETTINGS METHODS ---
  addLog(action: string, type: 'info' | 'warning' | 'danger' = 'info') {
    const newLog: AuditLog = {
      id: Date.now(),
      user: 'Admin',
      action: action,
      timestamp: 'Ahora mismo',
      type: type
    };
    this.auditLogs.update(logs => [newLog, ...logs]);
  }

  closeTournament() {
    if (confirm('¿Estás seguro de cerrar el torneo actual? Esto congelará las tablas.')) {
      this.currentTournament.update(t => ({ ...t, status: 'Finalizado' }));
      this.addLog('Torneo Finalizado Manualmente', 'warning');
    }
  }

  createTournament() {
    if (this.newTournamentForm.valid) {
      const val = this.newTournamentForm.value;
      this.currentTournament.set({
        name: val.name!,
        startDate: val.startDate!,
        endDate: val.endDate!,
        status: 'Activo'
      });
      this.showNewTournamentForm.set(false);
      this.newTournamentForm.reset();
      this.addLog(`Creación de Nuevo Torneo: ${val.name}`, 'warning');
      alert('Nuevo torneo iniciado exitosamente.');
    }
  }

  saveRules() {
    this.addLog('Actualización de Reglas de la Liga', 'warning');
    alert('Reglas guardadas correctamente.');
  }

  generateBackup() {
    this.isBackupLoading.set(true);
    setTimeout(() => {
      this.isBackupLoading.set(false);
      this.addLog('Generación de Backup de Base de Datos', 'info');
      alert('Copia de seguridad generada y descargada.');
    }, 2000);
  }

  // --- USER METHODS ---
  openCreateUserModal() {
    this.editingUserId.set(null);
    this.userForm.reset({ role: 'Aficionado', status: 'Activo' });
    this.userForm.get('password')?.setValidators(Validators.required);
    this.userForm.get('password')?.updateValueAndValidity();
    this.isUserModalOpen.set(true);
  }

  openEditUserModal(user: User) {
    this.editingUserId.set(user.id);
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      teamId: user.teamId
    });
    this.userForm.get('password')?.clearValidators(); // No password required for edit
    this.userForm.get('password')?.updateValueAndValidity();
    this.isUserModalOpen.set(true);
  }

  closeUserModal() {
    this.isUserModalOpen.set(false);
    this.userForm.reset();
  }

  saveUser() {
    if (this.userForm.valid) {
      const formVal = this.userForm.value;
      
      if (this.editingUserId()) {
        // Edit existing
        this.usersList.update(users => users.map(u => 
          u.id === this.editingUserId() 
          ? { ...u, ...formVal, teamId: formVal.role === 'Delegado' ? formVal.teamId : undefined } as User 
          : u
        ));
      } else {
        // Create new
        const newUser: User = {
          id: Date.now(),
          name: formVal.name!,
          email: formVal.email!,
          role: formVal.role as any,
          status: formVal.status as any,
          teamId: formVal.role === 'Delegado' ? formVal.teamId! : undefined,
          avatar: `https://picsum.photos/seed/${Date.now()}/100/100`
        };
        this.usersList.update(users => [...users, newUser]);
      }
      this.closeUserModal();
    }
  }

  deleteUser(user: User) {
    if (confirm(`¿Estás seguro de eliminar al usuario ${user.name}?`)) {
      this.usersList.update(users => users.filter(u => u.id !== user.id));
    }
  }

  resetPassword(user: User) {
    alert(`Se ha enviado un correo de restablecimiento de contraseña a ${user.email}`);
  }


  runPrediction(match: PredictionMatch) {
    match.loading = true;
    match.result = undefined; // Reset result while loading

    setTimeout(() => {
      // 1. Generate random probability for Home Win (20% - 70%)
      const homeRaw = Math.floor(Math.random() * (70 - 20 + 1)) + 20;
      
      // 2. Generate remaining for Draw (10% - 40% of remaining)
      const remainingForDraw = 100 - homeRaw;
      const drawRaw = Math.floor(Math.random() * (remainingForDraw * 0.6));
      
      // 3. The rest is Away Win
      const awayRaw = 100 - homeRaw - drawRaw;

      // 4. Determine Confidence
      const maxVal = Math.max(homeRaw, drawRaw, awayRaw);
      let confidence: 'Alta' | 'Media' | 'Baja' = 'Baja';
      if (maxVal >= 60) confidence = 'Alta';
      else if (maxVal >= 45) confidence = 'Media';

      // 5. Update State
      match.result = {
        homeProb: homeRaw,
        drawProb: drawRaw,
        awayProb: awayRaw,
        confidence: confidence
      };
      match.loading = false;
    }, 1500); // Simulate 1.5s API delay
  }


  // --- ACTIONS ---

  // 1. Generate Draft (AI Simulation)
  generateDraft(match: FinishedMatch) {
    this.isGenerating.set(true);
    this.generatingMatchId.set(match.id);

    setTimeout(() => {
      const newDraft: NewsItem = {
        id: Date.now(),
        title: `Crónica: ${match.homeTeam} vence a ${match.awayTeam}`,
        body: `En un emocionante encuentro disputado el ${match.date}, ${match.homeTeam} logró imponerse con un marcador de ${match.score} frente a ${match.awayTeam}. El partido estuvo lleno de intensidad... (Texto generado por IA)`,
        date: new Date().toISOString().split('T')[0],
        status: 'DRAFT',
        matchInfo: `${match.homeTeam} vs ${match.awayTeam}`,
        image: 'https://picsum.photos/seed/football/400/250'
      };

      // Add to repository
      this.newsRepository.update(current => [newDraft, ...current]);
      
      // Remove from pending list
      this.matchesForNews.update(current => current.filter(m => m.id !== match.id));

      this.isGenerating.set(false);
      this.generatingMatchId.set(null);
      this.activeNewsTab.set('management'); // Switch tab to show the new draft
    }, 1500);
  }

  // 2. Editor Actions
  openEditor(news: NewsItem) {
    // Create a copy to avoid mutating state directly in the form before saving
    this.editingNews.set({ ...news }); 
  }

  closeEditor() {
    this.editingNews.set(null);
  }

  saveDraft() {
    if (this.editingNews()) {
      this.newsRepository.update(items => 
        items.map(item => item.id === this.editingNews()!.id ? this.editingNews()! : item)
      );
      this.closeEditor();
    }
  }

  publishNews() {
    if (this.editingNews()) {
      const publishedVersion = { ...this.editingNews()!, status: 'PUBLISHED' as const };
      this.newsRepository.update(items => 
        items.map(item => item.id === publishedVersion.id ? publishedVersion : item)
      );
      alert('¡Noticia publicada oficialmente en el portal!');
      this.closeEditor();
    }
  }

  deleteDraft() {
    if (this.editingNews() && confirm('¿Estás seguro de eliminar este borrador?')) {
      this.newsRepository.update(items => items.filter(i => i.id !== this.editingNews()!.id));
      this.closeEditor();
    }
  }


  // --- EXISTING LOGIC FOR OTHER VIEWS ---
  
  menuItems = signal([
    { id: 'dashboard', label: 'Dashboard', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>' },
    { id: 'equipos', label: 'Equipos', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 21h18M5 11l7-7 7 7"></path></svg>' },
    { id: 'jugadores', label: 'Jugadores', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>' },
    { id: 'partidos', label: 'Partidos', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
    { id: 'posiciones', label: 'Tabla de posiciones', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>' },
    { id: 'noticias', label: 'Noticias IA', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9"></path></svg>' },
    { id: 'predicciones', label: 'Predicciones', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>' },
    { id: 'usuarios', label: 'Usuarios', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>' },
    { id: 'configuracion', label: 'Configuración', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>' },
  ]);

  navigate(event: Event, viewId: string) {
    event.preventDefault();
    this.currentView.set(viewId);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  // --- EXISTING FORM LOGIC ---
  teamForm = this.fb.group({ name: ['', Validators.required], category: ['', Validators.required], guild: ['', Validators.required], primaryColor: ['#000000', Validators.required], secondaryColor: ['#ffffff', Validators.required], logo: [null] });
  logoPreview = signal<string | null>(null);
  onLogoSelected(event: any) { const file = event.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = e => this.logoPreview.set(e.target?.result as string); reader.readAsDataURL(file); } }
  onSubmitTeam() { if (this.teamForm.valid) { alert('Equipo registrado exitosamente'); this.currentView.set('equipos'); this.teamForm.reset(); this.logoPreview.set(null); } }

  playerForm = this.fb.group({ teamId: ['', Validators.required], fullName: ['', Validators.required], identityCard: ['', Validators.required], birthDate: ['', Validators.required], position: [''], jerseyNumber: [''], photo: [null] });
  playerPhotoPreview = signal<string | null>(null);
  currentPlayerAge = signal<number | null>(null);
  calculateAge(event: Event) { const input = event.target as HTMLInputElement; if (input.value) { const birthDate = new Date(input.value); const today = new Date(); let age = today.getFullYear() - birthDate.getFullYear(); const m = today.getMonth() - birthDate.getMonth(); if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; } this.currentPlayerAge.set(age); } }
  onSubmitPlayer() { if (this.playerForm.valid) { alert('Jugador registrado exitosamente'); this.currentView.set('jugadores'); this.playerForm.reset(); this.currentPlayerAge.set(null); } }

  teamsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => { const home = control.get('homeTeamId'); const away = control.get('awayTeamId'); return home && away && home.value && away.value && home.value === away.value ? { sameTeam: true } : null; };
  matchForm = this.fb.group({ tournamentId: ['', Validators.required], matchday: ['', Validators.required], homeTeamId: ['', Validators.required], awayTeamId: ['', Validators.required], dateTime: ['', Validators.required], location: [''] }, { validators: this.teamsMatchValidator });
  onSubmitMatch() { if (this.matchForm.valid) { alert('Partido programado exitosamente'); this.currentView.set('partidos'); this.matchForm.reset(); } }

  // --- DATA SIGNALS ---
  recentMatches = signal([{ id: 1, team1: 'Los Leones', team2: 'Águilas Rojas', date: '15/10/2024', time: '19:00', venue: 'Estadio Principal' }, { id: 2, team1: 'Toros Negros', team2: 'Zorros Grises', date: '15/10/2024', time: '21:00', venue: 'Campo Alterno' }, { id: 3, team1: 'Panteras Azules', team2: 'Lobos Blancos', date: '16/10/2024', time: '18:30', venue: 'Estadio Secundario' }, { id: 4, team1: 'Dragones Verdes', team2: 'Tigres Dorados', date: '16/10/2024', time: '20:30', venue: 'Estadio Principal' }, { id: 5, team1: 'Halcones Azules', team2: 'Serpientes Negras', date: '17/10/2024', time: '19:00', venue: 'Campo Alterno' }]);
  teamsList = signal([{ id: 1, name: 'Halcones Dorados', category: 'Masculina', players: 18, status: 'Activo' }, { id: 2, name: 'Panteras Negras FC', category: 'Femenina', players: 15, status: 'Activo' }, { id: 3, name: 'Dragones Rojos', category: 'Mixta', players: 20, status: 'Activo' }, { id: 4, name: 'Guerreros Azules', category: 'Masculina', players: 17, status: 'Inactivo' }, { id: 5, name: 'Estrellas Verdes', category: 'Juvenil', players: 12, status: 'Activo' }, { id: 6, name: 'Titanes Blancos', category: 'Masculina', players: 19, status: 'Activo' }]);
  playersList = signal([{ id: 1, name: 'Juan Pérez', team: 'Los Leones', position: 'Delantero', number: 9, age: 25, status: 'Activo', avatar: 'https://picsum.photos/id/1005/100/100' }, { id: 2, name: 'Carlos Díaz', team: 'Los Leones', position: 'Defensa', number: 3, age: 28, status: 'Activo', avatar: 'https://picsum.photos/id/1011/100/100' }, { id: 3, name: 'Ana García', team: 'Atlético Yacuiba', position: 'Mediocampista', number: 7, age: 22, status: 'Activo', avatar: 'https://picsum.photos/id/1027/100/100' }]);
  matchesManagementList = signal([{ id: 1, date: '2023-11-26', time: '18:00', teams: 'Leones Rojos vs Águilas Doradas', location: 'Estadio Principal', status: 'Finalizado', result: '2 - 1', action: 'Finalizado' }, { id: 2, date: '2023-11-27', time: '20:30', teams: 'Dragones Azules vs Tigres Blancos', location: 'Cancha Secundaria', status: 'Programado', result: '-', action: 'Registrar' }, { id: 3, date: '2023-11-28', time: '16:00', teams: 'Lobos Grises vs Panteras Negras', location: 'Campo de Entrenamiento', status: 'Cancelado', result: 'Cancelado', action: '' }]);
  standingsList = signal([{ pos: 1, team: 'Los Gigantes', pj: 10, pg: 8, pe: 1, pp: 1, gf: 25, gc: 8, dg: 17, pts: 25, logo: 'https://picsum.photos/id/111/50/50' }, { pos: 2, team: 'Fuerza Verde', pj: 10, pg: 7, pe: 2, pp: 1, gf: 20, gc: 7, dg: 13, pts: 23, logo: 'https://picsum.photos/id/222/50/50' }, { pos: 3, team: 'Campeones B', pj: 8, pg: 7, pe: 1, pp: 0, gf: 18, gc: 5, dg: 13, pts: 22, logo: 'https://picsum.photos/id/333/50/50' }]);
}
