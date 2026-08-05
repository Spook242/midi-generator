package cat.itacademy.midi_generator.infrastructure.adapter.in.web.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreatePatternRequest(

        @NotBlank(message = "The pattern name cannot be blank.")
        String name,

        @NotNull(message = "BPM cannot be null")
        @Min(value = 60, message = "BPM must be at least 40")
        @Max(value = 200, message = "BPM must be at most 240")
        Integer bpm,

        String key,
        String scale,
        int lengthInBars
) {}