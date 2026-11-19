import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneratorComponent } from './generator';
import { ReactiveFormsModule } from '@angular/forms';
import { MidiGeneratorService } from '../services/midi-generator';
import { SequencerService } from '../services/sequencer';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { By } from '@angular/platform-browser';

describe('GeneratorComponent', () => {
  let component: GeneratorComponent;
  let fixture: ComponentFixture<GeneratorComponent>;
  let mockMidiService: any;

  beforeEach(async () => {
    mockMidiService = {
      generatePattern: vi.fn().mockReturnValue(of(new Blob())),
      previewPattern: vi.fn().mockReturnValue(
        of({
          name: 'Test',
          bpm: 120,
          notes: []
        })
      )
    };

    await TestBed.configureTestingModule({
      imports: [GeneratorComponent, ReactiveFormsModule],
      providers: [
        { provide: MidiGeneratorService, useValue: mockMidiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create the component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values (Phrygian scale, C key, and Industrial Bassline pattern) and load initial preview', () => {
    const form = component.patternForm;
    
    expect(form.get('scale')?.value).toBe('Phrygian');
    expect(form.get('key')?.value).toBe('C');
    expect(form.get('bpm')?.value).toBe(120);
    expect(form.get('pattern')?.value).toBe('Industrial Bassline');
    expect(form.valid).toBe(true);
    expect(mockMidiService.previewPattern).toHaveBeenCalledWith(
      expect.objectContaining({
        scale: 'Phrygian',
        key: 'C',
        bpm: 120,
        pattern: 'Industrial Bassline'
      })
    );
    expect(component.preview).toBeTruthy();
    expect(component.preview?.notes.length).toBeGreaterThan(0);
  });

  it('should request a new preview and update component.preview when pattern changes', async () => {
    const ebmPreview = {
      name: 'Industrial Bassline',
      bpm: 120,
      pattern: 'EBM Sequence',
      notes: [
        { pitch: 60, velocity: 127, startPosition: 0, duration: 1 },
        { pitch: 61, velocity: 85, startPosition: 2, duration: 1 }
      ]
    };
    mockMidiService.previewPattern.mockReturnValue(of(ebmPreview));
    mockMidiService.previewPattern.mockClear();

    component.patternForm.patchValue({ pattern: 'EBM Sequence' });
    await new Promise(resolve => setTimeout(resolve, 350));

    expect(mockMidiService.previewPattern).toHaveBeenCalledWith(
      expect.objectContaining({ pattern: 'EBM Sequence' })
    );
    expect(component.preview).toEqual(ebmPreview);
  });

  it('should fallback to local PatternGeneratorService when previewPattern fails', async () => {
    mockMidiService.previewPattern.mockReturnValue(throwError(() => new Error('Network error')));
    mockMidiService.previewPattern.mockClear();

    component.patternForm.patchValue({ pattern: 'Dark Techno Arp' });
    await new Promise(resolve => setTimeout(resolve, 350));

    expect(mockMidiService.previewPattern).toHaveBeenCalledWith(
      expect.objectContaining({ pattern: 'Dark Techno Arp' })
    );
    expect(component.preview?.notes.length).toBeGreaterThan(0);
    expect(component.preview?.notes[1].startPosition).toBe(3);
  });

  it('should render the exact number of scale options dynamically in the DOM', () => {
    const scaleSelect = fixture.debugElement.query(By.css('#scale'));
    const options = scaleSelect.queryAll(By.css('option'));

    expect(options.length).toBe(component.availableScales.length);
    expect(options[3].nativeElement.textContent.trim()).toBe('Phrygian');
    expect(options[3].nativeElement.value).toBe('Phrygian');
  });

  it('should render the exact number of key options dynamically in the DOM', () => {
    const keySelect = fixture.debugElement.query(By.css('#key'));
    const options = keySelect.queryAll(By.css('option'));

    expect(options.length).toBe(component.availableKeys.length);
    expect(options[1].nativeElement.textContent.trim()).toBe('C#');
    expect(options[1].nativeElement.value).toBe('C#');
  });

  it('should render pattern options including the placeholder option in the DOM', () => {
    const patternSelect = fixture.debugElement.query(By.css('#patternSelect'));
    const options = patternSelect.queryAll(By.css('option'));

    expect(options.length).toBe(component.patternTypes.length + 1);
    
    expect(options[0].nativeElement.textContent.trim()).toBe('Select a pattern');
    expect(options[0].nativeElement.value).toBe('');
    expect(options[1].nativeElement.textContent.trim()).toBe('Industrial Bassline');
    expect(options[1].nativeElement.value).toBe('Industrial Bassline');
  });

  it('should sync bpm form control and SequencerService when PatternVisualizer emits bpmChange', () => {
    const sequencerService = TestBed.inject(SequencerService);
    const setBpmSpy = vi.spyOn(sequencerService, 'setBpm').mockImplementation(() => {});

    const bpmButtons = fixture.debugElement.queryAll(By.css('app-pattern-visualizer .bpm-btn'));
    expect(bpmButtons.length).toBe(2);

    bpmButtons[1].nativeElement.click();
    fixture.detectChanges();

    expect(component.patternForm.get('bpm')?.value).toBe(121);
    expect(setBpmSpy).toHaveBeenCalledWith(121);

    bpmButtons[0].nativeElement.click();
    fixture.detectChanges();

    expect(component.patternForm.get('bpm')?.value).toBe(120);
    expect(setBpmSpy).toHaveBeenCalledWith(120);
  });
});