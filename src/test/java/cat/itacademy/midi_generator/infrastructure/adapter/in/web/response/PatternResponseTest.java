package cat.itacademy.midi_generator.infrastructure.adapter.in.web.response;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PatternResponseTest {

    @Test
    void shouldCreatePatternResponseAndGetValuesCorrectly() {
        // Given
        String expectedId = "abc-123-xyz";
        String expectedName = "Industrial Bassline";
        int expectedBpm = 120;

        var response = new PatternResponse(expectedId, expectedName, expectedBpm);

        assertThat(response.id()).isEqualTo(expectedId);
        assertThat(response.name()).isEqualTo(expectedName);
        assertThat(response.bpm()).isEqualTo(expectedBpm);
    }

    @Test
    void givenSameValues_whenComparingResponses_thenAreEqual() {
        var response1 = new PatternResponse("1", "Techno Beat", 130);
        var response2 = new PatternResponse("1", "Techno Beat", 130);
        var response3 = new PatternResponse("2", "Ambient Synth", 90);

        assertThat(response1).isEqualTo(response2);
        assertThat(response1.hashCode()).isEqualTo(response2.hashCode());
        assertThat(response1).isNotEqualTo(response3);
    }
}