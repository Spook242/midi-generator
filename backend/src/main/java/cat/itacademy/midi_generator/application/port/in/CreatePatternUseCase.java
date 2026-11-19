package cat.itacademy.midi_generator.application.port.in;

import cat.itacademy.midi_generator.domain.MidiPattern;
import cat.itacademy.midi_generator.domain.Note;

import java.util.List;

public interface CreatePatternUseCase {
    MidiPattern createPattern(CreatePatternCommand command);

    record CreatePatternCommand(
            String name,
            int bpm,
            String key,
            String scale,
            int lengthInBars,
            String pattern,
            List<Note> notes
    ) {
        public CreatePatternCommand(String name, int bpm, String key, String scale, int lengthInBars) {
            this(name, bpm, key, scale, lengthInBars, "Industrial Bassline", List.of());
        }

        public CreatePatternCommand(String name, int bpm, String key, String scale, int lengthInBars, String pattern) {
            this(name, bpm, key, scale, lengthInBars, pattern, List.of());
        }

        public CreatePatternCommand {
            if (name == null || name.isBlank()) {
                throw new IllegalArgumentException("The command name cannot be empty.");
            }
            if (bpm <= 0) {
                throw new IllegalArgumentException("The BPM of the command must be greater than zero.");
            }

            if (lengthInBars <= 0) {
                throw new IllegalArgumentException("The length in bars must be strictly greater than 0");
            }
            if (key == null || key.isBlank()) {
                throw new IllegalArgumentException("The key cannot be empty");
            }
            if (scale == null || scale.isBlank()) {
                throw new IllegalArgumentException("The scale cannot be empty");
            }
            if (pattern == null || pattern.isBlank()) {
                pattern = "Industrial Bassline";
            }
            notes = notes == null ? List.of() : List.copyOf(notes);
        }
    }
}