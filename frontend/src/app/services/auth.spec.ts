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

  it('should send a POST request to login and store the JWT token', () => {
    localStorage.removeItem('token');
    const payload = {
      email: 'test@example.com',
      password: 'SecurePass1!'
    };
    const mockResponse = { token: 'mock-jwt-token' };

    let actualResponse: { token: string } | undefined;
    service.login(payload).subscribe((res) => {
      actualResponse = res;
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/login');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockResponse, { status: 200, statusText: 'OK' });

    expect(actualResponse).toEqual(mockResponse);
    expect(localStorage.getItem('token')).toBe('mock-jwt-token');
  });
});
