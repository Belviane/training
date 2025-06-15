import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { FormationsComponent } from './views/formations/formations.component';
import { AboutComponent } from './views/about/about.component';
import { ContactComponent } from './views/contact/contact.component';
import { RegisterComponent } from './auth/register/register.component';

export const PUBLIC_ROUTES: Routes = [
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
      { path: 'formations', component: FormationsComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent }
    ]
  }
];