package cat.itacademy.midi_generator.auth.application.port.in.command;

public record LoginUserCommand(
        String email,
        String password
) {
    public LoginUserCommand {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("The email cannot be empty.");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("The password cannot be empty.");
        }
    }
}