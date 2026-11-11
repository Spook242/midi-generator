import { Injectable } from '@angular/core';
import { PlaybackSequence } from '../models/playback-sequence';
import { AudioService } from './audio';

@Injectable({
  providedIn: 'root'
})
export class SequencerService {

  constructor(
    private readonly audioService: AudioService
  ) {}

  public playSequence(sequence: PlaybackSequence): void {
    this.audioService.playSequence(sequence);
  }

  public setBpm(bpm: number): void {
    this.audioService.setBpm(bpm);
  }

  public stop(): void {
    this.audioService.stop();
  }
}