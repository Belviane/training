import { Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContentComponent } from './content/content.component';

export const PRIVATE_ROUTES: Routes = [
    {
    path: 'app',
    component: DashboardComponent, // Layout principal
    //canActivate: [AuthGuard], // Protection globale
    children: [
      { path: '', component: ContentComponent }, // http://localhost:4200/app
      // Tableau de bord (accessible à tous les utilisateurs connectés)
      // { 
      //   path: '', 
      //   component: ContentComponent,
      //   data: { 
      //     title: 'Tableau de bord',
      //     breadcrumb: 'Accueil'
      //   }
      // },

      // Zone administration (réservée aux admins/superviseurs)
    //   {
    //     path: 'admin',
    //     loadChildren: () => import('./admin/admin.routes'),
    //     data: {
    //       roles: [UserRole.ADMIN, UserRole.SUPERVISOR],
    //       title: 'Administration'
    //     }
    //   },

      // Espace formateur
    //   {
    //     path: 'trainer',
    //     loadComponent: () => import(),
    //     data: {
    //       roles: [UserRole.TRAINER],
    //       title: 'Espace Formateur'
    //     }
    //   },

      // Espace apprenant
    //   {
    //     path: 'learner',
    //     loadComponent: () => import('./learner/learner.component'),
    //     data: {
    //       roles: [UserRole.LEARNER, UserRole.PARENT], // Parents peuvent voir certaines pages
    //       title: 'Espace Apprenant'
    //     }
    //   },

      // Gestion financière (comptables)
    //   {
    //     path: 'finance',
    //     loadChildren: () => import('./finance/finance.routes'),
    //     data: {
    //       roles: [UserRole.CASHIER, UserRole.AUDITOR, UserRole.ADMIN],
    //       title: 'Gestion Financière'
    //     }
    //   },

      // Paramètres (accessible à tous mais avec restrictions selon le rôle)
    //   {
    //     path: 'settings',
    //     loadComponent: () => import('./settings/settings.component'),
    //     data: {
    //       title: 'Paramètres'
    //     }
    //   }
    ]
  }
];
