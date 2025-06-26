import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SanctumService {

  constructor(private http: HttpClient) { }

  initializeCsrfProtection(): void {
    this.http.get('/sanctum/csrf-cookie', {
      withCredentials: true
    }).subscribe({
      next: () => {
        console.log('CSRF protection initialized');
      },
      error: (error) => {
        console.error('Error initializing CSRF protection:', error);
      }
    });
  }

}
