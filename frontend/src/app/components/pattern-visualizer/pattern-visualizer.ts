import {
  Component,
  Input,
  OnInit,
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
export class PatternVisualizerComponent implements OnInit, OnChanges {
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

  steps: number[] = Array.from({ length: 16 }, (_, i) => i + 1);

  grid: boolean[][] = [];

  ngOnInit(): void {
    
    this.grid = this.notes.map(() =>
      Array(this.steps.length).fill(false)
    );
  }

  toggleCell(row: number, column: number): void {
    this.grid[row][column] = !this.grid[row][column];
  }

  private drawPreview(): void {

  this.clearGrid();

  for (const note of this.preview!.notes) {

    const row = this.pitchToRow(note.pitch);
    const column = note.startPosition;

    if (
      row >= 0 &&
      row < this.grid.length &&
      column >= 0 &&
      column < this.steps.length
    ) {
      this.grid[row][column] = true;
    }
  }
}

private clearGrid(): void {
  this.grid = this.notes.map(() =>
    Array(this.steps.length).fill(false)
  );
}

private pitchToRow(pitch: number): number {

  const highestPitch = 60;

  return highestPitch - pitch;

}

  ngOnChanges(changes: SimpleChanges): void {

  if (!this.preview) {
    return;
  }

  this.drawPreview();

}
}