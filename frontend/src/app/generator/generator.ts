import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { debounceTime } from 'rxjs';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { MidiGeneratorService } from '../services/midi-generator';
import { PatternVisualizerComponent } from '../components/pattern-visualizer/pattern-visualizer';
import { PatternPreview } from '../models/pattern-preview';

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
export class GeneratorComponent implements OnInit {

  patternForm: FormGroup;
  preview: PatternPreview | null = null;

  availableScales = [
    'Major',
    'Minor',
    'Harmonic Minor',
    'Phrygian',
    'Dorian',
    'Minor Pentatonic',
    'Locrian',
    'Chromatic'
  ];

  availableKeys = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
  ];

  constructor(
    private fb: FormBuilder,
    private midiService: MidiGeneratorService,
    private cdr: ChangeDetectorRef
  ) {
    this.patternForm = this.fb.group({
      name: ['Industrial Bassline', Validators.required],

      bpm: [
        120,
        [
          Validators.required,
          Validators.min(60),
          Validators.max(200)
        ]
      ],

      lengthInBars: [
        4,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(16)
        ]
      ],

      scale: ['Phrygian', Validators.required],
      key: ['C', Validators.required]
    });
  }

  ngOnInit(): void {

    if (this.patternForm.valid) {

      this.midiService.previewPattern(this.patternForm.value).subscribe({
        next: preview => {
          this.preview = preview;
          this.cdr.detectChanges();
        },

        error: err => {
          console.error('Preview error:', err);
        }
      });
    }

    this.patternForm.valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe(formValues => {

        if (this.patternForm.invalid) {
          return;
        }

        this.midiService.previewPattern(formValues).subscribe({

          next: preview => {
            this.preview = preview;
            this.cdr.detectChanges();
          },

          error: err => {
            console.error('Preview error:', err);
          }

        });

      });
  }

  onGenerate(): void {

    if (this.patternForm.valid) {

      const formValues = this.patternForm.value;

      this.midiService.generatePattern(formValues).subscribe({

        next: (blob: Blob) => {

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');

          a.href = url;

          const fileName =
            formValues.name.replace(/\s+/g, '_') + '.mid';

          a.download = fileName;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },

        error: (err: any) => {

          console.error('Connection error:', err);

          alert(
            'Oops! MIDI could not be generated. Is your Spring Boot server running?'
          );
        }
      });
    }
  }
}