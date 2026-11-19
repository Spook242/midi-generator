import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as Tone from 'tone';
import { PlaybackSequence } from '../models/playback-sequence';
import { stepsToTransportTime } from '../components/pattern-visualizer/pattern-mapping.util';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private synth: Tone.PolySynth | null = null;
  private currentPart: Tone.Part | null = null;
  private repeatEventId: number | null = null;

  private readonly currentStepSubject = new BehaviorSubject<number>(-1);
  private readonly isPlayingSubject = new BehaviorSubject<boolean>(false);

  public readonly currentStep$: Observable<number> = this.currentStepSubject.asObservable();
  public readonly isPlaying$: Observable<boolean> = this.isPlayingSubject.asObservable();

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
      const totalSteps =
        sequence.totalSteps && sequence.totalSteps > 0 ? sequence.totalSteps : 64;

      Tone.Transport.bpm.value = sequence.bpm;
      Tone.Transport.position = 0;
      Tone.Transport.loop = true;
      Tone.Transport.loopStart = 0;
      Tone.Transport.loopEnd = stepsToTransportTime(totalSteps);

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

      let stepCounter = 0;
      this.ngZone.run(() => {
        this.isPlayingSubject.next(true);
        this.currentStepSubject.next(0);
      });

      this.repeatEventId = Tone.Transport.scheduleRepeat(() => {
        const stepIndex = stepCounter % totalSteps;
        stepCounter++;
        this.ngZone.run(() => {
          this.currentStepSubject.next(stepIndex);
        });
      }, '16n');

      Tone.Transport.start();
    });
  }

  public setBpm(bpm: number): void {
    this.ngZone.runOutsideAngular(() => {
      Tone.Transport.bpm.value = bpm;
    });
  }

  public stop(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.repeatEventId !== null) {
        Tone.Transport.clear(this.repeatEventId);
        this.repeatEventId = null;
      }

      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.Transport.loop = false;
      Tone.Transport.position = 0;

      if (this.currentPart) {
        this.currentPart.dispose();
        this.currentPart = null;
      }

      this.ngZone.run(() => {
        this.isPlayingSubject.next(false);
        this.currentStepSubject.next(-1);
      });
    });
  }
}