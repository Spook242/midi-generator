import { Injectable } from '@angular/core';
import * as Tone from 'tone';
import { PlaybackSequence } from '../models/playback-sequence';

@Injectable({
  providedIn: 'root'
})
export class SequencerService {
  private synth: Tone.PolySynth | null = null;
  private currentPart: Tone.Part | null = null;

  constructor() {
  }

  private getSynth(): Tone.PolySynth {
    if (!this.synth) {
      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 1 }
      }).toDestination();
    }
    return this.synth;
  }

  public playSequence(sequence: PlaybackSequence): void {
    this.stop();

    Tone.Transport.bpm.value = sequence.bpm;

    const synthInstance = this.getSynth();

    this.currentPart = new Tone.Part((time, value) => {
      synthInstance.triggerAttackRelease(
        value.note,
        value.duration,
        time,
        value.velocity
      );
    }, sequence.notes);

    this.currentPart.start(0);
    Tone.Transport.start();
  }

  public stop(): void {
    Tone.Transport.stop();
    
    if (this.currentPart) {
      this.currentPart.dispose();
      this.currentPart = null;
    }
  }
}