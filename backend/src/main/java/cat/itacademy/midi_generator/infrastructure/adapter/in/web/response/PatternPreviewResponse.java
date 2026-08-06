package cat.itacademy.midi_generator.infrastructure.adapter.in.web.response;

import java.util.List;

public record PatternPreviewResponse(
        String name,
        int bpm,
        List<NoteResponse> notes
) {
}