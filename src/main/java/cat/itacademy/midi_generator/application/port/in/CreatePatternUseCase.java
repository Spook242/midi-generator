package cat.itacademy.midi_generator.application.port.in;

import cat.itacademy.midi_generator.domain.MidiPattern;

public interface CreatePatternUseCase {
    MidiPattern createPattern(CreatePatternCommand command);

    record CreatePatternCommand(
            String name,
            int bpm
    ) {
        public CreatePatternCommand {
            if (name == null || name.isBlank()) {
                throw new IllegalArgumentException("The command name cannot be empty.");
            }
            if (bpm <= 0) {
                throw new IllegalArgumentException("The BPM of the command must be greater than zero.");
            }
        }
    }
}