package cat.itacademy.midi_generator.auth.domain.exception;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Invalid credentials. Access to Pattern Visualizer denied.");
    }

    public InvalidCredentialsException(String message) {
        super(message);
    }
}