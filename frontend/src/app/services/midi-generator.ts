import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PatternPreview } from '../models/pattern-preview';

@Injectable({
  providedIn: 'root'
})
export class MidiGeneratorService {

  private apiUrl = 'http://localhost:8080/api/v1/patterns';

  constructor(private http: HttpClient) {}

  generatePattern(data: {
    name: string;
    bpm: number;
    key: string;
    scale: string;
    lengthInBars: number;
  }): Observable<Blob> {

    return this.http.post(this.apiUrl, data, {
      responseType: 'blob'
    });
  }

  previewPattern(data: {
    name: string;
    bpm: number;
    key: string;
    scale: string;
    lengthInBars: number;
  }): Observable<PatternPreview> {

    return this.http.post<PatternPreview>(
      `${this.apiUrl}/preview`,
      data
    );
  }
}