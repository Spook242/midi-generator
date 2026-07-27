package cat.itacademy.midi_generator.infrastructure.adapter.in.web.exception;

import java.time.LocalDateTime;

public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message
) {}