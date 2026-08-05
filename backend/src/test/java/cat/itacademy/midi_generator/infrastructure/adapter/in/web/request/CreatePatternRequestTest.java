package cat.itacademy.midi_generator.infrastructure.adapter.in.web.request;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

class CreatePatternRequestTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @ParameterizedTest
    @CsvSource({
            "'' , 120",
            "'Industrial Bassline', 30",
            "'Industrial Bassline', 250"
    })
    void givenInvalidRequest_whenValidated_thenHasViolation(String name, int bpm) {
        var request = new CreatePatternRequest(name, bpm, "C", "Major", 4);
        var violations = validator.validate(request);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals(name.isEmpty() ? "name" : "bpm"));
    }
}