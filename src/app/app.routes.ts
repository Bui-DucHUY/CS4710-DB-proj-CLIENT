import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProvidersComponent } from './providers/providers.component';
import { ServicesComponent } from './services/services.component';
import { BillingComponent } from './billing/billing.component';
import { AnalyticsComponent } from './analytics/analytics.component'; // Import

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'providers', component: ProvidersComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'analytics', component: AnalyticsComponent } // Add route
];