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
import { AVAILABLE_SCALES, AVAILABLE_KEYS } from '../shared/constants/music-theory.constants';
import { downloadMidiFile } from '../shared/utils/file-download.util';
import { LibraryComponent } from '../components/library/library';
import { AudioService } from '../services/audio';
import { SequencerService } from '../services/sequencer';
import { PlaybackSequence } from '../models/playback-sequence';


@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PatternVisualizerComponent,
    LibraryComponent
  ],
  templateUrl: './generator.html',
  styleUrls: ['./generator.css']
})
export class GeneratorComponent implements OnInit {

  patternForm: FormGroup;
  preview: PatternPreview | null = null;

  readonly availableScales = AVAILABLE_SCALES;
  readonly availableKeys = AVAILABLE_KEYS;

  readonly patternTypes = [
    'Industrial Bassline',
    'EBM Sequence',
    'Dark Techno Arp',
    'Atmospheric Pad'
  ];

  constructor(
    private fb: FormBuilder,
    private midiService: MidiGeneratorService,
    private cdr: ChangeDetectorRef,
    private audioService: AudioService,
    private sequencerServices: SequencerService
  ) {
    this.patternForm = this.fb.group({
      name: ['Industrial Bassline', Validators.required],
      bpm: [
        120,
        [Validators.required, Validators.min(60), Validators.max(200)]
      ],
      lengthInBars: [
        4,
        [Validators.required, Validators.min(1), Validators.max(16)]
      ],
      scale: ['Phrygian', Validators.required],
      key: ['C', Validators.required],
      pattern: ['Industrial Bassline', Validators.required]
    });
  }

  ngOnInit(): void {
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
          const fileName = formValues.name.replace(/\s+/g, '_') + '.mid';
          downloadMidiFile(blob, fileName);
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

  public async onPlaySequence(sequence: PlaybackSequence): Promise<void> {
    await this.audioService.initializeAudio();
    this.sequencerServices.playSequence(sequence);
  }

  public onStopSequence(): void {
    this.sequencerServices.stop();
  }
}