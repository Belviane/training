import { Routes } from '@angular/router';
import { PUBLIC_ROUTES } from './public/public.routes';
import { PRIVATE_ROUTES } from './private/private.routes';
import { NotFoundComponent } from './core/not-found/not-found.component';

export const APP_ROUTES: Routes = [
    ...PUBLIC_ROUTES,
    ...PRIVATE_ROUTES,
    {
        path: '**', component: NotFoundComponent
    }
];
