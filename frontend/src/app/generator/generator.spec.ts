import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Generator } from './generator';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('Generator', () => {
  let component: Generator;
  let fixture: ComponentFixture<Generator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Generator, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Generator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener los valores por defecto correctos', () => {
    expect(component.bpm).toBe(120);
    expect(component.selectedKey).toBe('C');
    expect(component.selectedScale).toBe('MAJOR');
  });

  it('debería ejecutar generateMidi() al hacer clic en el botón', () => {
    let botonPulsado = false;
    component.generateMidi = () => {
      botonPulsado = true;
    };

    const button = fixture.debugElement.query(By.css('.generate-btn')).nativeElement;
    button.click();

    expect(botonPulsado).toBe(true);
  });
});
