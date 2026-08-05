import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pattern-visualizer',
  standalone: true,
  templateUrl: './pattern-visualizer.html',
  styleUrls: ['./pattern-visualizer.css']
})
export class PatternVisualizerComponent implements OnInit {

  notes: string[] = [
    'C4',
    'B3',
    'A3',
    'G3',
    'F3',
    'E3',
    'D3',
    'C3',
    'B2',
    'A2',
    'G2',
    'F2',
    'E2',
    'D2',
    'C2',
    'B1'
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

}