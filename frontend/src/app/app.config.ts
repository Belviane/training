import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { TokenInterceptor } from './core/auth/interceptors/token.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(APP_ROUTES),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-full-width',
      preventDuplicates: true,
    }),
  ]
};
