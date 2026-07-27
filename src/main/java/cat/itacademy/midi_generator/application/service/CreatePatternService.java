package cat.itacademy.midi_generator.application.service;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase;
import cat.itacademy.midi_generator.application.port.out.PatternRepository;
import cat.itacademy.midi_generator.domain.MidiPattern;
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
        return patternRepository.save(pattern);
    }
}