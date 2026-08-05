import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MidiGeneratorService } from '../services/midi-generator';
import { PatternVisualizerComponent } from '../components/pattern-visualizer/pattern-visualizer';



@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [
  ReactiveFormsModule,
  PatternVisualizerComponent
],
  templateUrl: './generator.html',
  styleUrls: ['./generator.css']
})
export class GeneratorComponent {
  patternForm: FormGroup;
  availableScales = ['Major', 'Minor', 'Harmonic Minor', 'Phrygian', 'Dorian', 'Minor Pentatonic', 'Locrian', 'Chromatic'];
  availableKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  constructor(private fb: FormBuilder, private midiService: MidiGeneratorService) {
    this.patternForm = this.fb.group({
      name: ['Industrial Bassline', Validators.required],
      bpm: [120, [
        Validators.required,
        Validators.min(60),
        Validators.max(200)
      ]],
      lengthInBars: [4, [
        Validators.required,
        Validators.min(1),
        Validators.max(16)
      ]],
      scale: ['Phrygian', Validators.required], 
      key: ['C', Validators.required]
    });
  }

  onGenerate() {
    if (this.patternForm.valid) {
      const formValues = this.patternForm.value;
      console.log('Sending a request to the backend with:', formValues);

      this.midiService.generatePattern(formValues).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;

          const fileName = formValues.name.replace(/\s+/g, '_') + '.mid';
          a.download = fileName;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (err: any) => {
          console.error('Connection error:', err);
          alert('Oops! MIDI could not be generated. Is your Spring Boot server running?');
        }
      });
    }
  }
}