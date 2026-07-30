import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MidiGeneratorService } from './midi-generator';

describe('MidiGeneratorService', () => {
  let service: MidiGeneratorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MidiGeneratorService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(MidiGeneratorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería enviar una petición POST con los datos correctos y devolver un Blob', () => {
    const mockPayload = { bpm: 120, key: 'C', scale: 'MAJOR' };
    const mockBlob = new Blob(['midi-data-mock'], { type: 'audio/midi' });

    service.generatePattern(mockPayload).subscribe(response => {
      expect(response).toEqual(mockBlob);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/midi/generate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);

    req.flush(mockBlob);
  });
});
