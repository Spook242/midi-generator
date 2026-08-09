import { describe, it, expect, beforeEach } from 'vitest';
import { PatternGridService } from './pattern-grid.service';
import { PatternPreview } from '../../models/pattern-preview';

describe('PatternGridService', () => {
  let service: PatternGridService;

  beforeEach(() => {
    service = new PatternGridService();
  });

  describe('Initial State', () => {
    it('should initialize with 64 steps by default', () => {
      expect(service.steps.length).toBe(64);
    });

    it('should initialize empty grids', () => {
      expect(service.grid[0][0]).toBe(false);
      expect(service.noteDurations[0][0]).toBe(0);
      expect(service.manualNoteDurations[0][0]).toBe(0);
    });
  });

  describe('toggleCell()', () => {
    it('should add a note with duration 1 when clicking an empty cell', () => {
      service.toggleCell(24, 0);
      
      expect(service.grid[24][0]).toBe(true);
      expect(service.noteDurations[24][0]).toBe(1);
      expect(service.manualNoteDurations[24][0]).toBe(1);
    });

    it('should remove a note when clicking an existing note start', () => {
      service.toggleCell(24, 0);
      service.toggleCell(24, 0);
      
      expect(service.grid[24][0]).toBe(false);
      expect(service.noteDurations[24][0]).toBe(0);
      expect(service.manualNoteDurations[24][0]).toBe(0);
    });
  });

  describe('updateNoteBounds()', () => {
    it('should update the duration without moving the start column (right drag)', () => {
      service.toggleCell(24, 0); // Fila 24, Columna 0
      service.updateNoteBounds(24, 0, 0, 4); // oldCol: 0, newCol: 0, duration: 4
      
      expect(service.noteDurations[24][0]).toBe(4);
      expect(service.grid[24][0]).toBe(true);
      expect(service.grid[24][1]).toBe(true);
      expect(service.grid[24][2]).toBe(true);
      expect(service.grid[24][3]).toBe(true);
      expect(service.grid[24][4]).toBe(false);
    });

    it('should move the note to a new column and update duration (left drag)', () => {
      service.toggleCell(24, 2); // Initial note at col 2
      service.updateNoteBounds(24, 2, 0, 4); // moved to col 0, duration 4

      expect(service.noteDurations[24][2]).toBe(0); // Old note start removed
      expect(service.noteDurations[24][0]).toBe(4); // New note start saved
      
      expect(service.grid[24][0]).toBe(true);
      expect(service.grid[24][1]).toBe(true);
      expect(service.grid[24][2]).toBe(true);
      expect(service.grid[24][3]).toBe(true);
    });
  });

  describe('drawPreview()', () => {
    it('should populate the grid based on the provided preview', () => {
      const preview: PatternPreview = {
        notes: [
          { pitch: 60, startPosition: 0, duration: 2, velocity: 100 }
        ]
        } as PatternPreview;

      service.drawPreview(preview);
      
      expect(service.noteDurations[24][0]).toBe(2);
      expect(service.grid[24][0]).toBe(true);
      expect(service.grid[24][1]).toBe(true);
    });

    it('should preserve manually added notes when a new preview is drawn', () => {
      service.toggleCell(24, 4);
      
      const preview = {
        notes: [
          { pitch: 60, startPosition: 0, duration: 1, velocity: 100 }
        ]
      } as PatternPreview;
      
      service.drawPreview(preview);
      
      expect(service.noteDurations[24][0]).toBe(1);
      expect(service.noteDurations[24][4]).toBe(1);
    });
  });
});