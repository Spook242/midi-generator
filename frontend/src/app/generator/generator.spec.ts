import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneratorComponent } from './generator';
import { ReactiveFormsModule } from '@angular/forms';
import { MidiGeneratorService } from '../services/midi-generator';
import { of } from 'rxjs';
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

  it('should initialize the form with default values (Phrygian scale and C key)', () => {
    const form = component.patternForm;
    
    expect(form.get('scale')?.value).toBe('Phrygian');
    expect(form.get('key')?.value).toBe('C');
    expect(form.get('bpm')?.value).toBe(120);
    expect(form.get('pattern')?.value).toBe('Industrial Bassline');
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

  it('should render the exact number of pattern options dynamically in the DOM', () => {
    const patternSelect = fixture.debugElement.query(By.css('#pattern'));
    const options = patternSelect.queryAll(By.css('option'));

    expect(options.length).toBe(component.patternTypes.length);
    expect(options[0].nativeElement.textContent.trim()).toBe('Industrial Bassline');
    expect(options[0].nativeElement.value).toBe('Industrial Bassline');
  });
});