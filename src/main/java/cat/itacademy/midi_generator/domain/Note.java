package cat.itacademy.midi_generator.domain;

public record Note(
        int pitch,
        int velocity,
        int startPosition,
        int duration
) {

    public Note {
        if (pitch < 0 || pitch > 127) {
            throw new IllegalArgumentException("The pitch must be between 0 and 127 according to the MIDI standard.");
        }
        if (velocity < 0 || velocity > 127) {
            throw new IllegalArgumentException("The velocity (force) must be between 0 and 127.");
        }
        if (startPosition < 0) {
            throw new IllegalArgumentException("The starting position cannot be negative.");
        }
        if (duration <= 0) {
            throw new IllegalArgumentException("The duration of the note must be strictly greater than 0.");
        }
    }
}