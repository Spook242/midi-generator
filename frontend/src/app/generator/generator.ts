import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';

import { Subscription, debounceTime } from 'rxjs';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { MidiGeneratorService } from '../services/midi-generator';
import { PatternGeneratorService } from '../services/pattern-generator.service';
import { PatternVisualizerComponent } from '../components/pattern-visualizer/pattern-visualizer';
import { PatternPreview } from '../models/pattern-preview';
import { AVAILABLE_SCALES, AVAILABLE_KEYS } from '../shared/constants/music-theory.constants';
import { downloadMidiFile } from '../shared/utils/file-download.util';
import { LibraryComponent, DEFAULT_LIBRARY_ITEMS } from '../components/library/library';
import { AudioService } from '../services/audio';
import { SequencerService } from '../services/sequencer';
import { PlaybackSequence } from '../models/playback-sequence';
import { LibraryItem } from '../models/library-item';
import { Note } from '../models/note';



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
export class GeneratorComponent implements OnInit, OnDestroy {

  @ViewChild(PatternVisualizerComponent) visualizer?: PatternVisualizerComponent;

  patternForm: FormGroup;
  preview: PatternPreview | null = null;
  libraryItems: LibraryItem[] = DEFAULT_LIBRARY_ITEMS.map(item => ({ ...item }));
  currentStep = -1;
  isPlaying = false;

  private readonly subscriptions = new Subscription();

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
    private patternGeneratorService: PatternGeneratorService,
    private cdr: ChangeDetectorRef,
    private audioService: AudioService,
    private sequencerServices: SequencerService,
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
    this.loadPreview(this.patternForm.value);

    this.subscriptions.add(
      this.patternForm.valueChanges
        .pipe(
          debounceTime(300)
        )
        .subscribe(formValues => {
          this.loadPreview(formValues);
        })
    );

    this.subscriptions.add(
      this.sequencerServices.currentStep$.subscribe(step => {
        this.currentStep = step;
        this.cdr.detectChanges();
      })
    );

    this.subscriptions.add(
      this.sequencerServices.isPlaying$.subscribe(playing => {
        this.isPlaying = playing;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadPreview(formValues: any): void {
    if (this.patternForm.invalid) {
      return;
    }

    this.midiService.previewPattern(formValues).subscribe({
      next: preview => {
        const hasMatchingBackendPreview =
          preview &&
          preview.notes &&
          preview.notes.length > 0 &&
          preview.pattern === formValues.pattern;

        this.preview = hasMatchingBackendPreview
          ? preview
          : this.patternGeneratorService.generatePreview(formValues);
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Preview error:', err);
        this.preview = this.patternGeneratorService.generatePreview(formValues);
        this.cdr.detectChanges();
      }
    });
  }

  onGenerate(): void {
    if (this.patternForm.valid) {
      const formValues = this.patternForm.value;
      const notes = this.visualizer?.getCurrentNotes() ?? [];
      const payload = { ...formValues, notes };

      this.exportPatternFile(payload, () => {
        this.upsertLibraryItem(formValues, notes);
      });
    }
  }

  public onLoadLibraryItem(item: LibraryItem): void {
    this.libraryItems = this.libraryItems.map(existing => ({
      ...existing,
      isActive: existing.id === item.id
    }));

    const lengthInBars = item.lengthInBars ?? 4;
    this.patternForm.patchValue(
      {
        name: item.name,
        bpm: item.bpm,
        lengthInBars,
        scale: item.scale ?? 'Phrygian',
        key: item.key ?? 'C',
        pattern: item.pattern ?? 'Industrial Bassline'
      },
      { emitEvent: false }
    );

    this.visualizer?.gridService.clearGrid();
    this.visualizer?.gridService.setStepCount(lengthInBars * 16);

    if (item.notes && item.notes.length > 0) {
      this.preview = {
        name: item.name,
        bpm: item.bpm,
        pattern: item.pattern,
        notes: item.notes
      };
      this.cdr.detectChanges();
      return;
    }

    this.loadPreview(this.patternForm.value);
  }

  public onExportLibraryItem(item: LibraryItem): void {
    const lengthInBars = item.lengthInBars ?? 4;
    const key = item.key ?? 'C';
    const scale = item.scale ?? 'Phrygian';
    const pattern = item.pattern ?? 'Industrial Bassline';
    const notes = item.notes?.length
      ? item.notes
      : this.patternGeneratorService.generatePreview({
          name: item.name,
          bpm: item.bpm,
          key,
          scale,
          lengthInBars,
          pattern
        }).notes;

    this.exportPatternFile({
      name: item.name,
      bpm: item.bpm,
      key,
      scale,
      lengthInBars,
      pattern,
      notes
    });
  }

  private exportPatternFile(
    payload: {
      name: string;
      bpm: number;
      key: string;
      scale: string;
      lengthInBars: number;
      pattern?: string;
      notes?: Note[];
    },
    onSuccess?: () => void
  ): void {
    this.midiService.generatePattern(payload).subscribe({
      next: (blob: Blob) => {
        const fileName = payload.name.replace(/\s+/g, '_') + '.mid';
        downloadMidiFile(blob, fileName);
        onSuccess?.();
      },
      error: (err: any) => {
        console.error('Connection error:', err);
        alert(
          'Oops! MIDI could not be generated. Is your Spring Boot server running?'
        );
      }
    });
  }

  private upsertLibraryItem(formValues: any, notes: Note[]): void {
    const duration = this.formatDuration(formValues.bpm, formValues.lengthInBars);
    const normalizedName = String(formValues.name).trim().toLowerCase();
    const existingIndex = this.libraryItems.findIndex(
      item => item.name.trim().toLowerCase() === normalizedName
    );

    const updatedData = {
      name: formValues.name,
      bpm: formValues.bpm,
      duration,
      isActive: true,
      key: formValues.key,
      scale: formValues.scale,
      lengthInBars: formValues.lengthInBars,
      pattern: formValues.pattern,
      notes: notes.map(note => ({ ...note }))
    };

    if (existingIndex >= 0) {
      this.libraryItems = this.libraryItems.map((item, idx) =>
        idx === existingIndex
          ? { ...item, ...updatedData }
          : { ...item, isActive: false }
      );
    } else {
      const newItem: LibraryItem = {
        id: String(Date.now()),
        ...updatedData
      };
      this.libraryItems = [
        ...this.libraryItems.map(item => ({ ...item, isActive: false })),
        newItem
      ];
    }

    this.cdr.detectChanges();
  }

  private formatDuration(bpm: number, lengthInBars: number): string {
    const safeBpm = Math.max(1, Number(bpm) || 120);
    const safeBars = Math.max(1, Number(lengthInBars) || 4);
    const totalSeconds = Math.round((safeBars * 4 * 60) / safeBpm);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  public async onPlaySequence(sequence: PlaybackSequence): Promise<void> {
    await this.audioService.initializeAudio();
    this.sequencerServices.playSequence(sequence);
  }

  public onStopSequence(): void {
    this.sequencerServices.stop();
  }

  public onBpmChange(newBpm: number): void {
    this.patternForm.get('bpm')?.setValue(newBpm);
    this.sequencerServices.setBpm(newBpm);
  }
}