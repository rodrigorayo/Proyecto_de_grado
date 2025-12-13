import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { DelegateDashboardComponent } from './delegate-dashboard.component';
import { RefereeDashboardComponent } from './referee-dashboard.component';
import { authGuard } from './auth.guard';

// --- IMPORTS PÚBLICOS (Layout y Vistas) ---
import { PublicLayoutComponent } from './layout/public-layout.component';
import { LandingComponent } from './public/landing.component';
// Aquí traemos los componentes nuevos que acabas de crear:
import { PublicStandingsComponent } from './public/public-standings.component';
import { PublicMatchesComponent } from './public/public-matches.component';

export const routes: Routes = [
  // --- 1. ZONA PÚBLICA (Fans) ---
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: LandingComponent }, // Inicio
      
      // AHORA SÍ: Conectamos las vistas reales
      { path: 'posiciones', component: PublicStandingsComponent }, 
      { path: 'partidos', component: PublicMatchesComponent }
    ]
  },

  // --- 2. AUTENTICACIÓN ---
  { path: 'login', component: LoginComponent },

  // --- 3. ZONA PRIVADA (Admin) ---
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [authGuard] 
  },
  
  // Otros roles
  { path: 'delegate', component: DelegateDashboardComponent },
  { path: 'referee', component: RefereeDashboardComponent },

  // --- 4. FALLBACK ---
  { path: '**', redirectTo: '' }
];