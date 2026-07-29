package cat.itacademy.midi_generator.infrastructure.adapter.out.persistence;

import cat.itacademy.midi_generator.application.port.out.PatternRepository;
import cat.itacademy.midi_generator.domain.MidiPattern;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class InMemoryPatternRepository implements PatternRepository {

    private final List<MidiPattern> database = new ArrayList<>();

    @Override
    public MidiPattern save(MidiPattern pattern) {
        database.add(pattern);
        return pattern;
    }
}