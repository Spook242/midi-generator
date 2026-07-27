package cat.itacademy.midi_generator.infrastructure.adapter.in.web;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CreatePatternCommandTest {

    @Test
    void shouldCreateCommandSuccessfullyWhenArgumentsAreValid() {
        var command = new CreatePatternUseCase.CreatePatternCommand("EBM-Bassline", 124);

        assertEquals("EBM-Bassline", command.name());
        assertEquals(124, command.bpm());
    }

    @Test
    void shouldThrowExceptionWhenNameIsInvalid() {
        assertThrows(IllegalArgumentException.class,
                () -> new CreatePatternUseCase.CreatePatternCommand(null, 120));
        assertThrows(IllegalArgumentException.class,
                () -> new CreatePatternUseCase.CreatePatternCommand("   ", 120));
    }

    @Test
    void shouldThrowExceptionWhenBpmIsInvalid() {
        assertThrows(IllegalArgumentException.class,
                () -> new CreatePatternUseCase.CreatePatternCommand("EBM-Bassline", 0));
        assertThrows(IllegalArgumentException.class,
                () -> new CreatePatternUseCase.CreatePatternCommand("EBM-Bassline", -10));
    }
}