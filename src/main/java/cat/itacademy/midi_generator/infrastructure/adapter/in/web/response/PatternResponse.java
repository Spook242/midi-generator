package cat.itacademy.midi_generator.infrastructure.adapter.in.web.response;

public record PatternResponse(
        String id,
        String name,
        int bpm
) {
}