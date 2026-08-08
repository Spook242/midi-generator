import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatternVisualizerComponent } from './pattern-visualizer';

describe('PatternVisualizerComponent', () => {

  let component: PatternVisualizerComponent;
  let fixture: ComponentFixture<PatternVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatternVisualizerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PatternVisualizerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the expected piano roll notes', () => {
    expect(component.notes).toEqual([
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
    ]);
  });

  it('should start with an empty grid', () => {
    expect(component.steps).toEqual([]);
    expect(component.grid).toEqual([]);
    expect(component.noteDurations).toEqual([]);
  });

  it('should toggle a grid cell', () => {
    component.steps = [1, 2, 3];

    component.grid = component.notes.map(() =>
      Array(component.steps.length).fill(false)
    );

    expect(component.grid[0][0]).toBe(false);

    component.toggleCell(0, 0);

    expect(component.grid[0][0]).toBe(true);

    component.toggleCell(0, 0);

    expect(component.grid[0][0]).toBe(false);
  });

  it('should return zero when a note duration does not exist', () => {
    expect(component.getNoteDuration(0, 0)).toBe(0);
  });

  it('should draw the preview correctly', () => {
    fixture.componentRef.setInput('preview', {
      name: 'Test Pattern',
      bpm: 120,
      notes: [
        {
          pitch: 60,
          velocity: 100,
          startPosition: 0,
          duration: 2
        },
        {
          pitch: 55,
          velocity: 100,
          startPosition: 2,
          duration: 3
        }
      ]
    });

    fixture.detectChanges();

    expect(component.steps).toEqual([1, 2, 3, 4, 5]);
    expect(component.grid[0][0]).toBe(true);
    expect(component.grid[0][1]).toBe(true);
    expect(component.grid[5][2]).toBe(true);
    expect(component.grid[5][3]).toBe(true);
    expect(component.grid[5][4]).toBe(true);
  });

it('should store note durations in the correct cells', () => {
    fixture.componentRef.setInput('preview', {
      name: 'Test Pattern',
      bpm: 120,
      notes: [
        {
          pitch: 60,
          velocity: 100,
          startPosition: 1,
          duration: 4
        }
      ]
    });

    fixture.detectChanges();

    expect(component.getNoteDuration(0, 1)).toBe(4);
  });

  it('should return the remaining duration of a sustained note', () => {
    fixture.componentRef.setInput('preview', {
      name: 'Test Pattern',
      bpm: 120,
      notes: [
        {
          pitch: 60,
          velocity: 100,
          startPosition: 0,
          duration: 4
        }
      ]
    });

    fixture.detectChanges();

    expect(component.getNoteDurationAt(0, 0)).toBe(4);
    expect(component.getNoteDurationAt(0, 1)).toBe(3);
    expect(component.getNoteDurationAt(0, 2)).toBe(2);
    expect(component.getNoteDurationAt(0, 3)).toBe(1);
    expect(component.getNoteDurationAt(0, 4)).toBe(0);
  });

  it('should ignore notes outside the piano roll range', () => {
    fixture.componentRef.setInput('preview', {
      name: 'Test Pattern',
      bpm: 120,
      notes: [
        {
          pitch: 72,
          velocity: 100,
          startPosition: 0,
          duration: 2
        }
      ]
    });

    fixture.detectChanges();

    expect(component.grid.length).toBe(component.notes.length);
  });

});