import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  isSubmitting = false;
  
  formData = {
    name: '',
    email: '',
    phone: '',
    formation: '',
    message: ''
  };

  onSubmit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simulation d'envoi
    setTimeout(() => {
      alert('Merci pour votre message ! Nous vous recontacterons rapidement.');
      this.resetForm();
      this.isSubmitting = false;
    }, 2000);
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      formation: '',
      message: ''
    };
  }
}
