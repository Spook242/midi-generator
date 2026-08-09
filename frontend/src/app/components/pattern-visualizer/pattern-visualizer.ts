import {
  Component,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { PatternPreview } from '../../models/pattern-preview';
import { PatternGridService } from './pattern-grid.service';
import { PIANO_ROLL_NOTES } from './pattern-mapping.util';

@Component({
  selector: 'app-pattern-visualizer',
  standalone: true,
  templateUrl: './pattern-visualizer.html',
  styleUrls: ['./pattern-visualizer.css'],
  providers: [PatternGridService]
})
export class PatternVisualizerComponent implements OnChanges {
  @Input() preview: PatternPreview | null = null;

  readonly notes = PIANO_ROLL_NOTES;

  private resizing = false;
  private resizeRow = -1;
  private resizeColumn = -1;
  private resizeStartX = 0;
  private resizeInitialDuration = 1;
  private readonly CELL_WIDTH = 32;

  constructor(public gridService: PatternGridService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preview'] && this.preview) {
      this.gridService.drawPreview(this.preview);
    }
  }

  startResize(event: MouseEvent, row: number, column: number): void {
    event.preventDefault();
    event.stopPropagation();

    const duration = this.gridService.getNoteDuration(row, column);

    if (duration <= 0) {
      return;
    }

    this.resizing = true;
    this.resizeRow = row;
    this.resizeColumn = column;
    this.resizeStartX = event.clientX;
    this.resizeInitialDuration = duration;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.resizing) {
      return;
    }

    const deltaX = event.clientX - this.resizeStartX;
    const deltaSteps = Math.round(deltaX / this.CELL_WIDTH);
    let newDuration = this.resizeInitialDuration + deltaSteps;

    newDuration = Math.max(1, newDuration);
    const maxDuration = this.gridService.steps.length - this.resizeColumn;
    newDuration = Math.min(newDuration, maxDuration);

    this.gridService.setNoteDuration(
      this.resizeRow,
      this.resizeColumn,
      newDuration
    );
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.resizing = false;
    this.resizeRow = -1;
    this.resizeColumn = -1;
  }
}