package cat.itacademy.midi_generator.infrastructure.adapter.in.web.request;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CreatePatternRequestTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void givenValidRequest_whenValidated_thenNoViolations() {
        var request = new CreatePatternRequest("Industrial Bassline", 120);
        var violations = validator.validate(request);
        assertThat(violations).isEmpty();
    }

    @Test
    void givenBlankName_whenValidated_thenHasViolation() {
        var request = new CreatePatternRequest("", 120);
        var violations = validator.validate(request);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("name"));
    }

    @Test
    void givenBpmBelowMinimum_whenValidated_thenHasViolation() {
        var request = new CreatePatternRequest("Industrial Bassline", 30);
        var violations = validator.validate(request);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("bpm"));
    }

    @Test
    void givenBpmAboveMaximum_whenValidated_thenHasViolation() {
        var request = new CreatePatternRequest("Industrial Bassline", 250);
        var violations = validator.validate(request);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("bpm"));
    }
}