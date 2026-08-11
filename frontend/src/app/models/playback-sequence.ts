export interface NoteEvent {
  note: string;
  time: string;
  duration: string;
  velocity: number;
}

export interface PlaybackSequence {
  bpm: number;
  notes: NoteEvent[];
}