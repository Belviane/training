import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true // <-- Déclaration standalone
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number): string {
    return `${value.toLocaleString('fr-FR')} FCFA`;
  }
}   