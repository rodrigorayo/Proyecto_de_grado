import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { DelegateDashboardComponent } from './delegate-dashboard.component';
import { RefereeDashboardComponent } from './referee-dashboard.component';
import { authGuard } from './auth.guard';

// Imports Públicos
import { PublicLayoutComponent } from './layout/public-layout.component';
import { LandingComponent } from './public/landing.component';
import { PublicStandingsComponent } from './public/public-standings.component';
import { PublicMatchesComponent } from './public/public-matches.component';

// Import del Comité
import { CommitteeDashboardComponent } from './features/committee-dashboard/committee-dashboard.component';

export const routes: Routes = [
  // --- ZONA PÚBLICA ---
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'posiciones', component: PublicStandingsComponent }, 
      { path: 'partidos', component: PublicMatchesComponent }
    ]
  },

  // --- LOGIN ---
  { path: 'login', component: LoginComponent },

  // --- ZONA PRIVADA (Admin) ---
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [authGuard] 
  },
  
  // --- ZONA PRIVADA (Comité) ---
  // Esta es la ruta crítica que faltaba
  { 
    path: 'committee', 
    component: CommitteeDashboardComponent, 
    canActivate: [authGuard] 
  },

  // --- OTROS ROLES ---
  { path: 'delegate', component: DelegateDashboardComponent },
  { path: 'referee', component: RefereeDashboardComponent },

  // --- FALLBACK (Si no encuentra ruta, va al inicio) ---
  { path: '**', redirectTo: '' }
];