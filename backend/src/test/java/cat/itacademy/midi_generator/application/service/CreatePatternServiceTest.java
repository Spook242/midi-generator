package cat.itacademy.midi_generator.application.service;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase.CreatePatternCommand;
import cat.itacademy.midi_generator.application.port.out.PatternRepository;
import cat.itacademy.midi_generator.domain.MidiPattern;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CreatePatternServiceTest {

    @Mock
    private PatternRepository patternRepository;
    private CreatePatternService createPatternService;

    @BeforeEach
    void setUp() {
        patternRepository = mock(PatternRepository.class);
        createPatternService = new CreatePatternService(patternRepository);
    }

    @Test
    void shouldCreatePatternSuccessfully() {
        CreatePatternCommand command = new CreatePatternCommand(
                "Techno Bassline",
                120,
                "C",
                "Minor",
                1
        );

        when(patternRepository.save(any(MidiPattern.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MidiPattern result = createPatternService.createPattern(command);

        assertThat(result).isNotNull();
        assertThat(result.getNotes().get(0).velocity()).isEqualTo(127);
        assertThat(result.getNotes().get(1).velocity()).isEqualTo(85);
    }

    @Test
    void shouldGenerateIndustrialBasslineNotes() {
        CreatePatternCommand command = new CreatePatternCommand(
                "Industrial", 120, "C", "Phrygian", 1, "Industrial Bassline"
        );

        when(patternRepository.save(any(MidiPattern.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MidiPattern result = createPatternService.createPattern(command);

        assertThat(result.getNotes()).hasSize(4);
        assertThat(result.getNotes()).extracting("startPosition").containsExactly(0, 4, 8, 12);
        assertThat(result.getNotes()).allMatch(note -> note.duration() == 2);
        assertThat(result.getNotes()).extracting("velocity").containsExactly(127, 85, 127, 85);
    }

    @Test
    void shouldGenerateEbmSequenceNotes() {
        CreatePatternCommand command = new CreatePatternCommand(
                "EBM", 128, "C", "Phrygian", 1, "EBM Sequence"
        );

        when(patternRepository.save(any(MidiPattern.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MidiPattern result = createPatternService.createPattern(command);

        assertThat(result.getNotes()).hasSize(8);
        assertThat(result.getNotes()).extracting("startPosition").containsExactly(0, 2, 4, 6, 8, 10, 12, 14);
        assertThat(result.getNotes()).allMatch(note -> note.duration() == 1);
        assertThat(result.getNotes().get(0).velocity()).isEqualTo(127);
        assertThat(result.getNotes().get(1).velocity()).isEqualTo(85);
    }

    @Test
    void shouldGenerateDarkTechnoArpNotes() {
        CreatePatternCommand command = new CreatePatternCommand(
                "Arp", 132, "C", "Phrygian", 1, "Dark Techno Arp"
        );

        when(patternRepository.save(any(MidiPattern.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MidiPattern result = createPatternService.createPattern(command);

        assertThat(result.getNotes()).hasSize(6);
        assertThat(result.getNotes()).extracting("startPosition").containsExactly(0, 3, 6, 9, 12, 14);
        assertThat(result.getNotes()).allMatch(note -> note.duration() == 2);
        assertThat(result.getNotes().get(0).velocity()).isEqualTo(120);
        assertThat(result.getNotes().get(1).velocity()).isEqualTo(90);
        assertThat(result.getNotes().get(1).pitch()).isEqualTo(63); // C Phrygian degree 2 (D#4)
    }

    @Test
    void shouldGenerateAtmosphericPadChords() {
        CreatePatternCommand command = new CreatePatternCommand(
                "Pad", 90, "C", "Phrygian", 1, "Atmospheric Pad"
        );

        when(patternRepository.save(any(MidiPattern.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MidiPattern result = createPatternService.createPattern(command);

        assertThat(result.getNotes()).hasSize(6);
        assertThat(result.getNotes().subList(0, 3)).allMatch(n -> n.startPosition() == 0 && n.duration() == 8 && n.velocity() == 95);
        assertThat(result.getNotes().subList(3, 6)).allMatch(n -> n.startPosition() == 8 && n.duration() == 8 && n.velocity() == 95);
    }
}