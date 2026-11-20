import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LibraryItem } from '../../models/library-item';
import { AudioService } from '../../services/audio';
import { SequencerService } from '../../services/sequencer';
import { PatternGeneratorService } from '../../services/pattern-generator.service';
import { notesToPlaybackSequence } from '../pattern-visualizer/pattern-mapping.util';

export const DEFAULT_LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: '1',
    name: 'Industrial Bassline',
    bpm: 120,
    duration: '00:08',
    isActive: true,
    key: 'C',
    scale: 'Phrygian',
    lengthInBars: 4,
    pattern: 'Industrial Bassline'
  },
  {
    id: '2',
    name: 'Ambient Synth',
    bpm: 90,
    duration: '00:11',
    isActive: false,
    key: 'D',
    scale: 'Dorian',
    lengthInBars: 4,
    pattern: 'Atmospheric Pad'
  },
  {
    id: '3',
    name: 'EBM sequence',
    bpm: 128,
    duration: '00:08',
    isActive: false,
    key: 'E',
    scale: 'Minor',
    lengthInBars: 4,
    pattern: 'EBM Sequence'
  }
];

@Component({
  selector: 'app-library',
  standalone: true,
  templateUrl: './library.html',
  styleUrls: ['./library.css']
})
export class LibraryComponent {
  @Input() items: LibraryItem[] = DEFAULT_LIBRARY_ITEMS.map(item => ({ ...item }));

  @Output() selectItem = new EventEmitter<LibraryItem>();
  @Output() editItem = new EventEmitter<LibraryItem>();
  @Output() exportItem = new EventEmitter<LibraryItem>();

  constructor(
    private audioService: AudioService,
    private sequencerService: SequencerService,
    private patternGeneratorService: PatternGeneratorService
  ) {}

  public onSelect(item: LibraryItem): void {
    this.selectItem.emit(item);
  }

  public onEdit(item: LibraryItem, event: MouseEvent): void {
    event.stopPropagation();
    this.editItem.emit(item);
  }

  public onExport(item: LibraryItem, event: MouseEvent): void {
    event.stopPropagation();
    this.exportItem.emit(item);
  }

  public async playItem(item: LibraryItem, event?: MouseEvent): Promise<void> {
    event?.stopPropagation();
    this.selectItem.emit(item);

    await this.audioService.initializeAudio();

    const lengthInBars = item.lengthInBars ?? 4;
    const notes = item.notes?.length
      ? item.notes
      : this.patternGeneratorService.generatePreview({
          name: item.name,
          bpm: item.bpm,
          key: item.key ?? 'C',
          scale: item.scale ?? 'Phrygian',
          lengthInBars,
          pattern: item.pattern ?? 'Industrial Bassline'
        }).notes;

    const sequence = notesToPlaybackSequence(notes, item.bpm, lengthInBars * 16);
    this.sequencerService.playSequence(sequence);
  }
}