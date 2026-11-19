export interface NoteEvent {
  note: string;
  time: string;
  duration: string;
  velocity: number;
}

export interface PlaybackSequence {
  bpm: number;
  totalSteps?: number;
  notes: NoteEvent[];
}