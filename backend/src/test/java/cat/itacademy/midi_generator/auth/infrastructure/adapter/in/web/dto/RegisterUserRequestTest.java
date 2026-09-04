package cat.itacademy.midi_generator.auth.infrastructure.adapter.in.web.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RegisterUserRequestTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void shouldPassValidationWhenDataIsValid() {
        RegisterUserRequest request = new RegisterUserRequest("test@example.com", "SecurePass1!");

        Set<ConstraintViolation<RegisterUserRequest>> violations = validator.validate(request);

        assertTrue(violations.isEmpty(), "There should be no validation violations.");
    }

    @Test
    void shouldFailValidationWhenEmailIsInvalid() {
        RegisterUserRequest request = new RegisterUserRequest("invalid-email", "SecurePass1!");

        Set<ConstraintViolation<RegisterUserRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertEquals("Invalid email format.", violations.iterator().next().getMessage());
    }

    @Test
    void shouldFailValidationWhenEmailIsBlank() {
        RegisterUserRequest request = new RegisterUserRequest("", "SecurePass1!");

        Set<ConstraintViolation<RegisterUserRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("Email is required.")));
    }

    @Test
    void shouldFailValidationWhenPasswordIsBlank() {
        RegisterUserRequest request = new RegisterUserRequest("test@example.com", "   ");

        Set<ConstraintViolation<RegisterUserRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertEquals("A password is required.", violations.iterator().next().getMessage());
    }
}