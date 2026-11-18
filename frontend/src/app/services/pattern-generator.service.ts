import { Injectable } from '@angular/core';
import { PatternType } from '../models/pattern-types';
import { PatternPreview } from '../models/pattern-preview';
import { Note } from '../models/note';

interface PatternStyleConfig {
  duration: number;
  chordOffsets: number[];
  degreeSelector: (noteIndex: number) => number;
  velocitySelector: (noteIndex: number) => number;
}

const KEY_BASE_MIDI: Record<string, number> = {
  'C': 60,
  'C#': 61,
  'Db': 61,
  'D': 62,
  'D#': 63,
  'Eb': 63,
  'E': 64,
  'F': 65,
  'F#': 66,
  'Gb': 66,
  'G': 67,
  'G#': 68,
  'Ab': 68,
  'A': 69,
  'A#': 70,
  'Bb': 70,
  'B': 71
};

const SCALE_INTERVALS: Record<string, number[]> = {
  'Major': [0, 2, 4, 5, 7, 9, 11],
  'Minor': [0, 2, 3, 5, 7, 8, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  'Phrygian': [0, 1, 3, 5, 7, 8, 10],
  'Dorian': [0, 2, 3, 5, 7, 9, 10],
  'Minor Pentatonic': [0, 3, 5, 7, 10],
  'Locrian': [0, 1, 3, 5, 6, 8, 10],
  'Chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

const PATTERN_STYLE_CONFIGS: Record<PatternType, PatternStyleConfig> = {
  'Industrial Bassline': {
    duration: 2,
    chordOffsets: [0],
    degreeSelector: (noteIndex) => noteIndex % 4,
    velocitySelector: (noteIndex) => (noteIndex % 2 === 0 ? 127 : 85)
  },
  'EBM Sequence': {
    duration: 1,
    chordOffsets: [0],
    degreeSelector: (noteIndex) => noteIndex,
    velocitySelector: (noteIndex) => (noteIndex % 2 === 0 ? 127 : 85)
  },
  'Dark Techno Arp': {
    duration: 2,
    chordOffsets: [0],
    degreeSelector: (noteIndex) => noteIndex * 2,
    velocitySelector: (noteIndex) => (noteIndex % 2 === 0 ? 120 : 90)
  },
  'Atmospheric Pad': {
    duration: 8,
    chordOffsets: [0, 2, 4],
    degreeSelector: (noteIndex) => noteIndex,
    velocitySelector: () => 95
  }
};

@Injectable({
  providedIn: 'root'
})
export class PatternGeneratorService {

  /**
   * Builds a local {@link PatternPreview} matching backend pitch and rhythm rules for the selected pattern style.
   */
  public generatePreview(data: {
    name: string;
    bpm: number;
    key: string;
    scale: string;
    lengthInBars: number;
    pattern: string;
  }): PatternPreview {
    const patternType: PatternType =
      data.pattern in PATTERN_STYLE_CONFIGS
        ? (data.pattern as PatternType)
        : 'Industrial Bassline';

    const style = PATTERN_STYLE_CONFIGS[patternType];
    const gridRow = this.generateGrid(patternType)[0] ?? [];
    const activeSteps = gridRow
      .map((active, step) => (active ? step : -1))
      .filter((step) => step >= 0);

    const baseMidi = KEY_BASE_MIDI[data.key] ?? 60;
    const intervals = SCALE_INTERVALS[data.scale] ?? SCALE_INTERVALS['Major'];
    const availablePitches = intervals.map((interval) => baseMidi + interval);

    const bars = Math.max(1, Number(data.lengthInBars) || 1);
    const notes: Note[] = [];
    let noteIndex = 0;

    for (let bar = 0; bar < bars; bar++) {
      const barOffset = bar * 16;
      for (const stepInBar of activeSteps) {
        const startPosition = barOffset + stepInBar;
        const baseDegree = style.degreeSelector(noteIndex);
        const velocity = style.velocitySelector(noteIndex);

        for (const chordOffset of style.chordOffsets) {
          const pitch = availablePitches[(baseDegree + chordOffset) % availablePitches.length];
          notes.push({
            pitch,
            velocity,
            startPosition,
            duration: style.duration
          });
        }
        noteIndex++;
      }
    }

    return {
      name: data.name,
      bpm: data.bpm,
      pattern: patternType,
      notes
    };
  }

  public generateGrid(type: PatternType): number[][] {
    const grid = [Array(16).fill(0)];
    
    switch (type) {
      case 'Industrial Bassline':
        return this.generateIndustrialBassline();
      case 'EBM Sequence':
        return this.generateEBMSequence();
        case 'Dark Techno Arp':
        return this.generateDarkTechnoArp();
      case 'Atmospheric Pad':
        return this.generateAtmosphericPad();
      default:
        return grid;
    }
  }

  private generateIndustrialBassline(): number[][] {
    const grid = [Array(16).fill(0)];
    [0, 4, 8, 12].forEach(step => grid[0][step] = 1);
    return grid;
  }

  private generateEBMSequence(): number[][] {
    const grid = [Array(16).fill(0)];
    for(let i = 0; i < 16; i += 2) grid[0][i] = 1;
    return grid;
  }

  private generateDarkTechnoArp(): number[][] {
    const grid = [Array(16).fill(0)];
    [0, 3, 6, 9, 12, 14].forEach(step => grid[0][step] = 1);
    return grid;
  }

  private generateAtmosphericPad(): number[][] {
    const grid = [Array(16).fill(0)];
    [0, 8].forEach(step => grid[0][step] = 1);
    return grid;
  }
}