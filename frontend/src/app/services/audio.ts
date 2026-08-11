import { Injectable, NgZone } from '@angular/core';
import * as Tone from 'tone';
import { PlaybackSequence } from '../models/playback-sequence';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor(private ngZone: NgZone) {}

  private synth: Tone.PolySynth | null = null;

  private getSynth(): Tone.PolySynth {
  if (!this.synth) {
    this.synth =
      new Tone.PolySynth(Tone.Synth).toDestination();
  }

  return this.synth;
}

  public async initializeAudio(): Promise<void> {
    this.ngZone.runOutsideAngular(async () => {
      if (Tone.getContext().state !== 'running') {
        await Tone.start();
      }
    });
  }

  public playSequence(sequence: PlaybackSequence): void {
    this.ngZone.runOutsideAngular(() => {
      const synthInstance = this.getSynth();

      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.Transport.bpm.value = sequence.bpm;

      const currentPart = new Tone.Part((time, noteEvent: any) => {
        synthInstance.triggerAttackRelease(
          noteEvent.note,
          noteEvent.duration,
          time,
          noteEvent.velocity
        );
      }, sequence.notes);

      currentPart.start(0);
      Tone.Transport.start();
    });
  }

  public stop(): void {
    this.ngZone.runOutsideAngular(() => {
      Tone.Transport.stop();
    });
  }
}