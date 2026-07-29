import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('debería crear la aplicación', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('debería mostrar el logo de MidiGen', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img.logo');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/midigen-logo.jpg');
  });

  it('debería renderizar los tres botones azules', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button.btn-blue');

    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent).toContain('Log in');
    expect(buttons[1].textContent).toContain('Sign up');
    expect(buttons[2].textContent).toContain('Free access');
  });
});
