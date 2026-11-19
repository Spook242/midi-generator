import { Injectable } from '@angular/core';
import { PatternPreview } from '../../models/pattern-preview';
import { PIANO_ROLL_NOTES, pitchToRow } from './pattern-mapping.util';

@Injectable()
export class PatternGridService {
  steps: number[] = Array.from({ length: 64 }, (_, i) => i + 1);
  private configuredSteps: number | null = null;

  grid: boolean[][] = this.createEmptyMatrix(this.steps.length, false);
  noteDurations: number[][] = this.createEmptyMatrix(this.steps.length, 0);
  manualNoteDurations: number[][] = this.createEmptyMatrix(this.steps.length, 0);

  private createEmptyMatrix<T>(columns: number, defaultValue: T): T[][] {
    return PIANO_ROLL_NOTES.map(() => Array(columns).fill(defaultValue));
  }

  /**
   * Resizes the piano-roll grid to the requested number of 16th-note steps while preserving valid notes.
   */
  setStepCount(totalSteps: number): void {
    const validSteps = Math.max(16, Math.floor(totalSteps));
    this.configuredSteps = validSteps;

    if (validSteps === this.steps.length) {
      return;
    }

    const previousDurations = this.noteDurations;
    const previousManualDurations = this.manualNoteDurations;

    this.steps = Array.from({ length: validSteps }, (_, i) => i + 1);
    this.grid = this.createEmptyMatrix(validSteps, false);
    this.noteDurations = this.createEmptyMatrix(validSteps, 0);
    this.manualNoteDurations = this.createEmptyMatrix(validSteps, 0);

    for (let row = 0; row < PIANO_ROLL_NOTES.length; row++) {
      for (let col = 0; col < validSteps; col++) {
        const duration = previousDurations[row]?.[col] ?? 0;
        if (duration > 0) {
          const clampedDuration = Math.min(duration, validSteps - col);
          this.noteDurations[row][col] = clampedDuration;
          this.fillGridCells(row, col, clampedDuration);
        }

        const manualDuration = previousManualDurations[row]?.[col] ?? 0;
        if (manualDuration > 0) {
          this.manualNoteDurations[row][col] = Math.min(manualDuration, validSteps - col);
        }
      }
    }
  }

  /**
   * Clears all generated and manually placed notes while keeping the current step count.
   */
  clearGrid(): void {
    this.grid = this.createEmptyMatrix(this.steps.length, false);
    this.noteDurations = this.createEmptyMatrix(this.steps.length, 0);
    this.manualNoteDurations = this.createEmptyMatrix(this.steps.length, 0);
  }

