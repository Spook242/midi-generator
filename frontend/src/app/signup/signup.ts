import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  if (!password || !confirmPassword || password === confirmPassword) {
    return null;
  }

  return { passwordsMismatch: true };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  submitted = false;
  loading = false;
  success = false;
  serverError = '';

  readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: passwordsMatch });

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  get confirmPassword() {
    return this.form.controls.confirmPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.serverError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.register({
      email: this.email.value!.trim(),
      password: this.password.value!
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.cdr.markForCheck();
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

    if (error.status === 409) {
      return 'This email is already registered.';
    }

    return 'The account could not be created. Please try again.';
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
