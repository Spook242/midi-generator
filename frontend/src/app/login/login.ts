import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  submitted = false;
  loading = false;
  serverError = '';

  readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    password: ['', [Validators.required]],
  });

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  onSubmit(): void {
    this.submitted = true;
    this.serverError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.email.value!.trim(),
      password: this.password.value!
    }).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.markForCheck();
        void this.router.navigate(['/generator']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.serverError = this.readErrorMessage(error);
        this.cdr.markForCheck();
      }
    });
  }

  private readErrorMessage(error: HttpErrorResponse): string {
    const body = this.parseErrorBody(error.error);
    const message = body?.message ?? body?.error;

    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }

    if (error.status === 401 || error.status === 403) {
      return 'Invalid credentials. Access to Pattern Visualizer denied.';
    }

    return 'Access to Pattern Visualizer denied. Please check your credentials and try again.';
  }

  private parseErrorBody(errorBody: unknown): { message?: string; error?: string } | null {
    if (typeof errorBody === 'string') {
      try {
        return JSON.parse(errorBody);
      } catch {
        return { message: errorBody };
      }
    }

    if (errorBody && typeof errorBody === 'object') {
      return errorBody as { message?: string; error?: string };
    }

    return null;
  }
}
