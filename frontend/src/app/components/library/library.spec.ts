import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library';
import { AudioService } from '../../services/audio';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { By } from '@angular/platform-browser';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let audioServiceMock: any;

  beforeEach(async () => {
    audioServiceMock = {
      initializeAudio: vi.fn().mockResolvedValue(undefined),
      playSequence: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LibraryComponent],
      providers: [
        { provide: AudioService, useValue: audioServiceMock }
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

  it('should call AudioService to play the sequence when Play button is clicked', async () => {
    const firstItem = fixture.debugElement.queryAll(By.css('.library-item'))[0];
    const playButton = firstItem.query(By.css('.play-btn')).nativeElement;

    playButton.click();

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(audioServiceMock.initializeAudio).toHaveBeenCalled();
    expect(audioServiceMock.playSequence).toHaveBeenCalled();

    const sequencePassed = audioServiceMock.playSequence.mock.calls[0][0];
    expect(sequencePassed.bpm).toBe(120);
    expect(sequencePassed.notes.length).toBe(8);
  });
});