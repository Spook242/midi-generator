package cat.itacademy.midi_generator.auth.domain.exception;

public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String email) {
        super("The user with the email " + email + " is already registered.");
    }
}