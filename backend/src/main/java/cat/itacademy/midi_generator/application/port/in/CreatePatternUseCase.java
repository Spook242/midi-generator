package cat.itacademy.midi_generator.application.port.in;

import cat.itacademy.midi_generator.domain.MidiPattern;

public interface CreatePatternUseCase {
    MidiPattern createPattern(CreatePatternCommand command);

    record CreatePatternCommand(
            String name,
            int bpm,
            String key,
            String scale,
            int lengthInBars
    ) {
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
        }
    }
}