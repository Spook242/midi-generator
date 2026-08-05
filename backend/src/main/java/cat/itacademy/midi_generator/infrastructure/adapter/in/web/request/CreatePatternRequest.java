package cat.itacademy.midi_generator.infrastructure.adapter.in.web.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreatePatternRequest(
        @NotBlank(message = "The pattern name cannot be blank.")
        String name,

        @Min(value = 40, message = "BPM must be at least 40.")
        @Max(value = 300, message = "BPM cannot exceed 300.")
        int bpm,
        String key,
        String scale,
        int lengthInBars
) {}