import { Note } from './note';

export interface LibraryItem {
  id: string;
  name: string;
  bpm: number;
  duration: string;
  isActive: boolean;
  key?: string;
  scale?: string;
  lengthInBars?: number;
  pattern?: string;
  notes?: Note[];
}