  private fillGridCells(row: number, column: number, duration: number): void {
    for (let i = 0; i < duration && column + i < this.steps.length; i++) {
      this.grid[row][column + i] = true;
    }
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

  /**
   * Checks whether placing a note at [startCol, startCol + duration) overlaps an existing note in the row.
   */
  hasNoteOverlap(
    row: number,
    startCol: number,
    duration: number,
    ignoreRow = -1,
    ignoreCol = -1
  ): boolean {
    const rowDurations = this.noteDurations[row];
    if (!rowDurations) {
      return false;
    }

    const targetEnd = startCol + duration;
    for (let col = 0; col < rowDurations.length; col++) {
      if (row === ignoreRow && col === ignoreCol) {
        continue;
      }

      const existingDuration = rowDurations[col];
      if (existingDuration <= 0) {
        continue;
      }

      if (col < targetEnd && startCol < col + existingDuration) {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns the maximum duration available from startCol before hitting the next note or grid end.
   */
  getMaxDurationFrom(row: number, startCol: number, ignoreCol = -1): number {
    const rowDurations = this.noteDurations[row];
    let maxEnd = this.steps.length;

    if (rowDurations) {
      for (let col = startCol + 1; col < rowDurations.length; col++) {
        if (col === ignoreCol) {
          continue;
        }
        if (rowDurations[col] > 0) {
          maxEnd = col;
          break;
        }
      }
    }

    return Math.max(1, maxEnd - startCol);
  }

  /**
   * Returns the earliest start column before endCol that does not collide with a preceding note.
   */
  getMinStartColumnBefore(row: number, endCol: number, ignoreCol = -1): number {
    const rowDurations = this.noteDurations[row];
    let minStart = 0;

    if (rowDurations) {
      for (let col = 0; col < endCol && col < rowDurations.length; col++) {
        if (col === ignoreCol) {
          continue;
        }
        const existingDuration = rowDurations[col];
        if (existingDuration > 0) {
          minStart = Math.max(minStart, col + existingDuration);
        }
      }
    }

    return Math.min(minStart, Math.max(0, endCol - 1));
  }

  private clearNote(row: number, column: number, duration: number): void {
    if (duration <= 0) {
      return;
    }
    for (let i = 0; i < duration && column + i < this.steps.length; i++) {
      this.grid[row][column + i] = false;
    }
    this.noteDurations[row][column] = 0;
    this.manualNoteDurations[row][column] = 0;
  }

  private setNote(row: number, column: number, duration: number): void {
    this.noteDurations[row][column] = duration;
    this.manualNoteDurations[row][column] = duration;
    for (let i = 0; i < duration && column + i < this.steps.length; i++) {
      this.grid[row][column + i] = true;
    }
  }

  updateNoteBounds(row: number, oldColumn: number, newColumn: number, newDuration: number): boolean {
    if (newColumn < 0 || newDuration < 1 || newColumn + newDuration > this.steps.length) {
      return false;
    }

    const oldDuration = this.noteDurations[row]?.[oldColumn] ?? 0;
    if (oldColumn === newColumn && oldDuration === newDuration) {
      return false;
    }

    if (this.hasNoteOverlap(row, newColumn, newDuration, row, oldColumn)) {
      return false;
    }

    this.clearNote(row, oldColumn, oldDuration);
    this.setNote(row, newColumn, newDuration);
    return true;
  }

  moveNote(oldRow: number, oldCol: number, newRow: number, newCol: number, duration: number): boolean {
    if (oldRow === newRow && oldCol === newCol) {
      return false;
    }

    if (
      newRow < 0 ||
      newRow >= this.grid.length ||
      newCol < 0 ||
      newCol + duration > this.steps.length
    ) {
      return false;
    }

    if (this.hasNoteOverlap(newRow, newCol, duration, oldRow, oldCol)) {
      return false;
    }

    const oldDuration = this.noteDurations[oldRow]?.[oldCol] ?? 0;
    this.clearNote(oldRow, oldCol, oldDuration);
    this.setNote(newRow, newCol, duration);
    return true;
  }

  drawPreview(preview: PatternPreview | null, targetSteps?: number): void {
    if (!preview || preview.notes.length === 0) {
      return;
    }

    const previousManualDurations = this.manualNoteDurations;
    const previewSteps = Math.max(
      0,
      ...preview.notes.map((note) => note.startPosition + note.duration)
    );

    const totalSteps =
      targetSteps && targetSteps > 0
        ? targetSteps
        : this.configuredSteps !== null
          ? Math.max(this.configuredSteps, previewSteps)
          : Math.max(64, previewSteps);

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

      const clampedDuration = Math.min(note.duration, this.steps.length - column);
      if (clampedDuration <= 0 || this.hasNoteOverlap(row, column, clampedDuration)) {
        continue;
      }

      this.noteDurations[row][column] = clampedDuration;
      this.fillGridCells(row, column, clampedDuration);
    }

    for (let row = 0; row < PIANO_ROLL_NOTES.length; row++) {
      for (let column = 0; column < this.steps.length; column++) {
        const duration = this.manualNoteDurations[row][column];

        if (duration <= 0) {
          continue;
        }

        const clampedDuration = Math.min(duration, this.steps.length - column);
        if (clampedDuration <= 0 || this.hasNoteOverlap(row, column, clampedDuration)) {
          continue;
        }

        this.noteDurations[row][column] = clampedDuration;
        this.fillGridCells(row, column, clampedDuration);
      }
    }
  }
}