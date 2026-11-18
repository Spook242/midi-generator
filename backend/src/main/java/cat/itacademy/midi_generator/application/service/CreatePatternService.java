package cat.itacademy.midi_generator.application.service;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase;
import cat.itacademy.midi_generator.application.port.out.PatternRepository;
import cat.itacademy.midi_generator.domain.MidiPattern;
import cat.itacademy.midi_generator.domain.MusicalScale;
import cat.itacademy.midi_generator.domain.Note;
import cat.itacademy.midi_generator.domain.PitchClass;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.IntUnaryOperator;

@Service
public class CreatePatternService implements CreatePatternUseCase {

    private static final int STEPS_PER_BAR = 16;

    private record PatternProfile(
            int[] stepsInBar,
            int duration,
            int[] chordOffsets,
            IntUnaryOperator degreeSelector,
            IntUnaryOperator velocitySelector
    ) {}

    private static final PatternProfile INDUSTRIAL_BASSLINE = new PatternProfile(
            new int[]{0, 4, 8, 12},
            2,
            new int[]{0},
            noteIndex -> noteIndex % 4,
            noteIndex -> (noteIndex % 2 == 0) ? 127 : 85
    );

    private static final Map<String, PatternProfile> PATTERN_PROFILES = Map.of(
            "Industrial Bassline", INDUSTRIAL_BASSLINE,
            "EBM Sequence", new PatternProfile(
                    new int[]{0, 2, 4, 6, 8, 10, 12, 14},
                    1,
                    new int[]{0},
                    noteIndex -> noteIndex,
                    noteIndex -> (noteIndex % 2 == 0) ? 127 : 85
            ),
            "Dark Techno Arp", new PatternProfile(
                    new int[]{0, 3, 6, 9, 12, 14},
                    2,
                    new int[]{0},
                    noteIndex -> noteIndex * 2,
                    noteIndex -> (noteIndex % 2 == 0) ? 120 : 90
            ),
            "Atmospheric Pad", new PatternProfile(
                    new int[]{0, 8},
                    8,
                    new int[]{0, 2, 4},
                    noteIndex -> noteIndex,
                    noteIndex -> 95
            )
    );

    private final PatternRepository patternRepository;

    public CreatePatternService(PatternRepository patternRepository) {
        this.patternRepository = patternRepository;
    }

    /**
     * Generates and persists a {@link MidiPattern} matching the requested style, scale, key, and bar count.
     */
    @Override
    public MidiPattern createPattern(CreatePatternCommand command) {
        MidiPattern pattern = new MidiPattern(command.name(), command.bpm());

        PitchClass rootPitch = PitchClass.fromString(command.key());
        MusicalScale scale = MusicalScale.fromString(command.scale());
        List<Integer> availablePitches = scale.generatePitches(rootPitch);
        PatternProfile profile = PATTERN_PROFILES.getOrDefault(command.pattern(), INDUSTRIAL_BASSLINE);

        int noteIndex = 0;
        for (int bar = 0; bar < command.lengthInBars(); bar++) {
            int barOffset = bar * STEPS_PER_BAR;
            for (int stepInBar : profile.stepsInBar()) {
                int startPosition = barOffset + stepInBar;
                int baseDegree = profile.degreeSelector().applyAsInt(noteIndex);
                int velocity = profile.velocitySelector().applyAsInt(noteIndex);

                for (int chordOffset : profile.chordOffsets()) {
                    int pitch = availablePitches.get((baseDegree + chordOffset) % availablePitches.size());
                    pattern.addNote(new Note(pitch, velocity, startPosition, profile.duration()));
                }
                noteIndex++;
            }
        }

        patternRepository.save(pattern);

        return pattern;
    }

}