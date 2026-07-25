package cat.itacademy.midi_generator.application.service;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase.CreatePatternCommand;
import cat.itacademy.midi_generator.domain.MidiPattern;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CreatePatternServiceTest {

    private CreatePatternService createPatternService;

    @BeforeEach
    void setUp() {
        createPatternService = new CreatePatternService();
    }

    @Test
    void shouldCreatePatternSuccessfully() {
        CreatePatternCommand command = new CreatePatternCommand("Industrial Sequence", 130);

        MidiPattern result = createPatternService.createPattern(command);

        assertNotNull(result, "The generated pattern should not be null.");
        assertEquals("Industrial Sequence", result.getName());
        assertEquals(130, result.getBpm());
        assertTrue(result.getNotes().isEmpty(), "A newly created pattern should not contain notes.");
    }
}