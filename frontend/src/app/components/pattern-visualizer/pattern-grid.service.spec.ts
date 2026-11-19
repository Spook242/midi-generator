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
      service.toggleCell(24, 0);
      service.updateNoteBounds(24, 0, 0, 4);
      
      expect(service.noteDurations[24][0]).toBe(4);
      expect(service.grid[24][0]).toBe(true);
      expect(service.grid[24][1]).toBe(true);
      expect(service.grid[24][2]).toBe(true);
      expect(service.grid[24][3]).toBe(true);
      expect(service.grid[24][4]).toBe(false);
    });

    describe('moveNote()', () => {
    it('should move the note to a completely new row and column', () => {
      service.toggleCell(24, 0); 
      service.updateNoteBounds(24, 0, 0, 2);
      service.moveNote(24, 0, 25, 4, 2);

    
      expect(service.noteDurations[24][0]).toBe(0);
      expect(service.grid[24][0]).toBe(false);
      expect(service.grid[24][1]).toBe(false);

      expect(service.noteDurations[25][4]).toBe(2);
      expect(service.grid[25][4]).toBe(true);
      expect(service.grid[25][5]).toBe(true);
    });

    it('should do nothing if the start and end coordinates are the same', () => {
      service.toggleCell(24, 0);
      service.moveNote(24, 0, 24, 0, 1);
      
      expect(service.noteDurations[24][0]).toBe(1);
      expect(service.grid[24][0]).toBe(true);
    });
  });

    it('should move the note to a new column and update duration (left drag)', () => {
      service.toggleCell(24, 2);
      service.updateNoteBounds(24, 2, 0, 4);

      expect(service.noteDurations[24][2]).toBe(0);
      expect(service.noteDurations[24][0]).toBe(4);
      
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

  describe('Collision prevention and boundary helpers', () => {
    it('should reject moveNote and preserve both notes when target range overlaps another note', () => {
      service.toggleCell(24, 0);
      service.updateNoteBounds(24, 0, 0, 2); // [0, 2)
      service.toggleCell(24, 4);
      service.updateNoteBounds(24, 4, 4, 2); // [4, 6)

      const moved = service.moveNote(24, 0, 24, 3, 2); // [3, 5) overlaps [4, 6)

      expect(moved).toBe(false);
      expect(service.noteDurations[24][0]).toBe(2);
      expect(service.noteDurations[24][4]).toBe(2);
      expect(service.grid[24][0]).toBe(true);
      expect(service.grid[24][1]).toBe(true);
      expect(service.grid[24][4]).toBe(true);
      expect(service.grid[24][5]).toBe(true);
    });

    it('should allow jumping over another note to an empty slot without erasing the middle note', () => {
      service.toggleCell(24, 0);
      service.updateNoteBounds(24, 0, 0, 2); // [0, 2)
      service.toggleCell(24, 4);
      service.updateNoteBounds(24, 4, 4, 2); // [4, 6)

      const blocked = service.moveNote(24, 0, 24, 3, 2);
      expect(blocked).toBe(false);

      const jumped = service.moveNote(24, 0, 24, 7, 2);
      expect(jumped).toBe(true);
      expect(service.noteDurations[24][0]).toBe(0);
      expect(service.noteDurations[24][4]).toBe(2);
      expect(service.noteDurations[24][7]).toBe(2);
    });

    it('should reject updateNoteBounds when resizing left or right overlaps an adjacent note', () => {
      service.toggleCell(24, 0);
      service.updateNoteBounds(24, 0, 0, 2); // [0, 2)
      service.toggleCell(24, 4);
      service.updateNoteBounds(24, 4, 4, 2); // [4, 6)

      expect(service.updateNoteBounds(24, 0, 0, 5)).toBe(false);
      expect(service.noteDurations[24][0]).toBe(2);
      expect(service.noteDurations[24][4]).toBe(2);

      expect(service.updateNoteBounds(24, 4, 1, 5)).toBe(false);
      expect(service.noteDurations[24][4]).toBe(2);
      expect(service.noteDurations[24][0]).toBe(2);
    });

    it('should calculate getMaxDurationFrom and getMinStartColumnBefore around adjacent notes', () => {
      service.toggleCell(24, 1);
      service.updateNoteBounds(24, 1, 1, 2); // [1, 3)
      service.toggleCell(24, 6);
      service.updateNoteBounds(24, 6, 6, 3); // [6, 9)

      expect(service.getMaxDurationFrom(24, 1, 1)).toBe(5); // up to col 6
      expect(service.getMinStartColumnBefore(24, 9, 6)).toBe(3); // after [1, 3)
    });
  });

  describe('Dynamic step count, overlap-safe manual reinjection, and clearGrid()', () => {
    it('should resize steps and clamp notes when setStepCount is called with 16 or 32', () => {
      service.toggleCell(24, 14);
      service.updateNoteBounds(24, 14, 14, 4); // [14, 18)
      service.toggleCell(24, 20); // outside 16 steps

      service.setStepCount(16);

      expect(service.steps.length).toBe(16);
      expect(service.noteDurations[24].length).toBe(16);
      expect(service.noteDurations[24][14]).toBe(2); // clamped to 16 - 14 = 2
      expect(service.grid[24][15]).toBe(true);

      service.setStepCount(32);
      expect(service.steps.length).toBe(32);
      expect(service.noteDurations[24][14]).toBe(2);
    });

    it('should respect configured step count in drawPreview and skip manual notes that overlap preview notes', () => {
      service.setStepCount(16);
      service.toggleCell(24, 0); // manual note at step 0
      service.toggleCell(24, 8); // manual note at step 8 (free)

      const preview: PatternPreview = {
        name: '1-bar',
        bpm: 120,
        notes: [
          { pitch: 60, velocity: 127, startPosition: 0, duration: 2 } // C4 (row 24) [0, 2)
        ]
      };

      service.drawPreview(preview);

      expect(service.steps.length).toBe(16);
      expect(service.noteDurations[24][0]).toBe(2); // preview note not overwritten by manual duration 1
      expect(service.noteDurations[24][8]).toBe(1); // non-overlapping manual note preserved
    });

    it('should clear all generated and manual notes in clearGrid()', () => {
      service.setStepCount(32);
      service.toggleCell(24, 4);
      service.clearGrid();

      expect(service.steps.length).toBe(32);
      expect(service.noteDurations[24][4]).toBe(0);
      expect(service.manualNoteDurations[24][4]).toBe(0);
      expect(service.grid[24][4]).toBe(false);
    });
  });
});