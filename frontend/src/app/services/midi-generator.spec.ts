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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request with the correct payload and expect a blob response', () => {
    const mockPayload = {
      name: 'Generated Pattern',
      bpm: 120,
      key: 'C',
      scale: 'MAJOR',
      lengthInBars: 4
    };

    const dummyBlob = new Blob(['midi-binary-content'], { type: 'audio/midi' });

    service.generatePattern(mockPayload).subscribe(response => {
      expect(response).toEqual(dummyBlob);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/patterns');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);
    expect(req.request.responseType).toBe('blob');

    req.flush(dummyBlob);
  });
});
