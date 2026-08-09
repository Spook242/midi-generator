import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { PatternPreview } from '../../models/pattern-preview';

@Component({
  selector: 'app-pattern-visualizer',
  standalone: true,
  templateUrl: './pattern-visualizer.html',
  styleUrls: ['./pattern-visualizer.css']
})
export class PatternVisualizerComponent implements OnChanges {

  @Input() preview: PatternPreview | null = null;

  notes: string[] = [
    'C6',
    'B5',
    'A#5',
    'A5',
    'G#5',
    'G5',
    'F#5',
    'F5',
    'E5',
    'D#5',
    'D5',
    'C#5',
    'C5',
    'B4',
    'A#4',
    'A4',
    'G#4',
    'G4',
    'F#4',
    'F4',
    'E4',
    'D#4',
    'D4',
    'C#4',
    'C4',
    'B3',
    'A#3',
    'A3',
    'G#3',
    'G3',
    'F#3',
    'F3',
    'E3',
    'D#3',
    'D3',
    'C#3',
    'C3',
    'B2',
    'A#2',
    'A2',
    'G#2',
    'G2',
    'F#2',
    'F2',
    'E2',
    'D#2',
    'D2',
    'C#2',
    'C2'
  ];

  steps: number[] = Array.from(
    { length: 64 },
    (_, i) => i + 1
  );

  grid: boolean[][] = this.createEmptyGrid();

  noteDurations: number[][] = this.createEmptyDurations();

  private manualGrid: boolean[][] = this.createEmptyGrid();

  toggleCell(row: number, column: number): void {
    this.manualGrid[row][column] = !this.manualGrid[row][column];
    this.grid[row][column] = !this.grid[row][column];
  }

  getNoteDuration(row: number, column: number): number {
    return this.noteDurations[row]?.[column] ?? 0;
  }

  isNoteStart(row: number, column: number): boolean {
    return this.getNoteDuration(row, column) > 0;
  }

  private drawPreview(): void {
    if (!this.preview) {
      return;
    }

    const totalSteps = Math.max(
      ...this.preview.notes.map(
        note => note.startPosition + note.duration
      )
    );

    this.steps = Array.from(
      { length: totalSteps },
      (_, i) => i + 1
    );

    const previousManualGrid = this.manualGrid;

    this.manualGrid = this.createEmptyGrid();

    for (let row = 0; row < this.notes.length; row++) {
      for (
        let column = 0;
        column < Math.min(
          previousManualGrid[row]?.length ?? 0,
          this.steps.length
        );
        column++
      ) {
        this.manualGrid[row][column] =
          previousManualGrid[row][column];
      }
    }

    this.grid = this.createEmptyGrid();
    this.noteDurations = this.createEmptyDurations();

    for (const note of this.preview.notes) {

      const row = this.pitchToRow(note.pitch);
      const column = note.startPosition;

      if (
        row >= 0 &&
        row < this.grid.length &&
        column >= 0 &&
        column < this.steps.length
      ) {

        this.noteDurations[row][column] = note.duration;

        for (let i = 0; i < note.duration; i++) {

          const currentColumn = column + i;

          if (currentColumn < this.steps.length) {
            this.grid[row][currentColumn] = true;
          }
        }
      }
    }

    this.mergeManualNotes();
  }

  private mergeManualNotes(): void {
    for (let row = 0; row < this.notes.length; row++) {
      for (let column = 0; column < this.steps.length; column++) {

        if (this.manualGrid[row][column]) {
          this.grid[row][column] = true;
        }
      }
    }
  }

  private createEmptyGrid(): boolean[][] {
    return this.notes.map(() =>
      Array(this.steps.length).fill(false)
    );
  }

  private createEmptyDurations(): number[][] {
    return this.notes.map(() =>
      Array(this.steps.length).fill(0)
    );
  }

  private pitchToRow(pitch: number): number {

    const midiNotes = [
      84, // C6
      83, // B5
      82, // A#5
      81, // A5
      80, // G#5
      79, // G5
      78, // F#5
      77, // F5
      76, // E5
      75, // D#5
      74, // D5
      73, // C#5
      72, // C5
      71, // B4
      70, // A#4
      69, // A4
      68, // G#4
      67, // G4
      66, // F#4
      65, // F4
      64, // E4
      63, // D#4
      62, // D4
      61, // C#4
      60, // C4
      59, // B3
      58, // A#3
      57, // A3
      56, // G#3
      55, // G3
      54, // F#3
      53, // F3
      52, // E3
      51, // D#3
      50, // D3
      49, // C#3
      48, // C3
      47, // B2
      46, // A#2
      45, // A2
      44, // G#2
      43, // G2
      42, // F#2
      41, // F2
      40, // E2
      39, // D#2
      38, // D2
      37, // C#2
      36  // C2
    ];

    return midiNotes.indexOf(pitch);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preview'] && this.preview) {
      this.drawPreview();
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

        return distance < noteDuration
          ? noteDuration - distance
          : 0;
      }
    }

    return 0;
  }
}