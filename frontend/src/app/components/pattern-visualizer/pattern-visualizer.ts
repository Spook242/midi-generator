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

  steps: number[] = [];

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

  console.log('Preview inside visualizer:', this.preview);

  this.clearGrid();

  const totalSteps =
  Math.max(...this.preview!.notes.map(note => note.startPosition + note.duration));

this.steps = Array.from(
  { length: totalSteps },
  (_, i) => i + 1
);

this.grid = this.notes.map(() =>
  Array(this.steps.length).fill(false)
);

console.log(this.preview?.notes[0]);

  for (const note of this.preview!.notes) {

    const row = this.pitchToRow(note.pitch);
    const column = note.startPosition;

console.log(
    'pitch:', note.pitch,
    'row:', row,
    'column:', column,
    'duration:', note.duration
  );


    if (
      row >= 0 &&
      row < this.grid.length &&
      column >= 0 &&
      column < this.steps.length
    ) {
      for (let i = 0; i < note.duration; i++) {

  const currentColumn = column + i;

  if (currentColumn < this.steps.length) {
    this.grid[row][currentColumn] = true;
  }

}
    }
  }
}

private clearGrid(): void {
  this.grid = this.notes.map(() =>
    Array(this.steps.length).fill(false)
  );
}

private pitchToRow(pitch: number): number {

  const midiNotes = [
    72, // C5
    71,
    70,
    69,
    68,
    67,
    66,
    65,
    64,
    63,
    62,
    61,
    60,
    59,
    58,
    57,
    56,
    55,
    54,
    53,
    52,
    51,
    50,
    49,
    48
  ];

  return midiNotes.indexOf(pitch);
}

  ngOnChanges(changes: SimpleChanges): void {

  if (!this.preview) {
    return;
  }

  this.drawPreview();

}
}