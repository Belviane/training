import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suiviglobal',
  imports: [CommonModule],
  templateUrl: './suiviglobal.component.html',
  styleUrl: './suiviglobal.component.css'
})
export class SuiviglobalComponent {
  activeTab: 'classes' | 'utilisateurs' | 'paiements' = 'classes';
}
