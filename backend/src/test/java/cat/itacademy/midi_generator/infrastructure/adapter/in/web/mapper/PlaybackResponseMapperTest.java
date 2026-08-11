package cat.itacademy.midi_generator.infrastructure.adapter.in.web.mapper;

import cat.itacademy.midi_generator.domain.MidiPattern;
import cat.itacademy.midi_generator.domain.Note;
import cat.itacademy.midi_generator.infrastructure.adapter.in.web.response.PlaybackSequenceResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PlaybackResponseMapperTest {

    private PlaybackResponseMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new PlaybackResponseMapper();
    }

    @Test
    void shouldMapMidiPatternToPlaybackSequenceResponseCorrectly() {
        Note note = new Note(60, 127, 0, 4);
        MidiPattern pattern = new MidiPattern("Test Pattern", 120);
        pattern.addNote(note);

        PlaybackSequenceResponse response = mapper.toPlaybackResponse(pattern);

        assertThat(response.bpm()).isEqualTo(120);
        assertThat(response.notes()).hasSize(1);

        var noteEvent = response.notes().get(0);
        assertThat(noteEvent.note()).isEqualTo("C4");
        assertThat(noteEvent.time()).isEqualTo("0:0:0");
        assertThat(noteEvent.duration()).isEqualTo("16n");
        assertThat(noteEvent.velocity()).isEqualTo(1.0);
    }

    @Test
    void shouldCalculateCorrectToneTimeForLaterSteps() {
        Note note = new Note(62, 64, 16, 4);

        MidiPattern pattern = new MidiPattern("Test Pattern", 140);
        pattern.addNote(note);

        PlaybackSequenceResponse response = mapper.toPlaybackResponse(pattern);

        var noteEvent = response.notes().get(0);
        assertThat(noteEvent.note()).isEqualTo("D4");
        assertThat(noteEvent.time()).isEqualTo("1:0:0");
        assertThat(noteEvent.velocity()).isCloseTo(0.5, org.assertj.core.api.Assertions.offset(0.01));
    }
}