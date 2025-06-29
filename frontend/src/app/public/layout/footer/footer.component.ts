import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{

  currentYear: number = new Date().getFullYear();  
  menuOpen = false;

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]).then(() => {
    });
  }

  constructor(
    private router: Router) {}
}
