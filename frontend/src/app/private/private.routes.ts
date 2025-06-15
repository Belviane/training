import { Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompteComponent } from './compte/compte.component';
import { NotFoundComponent } from '@app/core/not-found/not-found.component';

export const PRIVATE_ROUTES: Routes = [
  {
    path: 'app',
    component: DashboardComponent,
  },
  {
    path: 'compte',
    component: CompteComponent,
    canActivate: [AuthGuard], // si tu as une protection
    data: { roles: ['administrateur'] }
  },
  {
    path: 'unauthorized',
    component: NotFoundComponent,
  },
];
