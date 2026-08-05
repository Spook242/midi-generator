package cat.itacademy.midi_generator.domain;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PitchClassTest {

    @Test
    void shouldReturnCorrectBaseMidiValue() {
        assertEquals(60, PitchClass.C.getBaseMidiValue());
        assertEquals(69, PitchClass.A.getBaseMidiValue());
    }

    @ParameterizedTest
    @CsvSource({
            "C, 60",
            "C#, 61",
            "Db, 61",
            "c#, 61",
            "DB, 61"
    })
    void shouldCreatePitchClassFromStringWithAliasesAndDifferentCases(String input, int expectedMidiValue) {
        PitchClass pitchClass = PitchClass.fromString(input);
        assertEquals(expectedMidiValue, pitchClass.getBaseMidiValue());
    }

    @Test
    void shouldThrowExceptionWhenStringIsInvalid() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> PitchClass.fromString("H")
        );
        assertEquals("Unrecognized Key: H", exception.getMessage());
    }
}