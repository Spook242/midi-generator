package cat.itacademy.midi_generator.infrastructure.adapter.in.web.response;

import java.util.List;

public record PlaybackSequenceResponse(
        int bpm,
        List<NoteEventResponse> notes
) {}