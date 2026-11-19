import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import { BehaviorSubject } from 'rxjs';
import { SequencerService } from './sequencer';
import { AudioService } from './audio';

describe('SequencerService', () => {

  let service: SequencerService;
  let currentStepSubject: BehaviorSubject<number>;
  let isPlayingSubject: BehaviorSubject<boolean>;

  let audioService: {
    playSequence: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    setBpm: ReturnType<typeof vi.fn>;
    currentStep$: ReturnType<BehaviorSubject<number>['asObservable']>;
    isPlaying$: ReturnType<BehaviorSubject<boolean>['asObservable']>;
  };

  beforeEach(() => {
    currentStepSubject = new BehaviorSubject<number>(-1);
    isPlayingSubject = new BehaviorSubject<boolean>(false);

    audioService = {
      playSequence: vi.fn(),
      stop: vi.fn(),
      setBpm: vi.fn(),
      currentStep$: currentStepSubject.asObservable(),
      isPlaying$: isPlayingSubject.asObservable()
    };

    service = new SequencerService(
      audioService as unknown as AudioService
    );
  });

  it('should be created correctly', () => {

    expect(service).toBeTruthy();

  });

  it('should delegate sequence playback to AudioService', () => {

    const sequence = {
      bpm: 140,
      notes: [
        {
          note: 'C4',
          time: '0:0:0',
          duration: '4n',
          velocity: 1
        }
      ]
    };

    service.playSequence(sequence);

    expect(audioService.playSequence)
      .toHaveBeenCalledWith(sequence);

  });

  it('should delegate stop to AudioService', () => {

    service.stop();

    expect(audioService.stop)
      .toHaveBeenCalled();

  });

  it('should delegate setBpm to AudioService', () => {

    service.setBpm(130);

    expect(audioService.setBpm)
      .toHaveBeenCalledWith(130);

  });

  it('should expose currentStep$ and isPlaying$ from AudioService', () => {
    let latestStep = -99;
    let latestPlaying = false;

    service.currentStep$.subscribe((step) => (latestStep = step));
    service.isPlaying$.subscribe((playing) => (latestPlaying = playing));

    expect(latestStep).toBe(-1);
    expect(latestPlaying).toBe(false);

    isPlayingSubject.next(true);
    currentStepSubject.next(3);

    expect(latestStep).toBe(3);
    expect(latestPlaying).toBe(true);
  });

});