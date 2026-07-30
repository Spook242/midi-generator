import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MidiGeneratorService {
  private apiUrl = 'http://localhost:8080/api/v1/patterns';

  constructor(private http: HttpClient) {}

  generatePattern(data: { bpm: number; key: string; scale: string }): Observable<Blob> {
    return this.http.post(this.apiUrl, data, {
      responseType: 'blob'
    });
  }
}
