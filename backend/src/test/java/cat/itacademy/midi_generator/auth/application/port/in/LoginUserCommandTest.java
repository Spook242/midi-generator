package cat.itacademy.midi_generator.auth.application.port.in;

import cat.itacademy.midi_generator.auth.application.port.in.command.LoginUserCommand;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class LoginUserCommandTest {

    @Test
    void shouldCreateCommandSuccessfully() {
        LoginUserCommand command = new LoginUserCommand("test@example.com", "SecurePass1!");

        assertEquals("test@example.com", command.email());
        assertEquals("SecurePass1!", command.password());
    }

    @Test
    void shouldThrowExceptionWhenEmailIsInvalid() {
        assertThrows(IllegalArgumentException.class, () -> new LoginUserCommand(null, "SecurePass1!"));
        assertThrows(IllegalArgumentException.class, () -> new LoginUserCommand("   ", "SecurePass1!"));
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsInvalid() {
        assertThrows(IllegalArgumentException.class, () -> new LoginUserCommand("test@example.com", null));
        assertThrows(IllegalArgumentException.class, () -> new LoginUserCommand("test@example.com", "   "));
    }
}
