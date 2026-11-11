import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Signup } from './signup';
import { AuthService } from '../services/auth';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let authService: { register: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = {
      register: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debería llamar al servicio si el formulario es inválido', () => {
    component.onSubmit();

    expect(authService.register).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('debería registrar un usuario cuando el formulario es válido y mostrar el mensaje con enlace a /generator', () => {
    authService.register.mockReturnValue(of(undefined));

    component.form.setValue({
      email: 'test@example.com',
      password: 'SecurePass1!',
      confirmPassword: 'SecurePass1!'
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(authService.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'SecurePass1!'
    });
    expect(component.success).toBe(true);

    const compiled = fixture.nativeElement as HTMLElement;
    const successLink = compiled.querySelector('a.success-message');
    expect(successLink).toBeTruthy();
    expect(successLink?.textContent).toContain('Account created successfully');
    expect(successLink?.getAttribute('href')).toBe('/generator');
  });

  it('debería mostrar el error del servidor si el email ya existe', () => {
    authService.register.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 409,
      error: { message: 'The user with the email test@example.com is already registered.' }
    })));

    component.form.setValue({
      email: 'test@example.com',
      password: 'SecurePass1!',
      confirmPassword: 'SecurePass1!'
    });

    component.onSubmit();

    expect(component.success).toBe(false);
    expect(component.serverError).toContain('already registered');
  });
});
