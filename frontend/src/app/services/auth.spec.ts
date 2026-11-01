import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to register a new user', () => {
    const payload = {
      email: 'test@example.com',
      password: 'SecurePass1!'
    };

    service.register(payload).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/register');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(null, { status: 201, statusText: 'Created' });
  });
});
