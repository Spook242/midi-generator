import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MidiGeneratorService } from '../services/midi-generator';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './generator.html',
  styleUrl: './generator.css'
})
export class Generator {
  bpm: number = 120;
  selectedKey: string = 'C';
  selectedScale: string = 'MAJOR';

  constructor(private midiService: MidiGeneratorService) {}

  generateMidi() {
    const payload = {
      bpm: this.bpm,
      key: this.selectedKey,
      scale: this.selectedScale
    };

    console.log('Sending parameters to the backend...', payload);

    this.midiService.generatePattern(payload).subscribe({
      next: (response: Blob) => {
        console.log('MIDI file successfully received from the backend!', response);

        const blob = new Blob([response], { type: 'audio/midi' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'generated-pattern.midi';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error connecting to the server:', err);
      }
    });
  }
}
