import { Injectable } from '@angular/core';
import * as Tone from 'tone';

@Injectable({
  providedIn: 'root'
})
export class AudioPreview {
  private synth?: Tone.Synth;

  async playNote(note: string): Promise<void> {
    console.log('Intentando reproducir:', note);

    await Tone.start();
    console.log('Estado de audio:', Tone.getContext().state);

    if (!this.synth) {
      this.synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.3,
          release: 0.2
        }
      }).toDestination();

      this.synth.volume.value = -3;
    }

    this.synth.triggerAttackRelease(note, '8n');
  }
}