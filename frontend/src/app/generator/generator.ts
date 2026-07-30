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
    console.log('🎵 ¡Button pressed! Preparing data for the server...');
    console.log('velocity (BPM):', this.bpm);
    console.log('Root Note:', this.selectedKey);
    console.log('Scale:', this.selectedScale);
  }


}
