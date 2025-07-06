import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SuiviapprenantComponent } from '../suiviapprenant/suiviapprenant.component';
import { SuiviparentComponent } from '../suiviparent/suiviparent.component';

@Component({
  selector: 'app-gestioninscription',
  templateUrl: './gestioninscription.component.html',
  styleUrl: './gestioninscription.component.css'
})
export class GestioninscriptionComponent {
  private dialog = inject(MatDialog);

  openSuiviApprenant(): void {
    this.dialog.open(SuiviapprenantComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: false
    });
  }

  openSuiviParent(): void {
    this.dialog.open(SuiviparentComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: false
    });
  }
}
