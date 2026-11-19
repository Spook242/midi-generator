import { describe, it, expect } from 'vitest';
import { PIANO_ROLL_NOTES, gridToPlaybackSequence, pitchToRow, stepsToTransportTime } from './pattern-mapping.util';

describe('Pattern Mapping Utils', () => {
  describe('PIANO_ROLL_NOTES', () => {
    it('should contain exactly 49 notes', () => {
      expect(PIANO_ROLL_NOTES.length).toBe(49);
    });

    it('should start at C6 and end at C2', () => {
      expect(PIANO_ROLL_NOTES[0]).toBe('C6');
      expect(PIANO_ROLL_NOTES[PIANO_ROLL_NOTES.length - 1]).toBe('C2');
    });
  });

  describe('pitchToRow()', () => {
    it('should map the highest pitch (84 / C6) to row 0', () => {
      expect(pitchToRow(84)).toBe(0);
    });

    it('should map the center pitch (60 / C4) to row 24', () => {
      expect(pitchToRow(60)).toBe(24);
    });

    it('should map the lowest pitch (36 / C2) to row 48', () => {
      expect(pitchToRow(36)).toBe(48);
    });

    it('should return -1 if the pitch is above the upper limit', () => {
      expect(pitchToRow(85)).toBe(-1);
    });

    it('should return -1 if the pitch is below the lower limit', () => {
      expect(pitchToRow(35)).toBe(-1);
    });
  });

  describe('stepsToTransportTime()', () => {
    it('should format step counts in Tone.js Bars:Quarters:Sixteenths notation', () => {
      expect(stepsToTransportTime(1)).toBe('0:0:1');
      expect(stepsToTransportTime(2)).toBe('0:0:2');
      expect(stepsToTransportTime(8)).toBe('0:2:0');
      expect(stepsToTransportTime(64)).toBe('4:0:0');
    });
  });

  describe('gridToPlaybackSequence', () => {
  it('should translate a note at index 0 to time 0:0:0 with Tone.js duration format and totalSteps', () => {
    const mockDurations = [ [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ];
    const result = gridToPlaybackSequence(mockDurations, 120);

    expect(result.notes[0].time).toBe('0:0:0');
    expect(result.notes[0].note).toBe('C6');
    expect(result.notes[0].duration).toBe('0:0:1');
    expect(result.totalSteps).toBe(16);
  });

  it('should format multi-cell durations into Bars:Quarters:Sixteenths notation', () => {
    const mockDurations = [ [2, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ];
    const result = gridToPlaybackSequence(mockDurations, 120);

    expect(result.notes[0].duration).toBe('0:0:2');
    expect(result.notes[1].duration).toBe('0:2:0');
  });

  it('should correctly calculate the time string for the 6th cell (index 5)', () => {
    const mockDurations = [ [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ];
    const result = gridToPlaybackSequence(mockDurations, 120);

    expect(result.notes[0].time).toBe('0:1:1');
  });

  it('should return an empty note array if the matrix is empty', () => {
    const mockDurations = [ [0, 0, 0, 0] ];
    const result = gridToPlaybackSequence(mockDurations, 120);

    expect(result.notes.length).toBe(0);
    expect(result.totalSteps).toBe(4);
  });
});
});