package cat.itacademy.midi_generator.domain;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

class ScaleCalculatorTest {

    @Test
    void shouldCalculateCMajorScaleCorrectly() {
        List<Integer> pitches = ScaleCalculator.calculatePitches("C", "Major");
        assertThat(pitches).containsExactly(60, 62, 64, 65, 67, 69, 71);
    }

    @Test
    void shouldCalculateCMinorScaleCorrectly() {
        List<Integer> pitches = ScaleCalculator.calculatePitches("C", "Minor");
        assertThat(pitches).containsExactly(60, 62, 63, 65, 67, 68, 70);
    }
}