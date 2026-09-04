package cat.itacademy.midi_generator.auth.application.port.in;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class RegisterUserCommandTest {

    @Test
    void shouldCreateCommandSuccessfully() {
        RegisterUserCommand command = new RegisterUserCommand("test@example.com", "SecurePass1!");

        assertEquals("test@example.com", command.email());
        assertEquals("SecurePass1!", command.rawPassword());
    }

    @Test
    void shouldThrowExceptionWhenEmailIsInvalid() {
        assertThrows(IllegalArgumentException.class, () -> new RegisterUserCommand(null, "SecurePass1!"));
        assertThrows(IllegalArgumentException.class, () -> new RegisterUserCommand("   ", "SecurePass1!"));
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsInvalid() {
        assertThrows(IllegalArgumentException.class, () -> new RegisterUserCommand("test@example.com", null));
        assertThrows(IllegalArgumentException.class, () -> new RegisterUserCommand("test@example.com", "   "));
    }
}