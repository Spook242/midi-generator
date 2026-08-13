import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SequencerService } from './sequencer';
import * as Tone from 'tone';

vi.mock('tone', () => ({
  Transport: {
    bpm: {
      value: 120
    },
    start: vi.fn(),
    stop: vi.fn(),
    cancel: vi.fn()
  },

  PolySynth: class {
    toDestination = vi.fn().mockReturnThis();
    triggerAttackRelease = vi.fn();
  },

  Synth: class {},

  Part: class {
    start = vi.fn();
    dispose = vi.fn();
  }
}));

describe('SequencerService', () => {
  let service: SequencerService;

  beforeEach(() => {
    vi.clearAllMocks();

    service = new SequencerService();
  });

  it('should be created correctly', () => {
    expect(service).toBeTruthy();
  });

  it('should update the Transport BPM when playing', () => {
    const mockSequence = {
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

    service.playSequence(mockSequence as any);

    expect(Tone.Transport.bpm.value).toBe(140);
    expect(Tone.Transport.start).toHaveBeenCalled();
  });
});