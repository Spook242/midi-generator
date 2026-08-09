import {
  Component,
  HostListener,
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

  grid: boolean[][] = this.notes.map(() =>
    Array(this.steps.length).fill(false)
  );

  noteDurations: number[][] = this.notes.map(() =>
    Array(this.steps.length).fill(0)
  );

  /**
   * Duraciones de las notas creadas manualmente
   * por el usuario.
   *
   * Se mantienen separadas de las notas recibidas
   * desde el backend para no perderlas cuando cambia
   * la escala o la tónica.
   */
  private manualNoteDurations: number[][] = this.notes.map(() =>
    Array(this.steps.length).fill(0)
  );

  // -----------------------------
  // RESIZE STATE
  // -----------------------------

  private resizing = false;

  private resizeRow = -1;
  private resizeColumn = -1;

  private resizeStartX = 0;
  private resizeInitialDuration = 1;

  /**
   * Una celda ocupa:
   * 28px de ancho + 4px de margin-right
   */
  private readonly CELL_WIDTH = 32;

  // -----------------------------
  // GRID
  // -----------------------------

  toggleCell(row: number, column: number): void {

    const duration = this.getNoteDuration(row, column);

    // Si hay una nota que empieza en esta celda,
    // la eliminamos.
    if (duration > 0) {

      this.noteDurations[row][column] = 0;
      this.manualNoteDurations[row][column] = 0;

      for (
        let i = 0;
        i < duration && column + i < this.steps.length;
        i++
      ) {
        this.grid[row][column + i] = false;
      }

      return;
    }

    // Si la celda pertenece a una nota sostenida,
    // no permitimos crear otra nota encima.
    if (this.getNoteDurationAt(row, column) > 0) {
      return;
    }

    // Crear una nota manual de duración 1.
    this.noteDurations[row][column] = 1;
    this.manualNoteDurations[row][column] = 1;
    this.grid[row][column] = true;
  }

  /**
   * Devuelve la duración de una nota que comienza
   * exactamente en la posición indicada.
   */
  getNoteDuration(row: number, column: number): number {
    return this.noteDurations[row]?.[column] ?? 0;
  }

  isNoteStart(row: number, column: number): boolean {
    return this.getNoteDuration(row, column) > 0;
  }

  // -----------------------------
  // RESIZE
  // -----------------------------

  startResize(
    event: MouseEvent,
    row: number,
    column: number
  ): void {

    event.preventDefault();
    event.stopPropagation();

    const duration = this.getNoteDuration(row, column);

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

    const deltaX =
      event.clientX - this.resizeStartX;

    const deltaSteps =
      Math.round(deltaX / this.CELL_WIDTH);

    let newDuration =
      this.resizeInitialDuration + deltaSteps;

    // Mínimo: 1 paso
    newDuration = Math.max(1, newDuration);

    // No permitir salirnos del piano roll.
    const maxDuration =
      this.steps.length - this.resizeColumn;

    newDuration =
      Math.min(newDuration, maxDuration);

    this.setNoteDuration(
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

  private setNoteDuration(
    row: number,
    column: number,
    duration: number
  ): void {

    // Limpiar la duración anterior.
    const oldDuration =
      this.noteDurations[row][column];

    for (
      let i = 0;
      i < oldDuration &&
      column + i < this.steps.length;
      i++
    ) {
      this.grid[row][column + i] = false;
    }

    // Guardar nueva duración.
    this.noteDurations[row][column] = duration;

    // Como esta nota está siendo modificada
    // manualmente, también actualizamos su duración
    // persistente.
    this.manualNoteDurations[row][column] = duration;

    // Marcar las nuevas celdas.
    for (
      let i = 0;
      i < duration &&
      column + i < this.steps.length;
      i++
    ) {
      this.grid[row][column + i] = true;
    }
  }

  // -----------------------------
  // PREVIEW
  // -----------------------------

  private drawPreview(): void {

    if (!this.preview) {
      return;
    }

    if (this.preview.notes.length === 0) {
      return;
    }

    /*
     * Guardamos las notas manuales actuales antes
     * de reconstruir el grid.
     */
    const previousManualDurations =
      this.manualNoteDurations;

    const totalSteps = Math.max(
      ...this.preview.notes.map(
        note => note.startPosition + note.duration
      )
    );

    this.steps = Array.from(
      { length: totalSteps },
      (_, i) => i + 1
    );

    /*
     * Reconstruimos el grid.
     */
    this.grid = this.notes.map(() =>
      Array(this.steps.length).fill(false)
    );

    this.noteDurations = this.notes.map(() =>
      Array(this.steps.length).fill(0)
    );

    /*
     * Conservamos las notas manuales.
     *
     * Importante:
     * si el nuevo preview tiene más o menos steps,
     * adaptamos la matriz al nuevo tamaño.
     */
    this.manualNoteDurations = this.notes.map(
      (_, row) =>
        Array.from(
          { length: this.steps.length },
          (_, column) =>
            previousManualDurations[row]?.[column] ?? 0
        )
    );

    // -----------------------------
    // NOTAS DEL BACKEND
    // -----------------------------

    for (const note of this.preview.notes) {

      const row = this.pitchToRow(note.pitch);
      const column = note.startPosition;

      if (
        row < 0 ||
        row >= this.grid.length ||
        column < 0 ||
        column >= this.steps.length
      ) {
        continue;
      }

      this.noteDurations[row][column] =
        note.duration;

      for (
        let i = 0;
        i < note.duration;
        i++
      ) {

        const currentColumn =
          column + i;

        if (
          currentColumn >= 0 &&
          currentColumn < this.steps.length
        ) {
          this.grid[row][currentColumn] = true;
        }
      }
    }

    // -----------------------------
    // NOTAS MANUALES
    // -----------------------------

    for (
      let row = 0;
      row < this.notes.length;
      row++
    ) {

      for (
        let column = 0;
        column < this.steps.length;
        column++
      ) {

        const duration =
          this.manualNoteDurations[row][column];

        if (duration <= 0) {
          continue;
        }

        this.noteDurations[row][column] =
          duration;

        for (
          let i = 0;
          i < duration;
          i++
        ) {

          const currentColumn =
            column + i;

          if (
            currentColumn >= 0 &&
            currentColumn < this.steps.length
          ) {
            this.grid[row][currentColumn] = true;
          }
        }
      }
    }
  }

  // -----------------------------
  // MIDI PITCH → ROW
  // -----------------------------

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

  // -----------------------------
  // ANGULAR CHANGES
  // -----------------------------

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['preview'] &&
      this.preview
    ) {
      this.drawPreview();
    }
  }

  // -----------------------------
  // SUSTAINED NOTE
  // -----------------------------

  getNoteDurationAt(
    row: number,
    column: number
  ): number {

    const duration =
      this.getNoteDuration(row, column);

    if (duration > 0) {
      return duration;
    }

    for (
      let start = column - 1;
      start >= 0;
      start--
    ) {

      const noteDuration =
        this.getNoteDuration(row, start);

      if (noteDuration > 0) {

        const distance =
          column - start;

        return distance < noteDuration
          ? noteDuration - distance
          : 0;
      }
    }

    return 0;
  }
}