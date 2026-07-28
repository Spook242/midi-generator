package cat.itacademy.midi_generator.application.service;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase;
import cat.itacademy.midi_generator.application.port.out.PatternRepository;
import cat.itacademy.midi_generator.domain.MidiPattern;
import cat.itacademy.midi_generator.domain.Note;
import org.springframework.stereotype.Service;

@Service
public class CreatePatternService implements CreatePatternUseCase {

    private final PatternRepository patternRepository;

    public CreatePatternService(PatternRepository patternRepository) {
        this.patternRepository = patternRepository;
    }

    @Override
    public MidiPattern createPattern(CreatePatternCommand command) {
        MidiPattern pattern = new MidiPattern(command.name(), command.bpm());

        int totalSteps = command.lengthInBars() * 16;

        for (int i = 0; i < totalSteps; i++) {
            Note note = new Note(60, 100, i, 1);
            pattern.addNote(note);
        }

        patternRepository.save(pattern);
        return pattern;
    }
}