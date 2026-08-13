import { SequencerService } from './sequencer';
import * as Tone from 'tone';

vi.mock('tone', () => ({
  PolySynth: vi.fn(() => ({ toDestination: vi.fn() })),
  Synth: vi.fn(),
  Transport: { bpm: { value: 120 }, start: vi.fn(), stop: vi.fn() },
  Part: vi.fn(() => ({ start: vi.fn(), dispose: vi.fn() }))
}));

describe('SequencerService', () => {
  let service: SequencerService;

  beforeEach(() => {
    service = new SequencerService();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería actualizar el BPM del Transport al reproducir', () => {
    const mockSequence = { 
      bpm: 140, 
      notes: [{ note: 'C4', time: '0:0:0', duration: '1 * 16n', velocity: 0.8 }] 
    };

    service.playSequence(mockSequence as any);
    
    expect(Tone.Transport.bpm.value).toBe(140);
  });
});