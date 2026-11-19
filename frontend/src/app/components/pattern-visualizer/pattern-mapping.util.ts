import { PlaybackSequence } from '../../models/playback-sequence';

export const PIANO_ROLL_NOTES: string[] = [
  'C6', 'B5', 'A#5', 'A5', 'G#5', 'G5', 'F#5', 'F5', 'E5', 'D#5', 'D5', 'C#5', 'C5',
  'B4', 'A#4', 'A4', 'G#4', 'G4', 'F#4', 'F4', 'E4', 'D#4', 'D4', 'C#4', 'C4',
  'B3', 'A#3', 'A3', 'G#3', 'G3', 'F#3', 'F3', 'E3', 'D#3', 'D3', 'C#3', 'C3',
  'B2', 'A#2', 'A2', 'G#2', 'G2', 'F#2', 'F2', 'E2', 'D#2', 'D2', 'C#2', 'C2'
];

export function pitchToRow(pitch: number): number {
  const midiNotes = [
    84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72,
    71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60,
    59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48,
    47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36
  ];

  return midiNotes.indexOf(pitch);
}

/**
 * Converts a count or offset in 16th-note steps to Tone.js Transport Bars:Quarters:Sixteenths notation.
 */
export function stepsToTransportTime(steps: number): string {
  const bars = Math.floor(steps / 16);
  const quarters = Math.floor((steps % 16) / 4);
  const sixteenths = steps % 4;
  return `${bars}:${quarters}:${sixteenths}`;
}

export function gridToPlaybackSequence(
  noteDurations: number[][],
  bpm: number
): PlaybackSequence {
  const sequenceNotes = [];
  const totalSteps = noteDurations[0]?.length ?? 64;

  for (let row = 0; row < noteDurations.length; row++) {
    for (let col = 0; col < noteDurations[row].length; col++) {
      const durationInCells = noteDurations[row][col];

      if (durationInCells > 0) {
        const pitch = PIANO_ROLL_NOTES[row];
        const timeStr = stepsToTransportTime(col);
        const durationStr = stepsToTransportTime(durationInCells);

        sequenceNotes.push({
          note: pitch,
          time: timeStr,
          duration: durationStr,
          velocity: 0.8
        });
      }
    }
  }

  return {
    bpm,
    totalSteps,
    notes: sequenceNotes
  };
}