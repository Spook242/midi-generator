import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Login } from './login';
import { AuthService } from '../services/auth';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: { login: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = {
      login: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debería llamar al servicio si el formulario es inválido', () => {
    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('debería iniciar sesión y redirigir directamente a /generator (Pattern Visualizer) cuando las credenciales son válidas', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    authService.login.mockReturnValue(of({ token: 'mock-jwt-token' }));

    component.form.setValue({
      email: 'test@example.com',
      password: 'SecurePass1!'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'SecurePass1!'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/generator']);
    expect(component.serverError).toBe('');
  });

  it('debería mostrar un mensaje denegando el acceso a Pattern Visualizer si las credenciales son incorrectas', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    authService.login.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 401,
      error: { message: 'Invalid credentials. Access to Pattern Visualizer denied.' }
    })));

    component.form.setValue({
      email: 'test@example.com',
      password: 'WrongPassword1!'
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(component.serverError).toContain('Access to Pattern Visualizer denied');

    const compiled = fixture.nativeElement as HTMLElement;
    const errorElement = compiled.querySelector('.server-error');
    expect(errorElement?.textContent).toContain('Invalid credentials. Access to Pattern Visualizer denied.');
  });
});
