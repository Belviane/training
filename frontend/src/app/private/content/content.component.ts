import { Component, OnInit} from '@angular/core';
import { AuthService } from '@app/core/auth/services/auth.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content',
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {
  userRole: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(){
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getUserRole();
    
  }
  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  navigateTo(route: string) {
    this.router.navigate(['/admin', route]);
  }

 
}