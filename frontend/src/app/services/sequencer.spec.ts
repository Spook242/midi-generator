import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import { SequencerService } from './sequencer';
import { AudioService } from './audio';

describe('SequencerService', () => {

  let service: SequencerService;

  let audioService: {
    playSequence: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {

    audioService = {
      playSequence: vi.fn(),
      stop: vi.fn()
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

});