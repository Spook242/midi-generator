package cat.itacademy.midi_generator.application.service;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase;
import cat.itacademy.midi_generator.application.port.out.PatternRepository;
import cat.itacademy.midi_generator.domain.MidiPattern;
import cat.itacademy.midi_generator.domain.MusicalScale;
import cat.itacademy.midi_generator.domain.Note;
import cat.itacademy.midi_generator.domain.PitchClass;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreatePatternService implements CreatePatternUseCase {

    private final PatternRepository patternRepository;

    public CreatePatternService(PatternRepository patternRepository) {
        this.patternRepository = patternRepository;
    }

    @Override
    public MidiPattern createPattern(CreatePatternCommand command) {
        MidiPattern pattern = new MidiPattern(command.name(), command.bpm());

        PitchClass rootPitch = PitchClass.fromString(command.key());
        MusicalScale scale = MusicalScale.fromString(command.scale());
        List<Integer> availablePitches = scale.generatePitches(rootPitch);

        int totalSteps = command.lengthInBars() * 16;

        for (int i = 0; i < totalSteps; i++) {
            int pitch = availablePitches.get((i / 2) % availablePitches.size());
            int velocity = (i % 4 == 0) ? 127 : 85;

            Note note = new Note(pitch, velocity, i, 1);
            pattern.addNote(note);
        }

        patternRepository.save(pattern);

        return pattern;
    }
}