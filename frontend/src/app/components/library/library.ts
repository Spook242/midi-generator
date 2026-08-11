import { Component } from '@angular/core';
import { LibraryItem } from '../../models/library-item';
import { AudioService } from '../../services/audio';
import { PlaybackSequence } from '../../models/playback-sequence';

@Component({
  selector: 'app-library',
  standalone: true,
  templateUrl: './library.html',
  styleUrls: ['./library.css']
})
export class LibraryComponent {
  items: LibraryItem[] = [
    { id: '1', name: 'Industrial Bassline', bpm: 120, duration: '00:30', isActive: true },
    { id: '2', name: 'Ambient Synth', bpm: 90, duration: '03:38', isActive: false },
    { id: '3', name: 'EBM sequence', bpm: 128, duration: '02:44', isActive: false }
  ];

  constructor(private audioService: AudioService) {}

  public async playItem(item: LibraryItem): Promise<void> {
    await this.audioService.initializeAudio();

    const mockSequence: PlaybackSequence = {
      bpm: item.bpm,
      notes: [
        { note: 'D2', time: '0:0:0', duration: '16n', velocity: 0.9 },
        { note: 'D2', time: '0:0:1', duration: '16n', velocity: 0.7 },
        { note: 'D2', time: '0:0:2', duration: '16n', velocity: 0.9 },
        { note: 'F2', time: '0:0:3', duration: '16n', velocity: 1.0 }, // Acento
        { note: 'D2', time: '0:1:0', duration: '16n', velocity: 0.9 },
        { note: 'D2', time: '0:1:1', duration: '16n', velocity: 0.7 },
        { note: 'C2', time: '0:1:2', duration: '16n', velocity: 0.8 },
        { note: 'D2', time: '0:1:3', duration: '16n', velocity: 0.9 }
      ]
    };

    this.audioService.playSequence(mockSequence);
  }
}