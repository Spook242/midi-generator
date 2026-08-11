package cat.itacademy.midi_generator.infrastructure.adapter.in.web.response;

public record NoteEventResponse(
        String note,
        String time,
        String duration,
        double velocity
) {}