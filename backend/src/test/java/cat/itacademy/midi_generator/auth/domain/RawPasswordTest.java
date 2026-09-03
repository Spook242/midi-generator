package cat.itacademy.midi_generator.auth.domain;

import cat.itacademy.midi_generator.auth.domain.RawPassword;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class RawPasswordTest {

    @Test
    void shouldCreatePasswordWhenCompliesWithOwasp() {
        RawPassword password = assertDoesNotThrow(() -> new RawPassword("StrongP@ssw0rd!"));
        assertEquals("StrongP@ssw0rd!", password.value());
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsNull() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> new RawPassword(null));
        assertEquals("The password cannot be empty.", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsBlank() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> new RawPassword("   "));
        assertEquals("The password cannot be empty.", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsTooShort() {
        assertThrows(IllegalArgumentException.class, () -> new RawPassword("Sh0rt!"));
    }

    @Test
    void shouldThrowExceptionWhenMissingUppercase() {
        assertThrows(IllegalArgumentException.class, () -> new RawPassword("nouppercase1!"));
    }

    @Test
    void shouldThrowExceptionWhenMissingLowercase() {
        assertThrows(IllegalArgumentException.class, () -> new RawPassword("NOLOWERCASE1!"));
    }

    @Test
    void shouldThrowExceptionWhenMissingDigit() {
        assertThrows(IllegalArgumentException.class, () -> new RawPassword("NoDigitHere!"));
    }

    @Test
    void shouldThrowExceptionWhenMissingSpecialCharacter() {
        assertThrows(IllegalArgumentException.class, () -> new RawPassword("NoSpecialChar1"));
    }
}