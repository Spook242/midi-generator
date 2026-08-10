import {
  Component,
  HostListener,
  Input,
  Output,
  EventEmitter,
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
  @Input() bpm: number = 120;

  @Output() play = new EventEmitter<void>();
  @Output() stop = new EventEmitter<void>();
  @Output() bpmChange = new EventEmitter<number>();

  readonly notes = PIANO_ROLL_NOTES;

  private readonly CELL_WIDTH = 32;
  private readonly ROW_HEIGHT = 32; 

  private resizing = false;
  private resizeRow = -1;
  private resizeOriginalColumn = -1;
  private resizeCurrentColumn = -1;
  private resizeStartX = 0;
  private resizeInitialDuration = 1;
  private resizeEdge: 'left' | 'right' = 'right';

  private dragging = false;
  private dragHasMoved = false;
  private dragStartRow = -1;
  private dragCurrentRow = -1;
  private dragStartColumn = -1;
  private dragCurrentColumn = -1;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragDuration = 1;

  constructor(public gridService: PatternGridService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preview'] && this.preview) {
      this.gridService.drawPreview(this.preview);
    }
  }

  startResize(event: MouseEvent, row: number, column: number, edge: 'left' | 'right'): void {
    event.preventDefault();
    event.stopPropagation();

    const duration = this.gridService.getNoteDuration(row, column);
    if (duration <= 0) return;

    this.resizing = true;
    this.resizeRow = row;
    this.resizeOriginalColumn = column;
    this.resizeCurrentColumn = column;
    this.resizeStartX = event.clientX;
    this.resizeInitialDuration = duration;
    this.resizeEdge = edge;
  }

  startDrag(event: MouseEvent, row: number, column: number): void {
    event.preventDefault();

    const duration = this.gridService.getNoteDuration(row, column);
    if (duration <= 0) return;

    this.dragging = true;
    this.dragHasMoved = false;
    this.dragStartRow = row;
    this.dragCurrentRow = row;
    this.dragStartColumn = column;
    this.dragCurrentColumn = column;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.dragDuration = duration;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.resizing) {
      this.handleResizeMove(event);
      return;
    }

    if (this.dragging) {
      this.handleDragMove(event);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.resizing) {
      this.resizing = false;
    }

    if (this.dragging) {
      if (!this.dragHasMoved) {
        this.gridService.toggleCell(this.dragStartRow, this.dragStartColumn);
      }
      this.dragging = false;
    }
  }

  private handleResizeMove(event: MouseEvent): void {
    const deltaX = event.clientX - this.resizeStartX;
    const deltaSteps = Math.round(deltaX / this.CELL_WIDTH);

    if (this.resizeEdge === 'right') {
      let newDuration = this.resizeInitialDuration + deltaSteps;
      newDuration = Math.max(1, newDuration);
      const maxDuration = this.gridService.steps.length - this.resizeOriginalColumn;
      newDuration = Math.min(newDuration, maxDuration);

      this.gridService.updateNoteBounds(
        this.resizeRow, this.resizeCurrentColumn, this.resizeOriginalColumn, newDuration
      );
      this.resizeCurrentColumn = this.resizeOriginalColumn;

    } else {
      let newColumn = this.resizeOriginalColumn + deltaSteps;
      let newDuration = this.resizeInitialDuration - deltaSteps;

      if (newColumn < 0) {
        newColumn = 0;
        newDuration = this.resizeInitialDuration + this.resizeOriginalColumn;
      }

      if (newDuration < 1) {
        newDuration = 1;
        newColumn = this.resizeOriginalColumn + this.resizeInitialDuration - 1;
      }

      this.gridService.updateNoteBounds(
        this.resizeRow, this.resizeCurrentColumn, newColumn, newDuration
      );
      this.resizeCurrentColumn = newColumn;
    }
  }

  private handleDragMove(event: MouseEvent): void {
    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;

    if (!this.dragHasMoved && (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3)) {
      this.dragHasMoved = true;
    }

    if (!this.dragHasMoved) return;

    const deltaSteps = Math.round(deltaX / this.CELL_WIDTH);
    const deltaRows = Math.round(deltaY / this.ROW_HEIGHT);

    let newColumn = this.dragStartColumn + deltaSteps;
    let newRow = this.dragStartRow + deltaRows;

    newColumn = Math.max(0, newColumn);
    newColumn = Math.min(newColumn, this.gridService.steps.length - this.dragDuration);

    newRow = Math.max(0, newRow);
    newRow = Math.min(newRow, PIANO_ROLL_NOTES.length - 1);

    if (newRow !== this.dragCurrentRow || newColumn !== this.dragCurrentColumn) {
      this.gridService.moveNote(
        this.dragCurrentRow, this.dragCurrentColumn, newRow, newColumn, this.dragDuration
      );
      this.dragCurrentRow = newRow;
      this.dragCurrentColumn = newColumn;
    }
  }

  onPlayClick(): void {
    this.play.emit();
  }

  onStopClick(): void {
    this.stop.emit();
  }

  onTempoChange(delta: number): void {
    const newBpm = this.bpm + delta;
    if (newBpm >= 60 && newBpm <= 200) {
      this.bpmChange.emit(newBpm);
    }
  }
}