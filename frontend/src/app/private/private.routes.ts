import { Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompteComponent } from './compte/compte.component';
import { NotFoundComponent } from '@app/core/not-found/not-found.component';
import { ContentComponent } from './content/content.component';
import { AjouterComponent } from '@app/core/shared/modals/ajouter/ajouter.component';
import { ListecompteComponent } from './componentsSuperviseur/listecompte/listecompte.component';
import { FormationsComponent } from './componentsSuperviseur/formations/formations.component';
import { SuiviapprenantComponent } from './componentsFormateur/suiviapprenant/suiviapprenant.component';
import { EvaluationComponent } from './componentsApprenant/evaluation/evaluation.component';

export const PRIVATE_ROUTES: Routes = [
  {
    path: 'app',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', 
        component: ContentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'compte',
        component: CompteComponent,
        canActivate: [AuthGuard], // si tu as une protection
      },
      {
        path: 'ajouter',
        component: AjouterComponent, // Remplacez par le composant approprié pour ajouter un utilisateur
        canActivate: [AuthGuard], // si tu as une protection
      },
      {
        path: 'listesuperviseur',
        component: ListecompteComponent,
        canActivate: [AuthGuard], 
      },
      {
        path: 'formations',
        component: FormationsComponent,
        canActivate: [AuthGuard], 
      },
      
      {
        path: 'apprenants',
        component: SuiviapprenantComponent,
        canActivate: [AuthGuard], 
      },
      {
        path: 'evaluation',
        component: EvaluationComponent,
        canActivate: [AuthGuard], 
      },
      { path: '**', redirectTo: '' },

    ]
  },
  {
    path: 'unauthorized',
    component: NotFoundComponent,
    canActivate: [AuthGuard],
  },

];
