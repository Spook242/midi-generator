import { Injectable, NgZone } from '@angular/core';
import * as Tone from 'tone';
import { PlaybackSequence } from '../models/playback-sequence';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private synth: Tone.PolySynth | null = null;
  private currentPart: Tone.Part | null = null;

  constructor(private readonly ngZone: NgZone) {}

  private getSynth(): Tone.PolySynth {
    if (!this.synth) {
      this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    }

    return this.synth;
  }

  public async initializeAudio(): Promise<void> {
    await this.ngZone.runOutsideAngular(async () => {
      if (Tone.getContext().state !== 'running') {
        await Tone.start();
      }
    });
  }

  public playSequence(sequence: PlaybackSequence): void {
    this.ngZone.runOutsideAngular(() => {
      this.stop();

      const synth = this.getSynth();

      Tone.Transport.bpm.value = sequence.bpm;

      this.currentPart = new Tone.Part(
        (time, noteEvent) => {
          synth.triggerAttackRelease(
            noteEvent.note,
            noteEvent.duration,
            time,
            noteEvent.velocity
          );
        },
        sequence.notes
      );

      this.currentPart.start(0);

      Tone.Transport.start();
    });
  }

  public stop(): void {
    this.ngZone.runOutsideAngular(() => {
      Tone.Transport.stop();
      Tone.Transport.cancel();

      if (this.currentPart) {
        this.currentPart.dispose();
        this.currentPart = null;
      }
    });
  }
}