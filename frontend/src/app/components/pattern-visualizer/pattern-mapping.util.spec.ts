import { describe, it, expect } from 'vitest';
import { PIANO_ROLL_NOTES, pitchToRow } from './pattern-mapping.util';

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
});