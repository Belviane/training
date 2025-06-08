import { Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

export const PRIVATE_ROUTES: Routes = [
    {
    path: 'app',
    component: DashboardComponent,
    
  }
];
