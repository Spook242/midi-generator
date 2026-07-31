import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GeneratorComponent } from './generator';
import { MidiGeneratorService } from '../services/midi-generator';

describe('GeneratorComponent', () => {
  let component: GeneratorComponent;
  let fixture: ComponentFixture<GeneratorComponent>;
  let midiService: MidiGeneratorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratorComponent, ReactiveFormsModule],
      providers: [MidiGeneratorService]
    }).compileComponents();

    fixture = TestBed.createComponent(GeneratorComponent);
    component = fixture.componentInstance;
    midiService = TestBed.inject(MidiGeneratorService);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.patternForm;
    expect(form).toBeDefined();
    expect(form.value.name).toBe('Industrial Bassline');
    expect(form.value.bpm).toBe(120);
    expect(form.value.lengthInBars).toBe(4);
    expect(form.valid).toBe(true);
  });

  it('should invalidate the form if BPM is out of range', () => {
    const bpmControl = component.patternForm.controls['bpm'];

    bpmControl.setValue(10);
    expect(bpmControl.invalid).toBe(true);

    bpmControl.setValue(250);
    expect(bpmControl.invalid).toBe(true);

    expect(component.patternForm.invalid).toBe(true);
  });

  it('should not call MidiGeneratorService if form is invalid', () => {
    const spy = vi.spyOn(midiService, 'generatePattern');

    component.patternForm.controls['bpm'].setValue(10);
    component.onGenerate();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call MidiGeneratorService with form data when form is valid', () => {
    const dummyBlob = new Blob(['datos-midi-falsos'], { type: 'audio/midi' });
    const spy = vi.spyOn(midiService, 'generatePattern').mockReturnValue(of(dummyBlob));

    component.onGenerate();

    expect(spy).toHaveBeenCalledWith(component.patternForm.value);
  });
});
