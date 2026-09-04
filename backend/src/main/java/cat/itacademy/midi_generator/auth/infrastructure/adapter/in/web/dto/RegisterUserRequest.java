package cat.itacademy.midi_generator.auth.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterUserRequest(
        @NotBlank(message = "Email is required.")
        @Email(message = "Invalid email format.")
        String email,

        @NotBlank(message = "A password is required.")
        String password
) {}