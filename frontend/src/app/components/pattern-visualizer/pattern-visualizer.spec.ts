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

  it('should initialize the grid with the correct dimensions', () => {
    expect(component.grid.length).toBe(component.notes.length);

    component.grid.forEach(row => {
      expect(row.length).toBe(component.steps.length);
    });
  });

  it('should initialize all cells as false', () => {
    component.grid.forEach(row => {
      row.forEach(cell => {
        expect(cell).toBe(false);
      });
    });
  });

  it('should toggle a cell from false to true', () => {
    expect(component.grid[0][0]).toBe(false);

    component.toggleCell(0, 0);

    expect(component.grid[0][0]).toBe(true);
  });

  it('should toggle a cell back to false', () => {
    component.toggleCell(0, 0);
    component.toggleCell(0, 0);

    expect(component.grid[0][0]).toBe(false);
  });
});