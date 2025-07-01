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
import { EvaluerformateurComponent } from './componentsSuperviseur/evaluerformateur/evaluerformateur.component';
import { SuiviglobalComponent } from './componentsSuperviseur/suiviglobal/suiviglobal.component';
import { PaiementsComponent } from './componentsSuperviseur/paiements/paiements.component';
import { ClasseComponent } from './componentsSuperviseur/classe/classe.component';
import { SeanceComponent } from './componentsSuperviseur/seance/seance.component';
import { GestionseanceComponent } from './componentsSuperviseur/gestionseance/gestionseance.component';
import { NouvelleformationComponent } from './componentsSuperviseur/nouvelleformation/nouvelleformation.component';

export const PRIVATE_ROUTES: Routes = [
  {
    path: 'app',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ContentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'compte',
        component: CompteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ajouter',
        component: AjouterComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'listesuperviseur',
        component: ListecompteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'formations',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: FormationsComponent },
          { path: 'nouvelle', component: NouvelleformationComponent },
          { path: 'editer/:id', component: NouvelleformationComponent },
        ]
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
      {
        path: 'evaluer',
        component: EvaluerformateurComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'suiviglobal',
        component: SuiviglobalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'paiements',
        component: PaiementsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'classe',
        component: ClasseComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'seance',
        component: SeanceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'gestionseance',
        component: GestionseanceComponent,
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
