package com.midigen.auth.domain;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class EmailTest {

    @Test
    void shouldCreateEmailWhenFormatIsValid() {
        Email email = assertDoesNotThrow(() -> new Email("test@example.com"));
        assertEquals("test@example.com", email.value());
    }

    @Test
    void shouldTrimAndLowercaseEmail() {
        Email email = new Email("   USER@Example.COM   ");
        assertEquals("user@example.com", email.value());
    }

    @Test
    void shouldThrowExceptionWhenEmailIsNull() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> new Email(null));
        assertEquals("The email cannot be empty.", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenEmailIsBlank() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> new Email("   "));
        assertEquals("The email cannot be empty.", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenFormatIsInvalid() {
        assertThrows(IllegalArgumentException.class, () -> new Email("invalid-email"));
        assertThrows(IllegalArgumentException.class, () -> new Email("user@"));
        assertThrows(IllegalArgumentException.class, () -> new Email("@domain.com"));
        assertThrows(IllegalArgumentException.class, () -> new Email("user@domain"));
        assertThrows(IllegalArgumentException.class, () -> new Email("user@domain.c"));
    }
}