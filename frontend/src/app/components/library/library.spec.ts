import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library';
import { AudioService } from '../../services/audio';
import { SequencerService } from '../../services/sequencer';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { By } from '@angular/platform-browser';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let audioServiceMock: any;
  let sequencerServiceMock: any;

  beforeEach(async () => {
    audioServiceMock = {
      initializeAudio: vi.fn().mockResolvedValue(undefined)
    };

    sequencerServiceMock = {
      playSequence: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LibraryComponent],
      providers: [
        { provide: AudioService, useValue: audioServiceMock },
        { provide: SequencerService, useValue: sequencerServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create the component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should render the exact number of library items dynamically in the DOM', () => {
    const itemElements = fixture.debugElement.queryAll(By.css('.library-item'));
    expect(itemElements.length).toBe(3);
  });

  it('should display the correct name and metadata for the first item', () => {
    const firstItem = fixture.debugElement.queryAll(By.css('.library-item'))[0];
    const nameElement = firstItem.query(By.css('.item-name')).nativeElement;
    const metaElement = firstItem.query(By.css('.item-meta')).nativeElement;

    expect(nameElement.textContent.trim()).toBe('Industrial Bassline');
    expect(metaElement.textContent).toContain('BPM 120');
  });

  it('should apply the "active" class only to items where isActive is true', () => {
    const itemElements = fixture.debugElement.queryAll(By.css('.library-item'));
    expect(itemElements[0].classes['active']).toBe(true);
    expect(itemElements[1].classes['active']).toBeFalsy();
  });

  it('should call SequencerService to play the sequence when Play button is clicked', async () => {
    const firstItem = fixture.debugElement.queryAll(By.css('.library-item'))[0];
    const playButton = firstItem.query(By.css('.play-btn')).nativeElement;

    playButton.click();

    await fixture.whenStable();

    expect(audioServiceMock.initializeAudio).toHaveBeenCalled();
    expect(sequencerServiceMock.playSequence).toHaveBeenCalled();

    const sequencePassed = sequencerServiceMock.playSequence.mock.calls[0][0];
    expect(sequencePassed.bpm).toBe(120);
    expect(sequencePassed.notes.length).toBe(8);
  });
});