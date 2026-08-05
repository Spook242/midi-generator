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

  it('should contain 16 notes', () => {
    expect(component.notes.length).toBe(16);
  });

  it('should contain 16 steps', () => {
    expect(component.steps.length).toBe(16);
  });
});