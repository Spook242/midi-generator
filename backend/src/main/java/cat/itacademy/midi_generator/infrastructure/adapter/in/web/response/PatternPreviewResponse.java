package cat.itacademy.midi_generator.infrastructure.adapter.in.web.response;

import java.util.List;

public record PatternPreviewResponse(
        String name,
        int bpm,
        List<NoteResponse> notes,
        String pattern
) {
    public PatternPreviewResponse(String name, int bpm, List<NoteResponse> notes) {
        this(name, bpm, notes, "Industrial Bassline");
    }
}