package cat.itacademy.midi_generator.application.service;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase.CreatePatternCommand;
import cat.itacademy.midi_generator.application.port.out.PatternRepository;
import cat.itacademy.midi_generator.domain.MidiPattern;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CreatePatternServiceTest {

    @Mock
    private PatternRepository patternRepository;

    private CreatePatternService createPatternService;

    @BeforeEach
    void setUp() {
        createPatternService = new CreatePatternService(patternRepository);
    }

    @Test
    void shouldCreatePatternSuccessfully() {
        CreatePatternCommand command = new CreatePatternCommand("Industrial Sequence", 120);

        when(patternRepository.save(any(MidiPattern.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MidiPattern result = createPatternService.createPattern(command);

        assertNotNull(result, "The generated pattern should not be null.");
    }
}