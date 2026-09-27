package cat.itacademy.midi_generator.auth.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Email is required.")
        @Email(message = "The email format is invalid.")
        String email,

        @NotBlank(message = "A password is required.")
        String password
) {
}