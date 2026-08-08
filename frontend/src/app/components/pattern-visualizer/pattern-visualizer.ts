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

  steps: number[] = Array.from({ length: 64 }, (_, i) => i + 1);

  grid: boolean[][] = this.notes.map(() =>
  Array(this.steps.length).fill(false)
  );

  noteDurations: number[][] = this.notes.map(() =>
  Array(this.steps.length).fill(0)
  );

  toggleCell(row: number, column: number): void {
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

    this.grid = this.notes.map(() =>
      Array(this.steps.length).fill(false)
    );

    this.noteDurations = this.notes.map(() =>
      Array(this.steps.length).fill(0)
    );

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
  }

  private pitchToRow(pitch: number): number {

    const midiNotes = [
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