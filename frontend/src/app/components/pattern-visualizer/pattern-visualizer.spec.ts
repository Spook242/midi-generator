import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PatternVisualizerComponent } from './pattern-visualizer';
import { PatternGridService } from './pattern-grid.service';
import { PatternPreview } from '../../models/pattern-preview';
import { AudioPreview } from '../../services/audio-preview';
import { PIANO_ROLL_NOTES } from './pattern-mapping.util';

describe('PatternVisualizerComponent', () => {
  let component: PatternVisualizerComponent;
  let fixture: ComponentFixture<PatternVisualizerComponent>;
  let gridService: PatternGridService;
  let audioPreview: Pick<AudioPreview, 'playNote'>;

  beforeEach(async () => {
    audioPreview = {
  playNote: vi.fn().mockResolvedValue(undefined)
};
    await TestBed.configureTestingModule({
  imports: [PatternVisualizerComponent],
  providers: [
    {
      provide: AudioPreview,
      useValue: audioPreview
    }
  ]
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

  describe('Piano-roll note preview', () => {
  it('should create and preview a note when an empty cell is pressed', () => {
    vi.spyOn(gridService, 'getNoteDuration').mockReturnValue(0);
    const toggleCellSpy = vi.spyOn(gridService, 'toggleCell');

    const event = new MouseEvent('mousedown');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    component.onCellMouseDown(event, 0, 4);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(toggleCellSpy).toHaveBeenCalledWith(0, 4);
    expect(audioPreview.playNote)
      .toHaveBeenCalledWith(PIANO_ROLL_NOTES[0]);
  });

  describe('Mouse Events (Resizing)', () => {
    it('should initiate resize when clicking on a valid note start', () => {
      vi.spyOn(gridService, 'getNoteDuration').mockReturnValue(2);
      
      const mockEvent = new MouseEvent('mousedown', { clientX: 100 });
      const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');
      
      component.startResize(mockEvent, 0, 0, 'right');
      
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component['resizing']).toBe(true);
      expect(component['resizeRow']).toBe(0);
      expect(component['resizeOriginalColumn']).toBe(0);
    });

    describe('Mouse Events (Drag & Drop)', () => {

    it('should register drag start on mousedown over a note body', () => {
  vi.spyOn(gridService, 'getNoteDuration').mockReturnValue(2);

  const mockEvent = new MouseEvent('mousedown', {
    clientX: 100,
    clientY: 200
  });

  const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');

  component.startDrag(mockEvent, 10, 5);

  expect(preventDefaultSpy).toHaveBeenCalled();
  expect(component['dragging']).toBe(true);
  expect(component['dragStartRow']).toBe(10);
  expect(component['dragStartColumn']).toBe(5);
  expect(component['dragHasMoved']).toBe(false);
  expect(audioPreview.playNote).not.toHaveBeenCalled();
});

    describe('Header Controls (Play, Stop, BPM)', () => {
    it('should emit play event when onPlayClick is called', () => {
      const playSpy = vi.spyOn(component.play, 'emit');
      
      component.onPlayClick();
      
      expect(playSpy).toHaveBeenCalledOnce();
    });

    it('should emit stop event when onStopClick is called', () => {
      const stopSpy = vi.spyOn(component.stop, 'emit');
      
      component.onStopClick();
      
      expect(stopSpy).toHaveBeenCalledOnce();
    });

    it('should emit bpmChange with the new value if within valid range (60 - 200)', () => {
      const bpmSpy = vi.spyOn(component.bpmChange, 'emit');
      
      component.bpm = 120;
      component.onTempoChange(1);
      
      expect(bpmSpy).toHaveBeenCalledWith(121);
      
      component.onTempoChange(-10);
      expect(bpmSpy).toHaveBeenCalledWith(110);
    });

    it('should NOT emit bpmChange if the new tempo drops below 60', () => {
      const bpmSpy = vi.spyOn(component.bpmChange, 'emit');
      
      component.bpm = 60;
      component.onTempoChange(-1);
      
      expect(bpmSpy).not.toHaveBeenCalled();
    });

    it('should NOT emit bpmChange if the new tempo exceeds 200', () => {
      const bpmSpy = vi.spyOn(component.bpmChange, 'emit');
      
      component.bpm = 200;
      component.onTempoChange(1);
      
      expect(bpmSpy).not.toHaveBeenCalled();
    });
  });

    it('should move the note if dragged beyond the deadzone threshold', () => {
      vi.spyOn(gridService, 'getNoteDuration').mockReturnValue(2);
      const moveNoteSpy = vi.spyOn(gridService, 'moveNote');
      
      const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
      component.startDrag(startEvent, 10, 5);
      
      const moveEvent = new MouseEvent('mousemove', { clientX: 132, clientY: 132 });
      component.onMouseMove(moveEvent);
      
      expect(component['dragHasMoved']).toBe(true);
      expect(moveNoteSpy).toHaveBeenCalledWith(10, 5, 11, 6, 2);
    });

    it('should toggle (delete) the cell on mouseup if the mouse did not move', () => {
      vi.spyOn(gridService, 'getNoteDuration').mockReturnValue(2);
      const toggleCellSpy = vi.spyOn(gridService, 'toggleCell');
      
      const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
      component.startDrag(startEvent, 10, 5);
      
      component.onMouseUp();
      
      expect(component['dragHasMoved']).toBe(false);
      expect(toggleCellSpy).toHaveBeenCalledWith(10, 5);
      expect(component['dragging']).toBe(false);
    });

    it('should NOT toggle the cell on mouseup if a drag occurred', () => {
      vi.spyOn(gridService, 'getNoteDuration').mockReturnValue(2);
      const toggleCellSpy = vi.spyOn(gridService, 'toggleCell');
      
      const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
      component.startDrag(startEvent, 10, 5);
      
      const moveEvent = new MouseEvent('mousemove', { clientX: 132, clientY: 100 });
      component.onMouseMove(moveEvent);
      
      component.onMouseUp();
      
      expect(toggleCellSpy).not.toHaveBeenCalled();
      expect(component['dragging']).toBe(false);
    });
  });

    it('should not initiate resize when clicking on an empty cell', () => {
      vi.spyOn(gridService, 'getNoteDuration').mockReturnValue(0);
      
      const mockEvent = new MouseEvent('mousedown');
  
      component.startResize(mockEvent, 0, 0, 'right');
      
      expect(component['resizing']).toBe(false);
    });

    it('should update note bounds on mousemove if currently resizing from right edge', () => {
      vi.spyOn(gridService, 'getNoteDuration').mockReturnValue(2);
      const updateNoteBoundsSpy = vi.spyOn(gridService, 'updateNoteBounds');
      
      const startEvent = new MouseEvent('mousedown', { clientX: 100 });
      component.startResize(startEvent, 0, 0, 'right');
      
      const moveEvent = new MouseEvent('mousemove', { clientX: 132 });
      component.onMouseMove(moveEvent);
      
      expect(updateNoteBoundsSpy).toHaveBeenCalledWith(0, 0, 0, 3);
    });

    it('should stop resizing on mouseup', () => {
      component['resizing'] = true;
      
      component.onMouseUp();
      
      expect(component['resizing']).toBe(false);
      expect(component['resizeRow']).toBe(-1);
      expect(component['resizeOriginalColumn']).toBe(-1);
      expect(component['resizeCurrentColumn']).toBe(-1);
    });
  });
});
});