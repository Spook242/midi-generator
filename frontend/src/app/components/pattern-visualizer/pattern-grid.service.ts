import { Injectable } from '@angular/core';
import { PatternPreview } from '../../models/pattern-preview';
import { PIANO_ROLL_NOTES, pitchToRow } from './pattern-mapping.util';

@Injectable()
export class PatternGridService {
  steps: number[] = Array.from({ length: 64 }, (_, i) => i + 1);

  grid: boolean[][] = this.createEmptyMatrix(this.steps.length, false);
  noteDurations: number[][] = this.createEmptyMatrix(this.steps.length, 0);
  manualNoteDurations: number[][] = this.createEmptyMatrix(this.steps.length, 0);

  private createEmptyMatrix<T>(columns: number, defaultValue: T): T[][] {
    return PIANO_ROLL_NOTES.map(() => Array(columns).fill(defaultValue));
  }

  toggleCell(row: number, column: number): void {
    const duration = this.getNoteDuration(row, column);

    if (duration > 0) {
      this.noteDurations[row][column] = 0;
      this.manualNoteDurations[row][column] = 0;

      for (let i = 0; i < duration && column + i < this.steps.length; i++) {
        this.grid[row][column + i] = false;
      }
      return;
    }

    if (this.getNoteDurationAt(row, column) > 0) {
      return;
    }

    this.noteDurations[row][column] = 1;
    this.manualNoteDurations[row][column] = 1;
    this.grid[row][column] = true;
  }

  getNoteDuration(row: number, column: number): number {
    return this.noteDurations[row]?.[column] ?? 0;
  }

  isNoteStart(row: number, column: number): boolean {
    return this.getNoteDuration(row, column) > 0;
  }

  updateNoteBounds(row: number, oldColumn: number, newColumn: number, newDuration: number): void {
    if (oldColumn === newColumn && this.getNoteDuration(row, oldColumn) === newDuration) {
      return;
    }

    const oldDuration = this.noteDurations[row][oldColumn];
    if (oldDuration > 0) {
      for (let i = 0; i < oldDuration && oldColumn + i < this.steps.length; i++) {
        this.grid[row][oldColumn + i] = false;
      }
      this.noteDurations[row][oldColumn] = 0;
      this.manualNoteDurations[row][oldColumn] = 0;
    }

      this.noteDurations[row][newColumn] = newDuration;
      this.manualNoteDurations[row][newColumn] = newDuration;

    for (let i = 0; i < newDuration && newColumn + i < this.steps.length; i++) {
      this.grid[row][newColumn + i] = true;
    }
  }

  getNoteDurationAt(row: number, column: number): number {
    const duration = this.getNoteDuration(row, column);

    if (duration > 0) {
      return duration;
    }

    for (let start = column - 1; start >= 0; start--) {
      const noteDuration = this.getNoteDuration(row, start);

      if (noteDuration > 0) {
        const distance = column - start;
        return distance < noteDuration ? noteDuration - distance : 0;
      }
    }

    return 0;
  }

  drawPreview(preview: PatternPreview | null): void {
    if (!preview || preview.notes.length === 0) {
      return;
    }

    const previousManualDurations = this.manualNoteDurations;
    const previewSteps = Math.max(
      0,
      ...preview.notes.map((note) => note.startPosition + note.duration)
    );
    
    const totalSteps = Math.max(64, previewSteps);

    this.steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    this.grid = this.createEmptyMatrix(this.steps.length, false);
    this.noteDurations = this.createEmptyMatrix(this.steps.length, 0);

    this.manualNoteDurations = PIANO_ROLL_NOTES.map((_, row) =>
      Array.from({ length: this.steps.length }, (_, column) =>
        previousManualDurations[row]?.[column] ?? 0
      )
    );

    for (const note of preview.notes) {
      const row = pitchToRow(note.pitch);
      const column = note.startPosition;

      if (
        row < 0 ||
        row >= this.grid.length ||
        column < 0 ||
        column >= this.steps.length
      ) {
        continue;
      }

      this.noteDurations[row][column] = note.duration;

      for (let i = 0; i < note.duration; i++) {
        const currentColumn = column + i;
        if (currentColumn >= 0 && currentColumn < this.steps.length) {
          this.grid[row][currentColumn] = true;
        }
      }
    }

    for (let row = 0; row < PIANO_ROLL_NOTES.length; row++) {
      for (let column = 0; column < this.steps.length; column++) {
        const duration = this.manualNoteDurations[row][column];

        if (duration <= 0) {
          continue;
        }

        this.noteDurations[row][column] = duration;

        for (let i = 0; i < duration; i++) {
          const currentColumn = column + i;
          if (currentColumn >= 0 && currentColumn < this.steps.length) {
            this.grid[row][currentColumn] = true;
          }
        }
      }
    }
  }
}