package cat.itacademy.midi_generator.domain;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class NoteTest {

    @Test
    void shouldCreateNoteSuccessfullyWhenArgumentsAreValid() {
        Note note = new Note(60, 100, 0, 4);

        assertEquals(60, note.pitch());
        assertEquals(100, note.velocity());
        assertEquals(0, note.startPosition());
        assertEquals(4, note.duration());
    }

    @Test
    void shouldThrowExceptionWhenPitchIsInvalid() {
        assertThrows(IllegalArgumentException.class, () -> new Note(-1, 100, 0, 4));
        assertThrows(IllegalArgumentException.class, () -> new Note(128, 100, 0, 4));
    }

    @Test
    void shouldThrowExceptionWhenVelocityIsInvalid() {
        assertThrows(IllegalArgumentException.class, () -> new Note(60, -5, 0, 4));
        assertThrows(IllegalArgumentException.class, () -> new Note(60, 150, 0, 4));
    }

    @Test
    void shouldThrowExceptionWhenStartPositionIsNegative() {
        assertThrows(IllegalArgumentException.class, () -> new Note(60, 100, -1, 4));
    }

    @Test
    void shouldThrowExceptionWhenDurationIsInvalid() {
        assertThrows(IllegalArgumentException.class, () -> new Note(60, 100, 0, 0));
        assertThrows(IllegalArgumentException.class, () -> new Note(60, 100, 0, -2));
    }
}