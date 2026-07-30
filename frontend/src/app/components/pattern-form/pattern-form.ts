import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pattern-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pattern-form.html',
  styleUrls: ['./pattern-form.css']
})
export class PatternFormComponent {
  patternName: string = 'My Pattern';
  bpm: number = 150;
  selectedKey: string = 'G#';
  selectedScale: string = 'Pentatonic';
  keys: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  scales: string[] = ['Major', 'Minor', 'Pentatonic'];
  lengthInBars: number = 4;

  @Output() generate = new EventEmitter<any>();

  onSubmit() {
    const payload = {
      name: this.patternName,
      bpm: this.bpm,
      key: this.selectedKey,
      scale: this.selectedScale,
      lengthInBars: this.lengthInBars
    };
    this.generate.emit(payload);
  }
}
