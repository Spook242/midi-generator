import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generator',
  imports: [FormsModule],
  templateUrl: './generator.html',
  styleUrl: './generator.css'
})
export class Generator {
  bpm: number = 120;
  selectedKey: string = 'C';
  selectedScale: string = 'MAJOR';

  generateMidi() {
    console.log('🎵 ¡Botón pulsado! Preparando datos para el servidor...');
    console.log('Velocidad (BPM):', this.bpm);
    console.log('Nota Raíz:', this.selectedKey);
    console.log('Escala:', this.selectedScale);
  }


}
