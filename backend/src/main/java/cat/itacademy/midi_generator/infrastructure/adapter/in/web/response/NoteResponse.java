package cat.itacademy.midi_generator.infrastructure.adapter.in.web.response;

public record NoteResponse(
        int pitch,
        int velocity,
        int startPosition,
        int duration
) {
}