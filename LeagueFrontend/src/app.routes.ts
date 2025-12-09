
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { DelegateDashboardComponent } from './delegate-dashboard.component';
import { RefereeDashboardComponent } from './referee-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'delegate', component: DelegateDashboardComponent },
  { path: 'referee', component: RefereeDashboardComponent },
  { path: '**', redirectTo: '' }
];
