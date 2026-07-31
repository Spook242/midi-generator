import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Generator } from './generator';

describe('GeneratorComponent - Layout Base', () => {
  let component: Generator;
  let fixture: ComponentFixture<Generator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Generator]
    }).compileComponents();

    fixture = TestBed.createComponent(Generator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header with the MG logo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logoArea = compiled.querySelector('.logo-area h1');

    expect(logoArea).toBeTruthy();
    expect(logoArea?.textContent).toContain('MG MIDI Generator');
  });

  it('should have the 3 main layout panels', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const leftPanel = compiled.querySelector('.left-panel');
    const centerPanel = compiled.querySelector('.center-panel');
    const rightPanel = compiled.querySelector('.right-panel');

    expect(leftPanel).toBeTruthy();
    expect(centerPanel).toBeTruthy();
    expect(rightPanel).toBeTruthy();
  });

  it('should display the correct titles in each panel', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const leftTitle = compiled.querySelector('.left-panel h2')?.textContent;
    const centerTitle = compiled.querySelector('.center-panel h2')?.textContent;
    const rightTitle = compiled.querySelector('.right-panel h2')?.textContent;

    expect(leftTitle).toContain('CREATE NEW PATTERN');
    expect(centerTitle).toContain('PATTERN VISUALIZER');
    expect(rightTitle).toContain('MY LIBRARY');
  });
});
