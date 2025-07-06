import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LaravelApi } from '@app/core/api/laravel.api';
import { UserProfile, User } from '@app/core/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getProfile(): Observable<User> {
    return this.http.get<User>(LaravelApi.profil);
  }

  updateProfile(profile: UserProfile): Observable<{ message: string }> {
    // L'API reçoit généralement { firstName, lastName, email }
    // Assurez-vous que votre backend attend les bons champs.
    const payload = {
      nom: profile.nom,
      prenom: profile.prenom,
      email: profile.email,
      login: profile.login,
      password: profile.password
      // N'envoyez pas l'ID dans le body si l'API l'attend dans l'URL ou le JWT
    };
    return this.http.put<{ message: string } >(LaravelApi.profil, payload);
  }

  
}
