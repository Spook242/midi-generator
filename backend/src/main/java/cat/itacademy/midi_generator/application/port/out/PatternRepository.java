package cat.itacademy.midi_generator.application.port.out;

import cat.itacademy.midi_generator.domain.MidiPattern;

public interface PatternRepository {
    MidiPattern save(MidiPattern pattern);
}