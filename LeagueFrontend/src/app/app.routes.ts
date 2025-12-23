import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard.component'; // 👈 RUTA NUEVA
import { DelegateDashboardComponent } from './features/delegate-dashboard/delegate-dashboard.component';
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

  // --- ZONA PRIVADA ---
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: 'committee', component: CommitteeDashboardComponent, canActivate: [authGuard] },
  { path: 'delegate', component: DelegateDashboardComponent, canActivate: [authGuard] },
  { path: 'referee', component: RefereeDashboardComponent },

  { path: '**', redirectTo: '' }
];