import { Note } from './note';

export interface PatternPreview {
  name: string;
  bpm: number;
  pattern?: string;
  notes: Note[];
}