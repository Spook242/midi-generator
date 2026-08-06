import { Note } from './note';

export interface PatternPreview {
  name: string;
  bpm: number;
  notes: Note[];
}