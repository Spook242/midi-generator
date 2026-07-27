package cat.itacademy.midi_generator.infrastructure.adapter.in.web.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreatePatternRequest(
        @NotBlank(message = "Pattern name cannot be blank")
        String name,

        @NotNull(message = "BPM cannot be null")
        @Min(value = 40, message = "BPM must be at least 40")
        @Max(value = 240, message = "BPM must be at most 240")
        Integer bpm
) {
}