import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';


export const PUBLIC_ROUTES: Routes = [
    // Route pour le login (sans layout)
  { 
    path: 'login', 
    component: LoginComponent // Pas de header/footer ici
  },
  // Routes publiques (avec layout)
  {
    path: '',
    component: PublicLayoutComponent, // Layout avec header/footer
    children: [
      { path: '', component: HomeComponent }, // http://localhost:4200/
      // ... autres routes publiques (ex: 'about', 'contact')
    ]
  }
];