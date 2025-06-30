import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evaluation',
  imports: [CommonModule],
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.css'
})
export class EvaluationComponent {
  activeTab: 'pending' | 'completed' | 'results' = 'pending';
}
