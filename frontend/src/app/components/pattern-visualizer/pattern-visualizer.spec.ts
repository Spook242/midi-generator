import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PatternVisualizerComponent } from './pattern-visualizer';
import { PatternGridService } from './pattern-grid.service';
import { PatternPreview } from '../../models/pattern-preview';

describe('PatternVisualizerComponent', () => {
  let component: PatternVisualizerComponent;
  let fixture: ComponentFixture<PatternVisualizerComponent>;
  let gridService: PatternGridService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatternVisualizerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PatternVisualizerComponent);
    component = fixture.componentInstance;
    gridService = fixture.debugElement.injector.get(PatternGridService);
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    it('should delegate drawPreview to gridService when preview input changes', () => {
      const drawPreviewSpy = vi.spyOn(gridService, 'drawPreview');
      
      const mockPreview = { notes: [] } as unknown as PatternPreview;
      component.preview = mockPreview;
      
      const changes: SimpleChanges = {
        preview: new SimpleChange(null, mockPreview, true)
      };
      
      component.ngOnChanges(changes);
      
      expect(drawPreviewSpy).toHaveBeenCalledWith(mockPreview);
    });
  });

  describe('Mouse Events (Resizing)', () => {
    it('should initiate resize when clicking on a valid note start', () => {
      vi.spyOn(gridService, 'getNoteDuration').mockReturnValue(2);
      
      const mockEvent = new MouseEvent('mousedown', { clientX: 100 });
      const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');
      
      component.startResize(mockEvent, 0, 0);
      
      expect(preventDefaultSpy).toHaveBeenCalled();

      expect(component['resizing']).toBe(true);
      expect(component['resizeRow']).toBe(0);
      expect(component['resizeColumn']).toBe(0);
    });

    it('should not initiate resize when clicking on an empty cell', () => {
      vi.spyOn(gridService, 'getNoteDuration').mockReturnValue(0);
      
      const mockEvent = new MouseEvent('mousedown');
      component.startResize(mockEvent, 0, 0);
      
      expect(component['resizing']).toBe(false);
    });

    it('should update note duration on mousemove if currently resizing', () => {
      vi.spyOn(gridService, 'getNoteDuration').mockReturnValue(2);
      const setNoteDurationSpy = vi.spyOn(gridService, 'setNoteDuration');
      
      const startEvent = new MouseEvent('mousedown', { clientX: 100 });
      component.startResize(startEvent, 0, 0);
      
      const moveEvent = new MouseEvent('mousemove', { clientX: 132 });
      component.onMouseMove(moveEvent);
      
      expect(setNoteDurationSpy).toHaveBeenCalledWith(0, 0, 3);
    });

    it('should stop resizing on mouseup', () => {
      component['resizing'] = true;
      
      component.onMouseUp();
      
      expect(component['resizing']).toBe(false);
      expect(component['resizeRow']).toBe(-1);
      expect(component['resizeColumn']).toBe(-1);
    });
  });
});