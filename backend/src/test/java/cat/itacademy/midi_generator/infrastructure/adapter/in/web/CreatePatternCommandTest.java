package cat.itacademy.midi_generator.infrastructure.adapter.in.web;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CreatePatternCommandTest {

    @Test
    void shouldCreateCommandSuccessfullyWhenArgumentsAreValid() {
        var command = new CreatePatternUseCase.CreatePatternCommand("EBM-Bassline", 124, "C", "Minor", 1);

        assertEquals("EBM-Bassline", command.name());
        assertEquals(124, command.bpm());
        assertEquals("C", command.key());
        assertEquals("Minor", command.scale());
        assertEquals(1, command.lengthInBars());
        assertEquals("Industrial Bassline", command.pattern());
    }

    @Test
    void shouldAssignRequestedPatternAndDefaultWhenNullOrBlank() {
        var custom = new CreatePatternUseCase.CreatePatternCommand("EBM", 128, "C", "Phrygian", 2, "EBM Sequence");
        var withNull = new CreatePatternUseCase.CreatePatternCommand("Default", 120, "C", "Minor", 1, null);
        var withBlank = new CreatePatternUseCase.CreatePatternCommand("Default", 120, "C", "Minor", 1, "   ");

        assertEquals("EBM Sequence", custom.pattern());
        assertEquals("Industrial Bassline", withNull.pattern());
        assertEquals("Industrial Bassline", withBlank.pattern());
    }

    @Test
    void shouldThrowExceptionWhenNameIsInvalid() {
        assertThrows(IllegalArgumentException.class,
                () -> new CreatePatternUseCase.CreatePatternCommand(null, 120, "C", "Minor", 1));
        assertThrows(IllegalArgumentException.class,
                () -> new CreatePatternUseCase.CreatePatternCommand("   ", 120, "C", "Minor", 1));
    }

    @Test
    void shouldThrowExceptionWhenBpmIsInvalid() {
        assertThrows(IllegalArgumentException.class,
                () -> new CreatePatternUseCase.CreatePatternCommand("EBM-Bassline", 0, "C", "Minor", 1));
        assertThrows(IllegalArgumentException.class,
                () -> new CreatePatternUseCase.CreatePatternCommand("EBM-Bassline", -10, "C", "Minor", 1));
    }

    @Test
    void shouldThrowExceptionWhenNewMusicalParametersAreInvalid() {
        assertThrows(IllegalArgumentException.class,
                () -> new CreatePatternUseCase.CreatePatternCommand("EBM-Bassline", 120, null, "Minor", 1));

        assertThrows(IllegalArgumentException.class,
                () -> new CreatePatternUseCase.CreatePatternCommand("EBM-Bassline", 120, "C", "  ", 1));

        assertThrows(IllegalArgumentException.class,
                () -> new CreatePatternUseCase.CreatePatternCommand("EBM-Bassline", 120, "C", "Minor", 0));
    }
}