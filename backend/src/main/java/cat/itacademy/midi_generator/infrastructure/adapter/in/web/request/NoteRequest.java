package cat.itacademy.midi_generator.infrastructure.adapter.in.web.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record NoteRequest(
        @Min(0) @Max(127) int pitch,
        @Min(0) @Max(127) int velocity,
        @Min(0) int startPosition,
        @Min(1) int duration
) {}
