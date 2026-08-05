package cat.itacademy.midi_generator.domain;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class MusicalScaleTest {

    @Test
    void shouldGenerateCorrectPitchesForCMajor() {
        PitchClass root = PitchClass.C;
        List<Integer> expectedPitches = List.of(60, 62, 64, 65, 67, 69, 71);

        List<Integer> actualPitches = MusicalScale.MAJOR.generatePitches(root);

        assertEquals(expectedPitches, actualPitches);
    }

    @Test
    void shouldGenerateCorrectPitchesForCMinor() {
        PitchClass root = PitchClass.C;
        List<Integer> expectedPitches = List.of(60, 62, 63, 65, 67, 68, 70);

        List<Integer> actualPitches = MusicalScale.MINOR.generatePitches(root);

        assertEquals(expectedPitches, actualPitches);
    }

    @Test
    void shouldGenerateCorrectPitchesForGPhrygian() {
        PitchClass root = PitchClass.G;

        List<Integer> expectedPitches = List.of(67, 68, 70, 72, 74, 75, 77);

        List<Integer> actualPitches = MusicalScale.PHRYGIAN.generatePitches(root);

        assertEquals(expectedPitches, actualPitches);
    }

    @Test
    void shouldCreateScaleFromStringIgnoringCaseAndSpaces() {
        assertEquals(MusicalScale.MAJOR, MusicalScale.fromString("Major"));
        assertEquals(MusicalScale.MINOR, MusicalScale.fromString("minor"));
        assertEquals(MusicalScale.MINOR_PENTATONIC, MusicalScale.fromString("Minor Pentatonic"));
    }

    @Test
    void shouldThrowExceptionWhenScaleStringIsInvalid() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> MusicalScale.fromString("Blues")
        );
        assertEquals("Unsupported scale: Blues", exception.getMessage());
    }
}