import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library';
import { describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryComponent]
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
    
    expect(itemElements.length).toBe(component.items.length);
    expect(itemElements.length).toBe(3);
  });

  it('should display the correct name and metadata for the first item', () => {
    const firstItem = fixture.debugElement.queryAll(By.css('.library-item'))[0];
    const nameElement = firstItem.query(By.css('.item-name')).nativeElement;
    const metaElement = firstItem.query(By.css('.item-meta')).nativeElement;

    expect(nameElement.textContent.trim()).toBe('Industrial Bassline');

    expect(metaElement.textContent).toContain('BPM 120');
    expect(metaElement.textContent).toContain('00:30');
  });

  it('should apply the "active" class only to items where isActive is true', () => {
    const itemElements = fixture.debugElement.queryAll(By.css('.library-item'));

    expect(itemElements[0].classes['active']).toBe(true);
    
    expect(itemElements[1].classes['active']).toBeFalsy();
    expect(itemElements[2].classes['active']).toBeFalsy();
  });
});