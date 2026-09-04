package cat.itacademy.midi_generator.auth.application.port.in;

public record RegisterUserCommand(
        String email,
        String rawPassword
) {
    public RegisterUserCommand {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("The email cannot be empty.");
        }
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("The password cannot be empty.");
        }
    }
}