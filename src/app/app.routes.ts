import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProvidersComponent } from './providers/providers.component';
import { ServicesComponent } from './services/services.component'; // Import this
import { BillingComponent } from './billing/billing.component'; // Import this (we'll make it next)

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'providers', component: ProvidersComponent },
  { path: 'services', component: ServicesComponent }, // Add this
  { path: 'billing', component: BillingComponent }    // Add this
];