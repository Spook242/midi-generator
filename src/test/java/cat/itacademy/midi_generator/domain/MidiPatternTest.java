package cat.itacademy.midi_generator.domain;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MidiPatternTest {

    @Test
    void shouldCreatePatternSuccessfullyWithValidArguments() {
        MidiPattern pattern = new MidiPattern("EBM-Bassline", 120);

        assertEquals("EBM-Bassline", pattern.getName());
        assertEquals(120, pattern.getBpm());
        assertTrue(pattern.getNotes().isEmpty());
    }

    @Test
    void shouldThrowExceptionWhenNameIsInvalid() {
        assertThrows(IllegalArgumentException.class, () -> new MidiPattern(null, 120));
        assertThrows(IllegalArgumentException.class, () -> new MidiPattern("   ", 120));
    }

    @Test
    void shouldThrowExceptionWhenBpmIsInvalid() {
        assertThrows(IllegalArgumentException.class, () -> new MidiPattern("Industrial-Beat", 15));
        assertThrows(IllegalArgumentException.class, () -> new MidiPattern("Industrial-Beat", 350));
    }

    @Test
    void shouldAddNoteSuccessfully() {
        MidiPattern pattern = new MidiPattern("Main-Sequence", 135);

        Note kickNote = new Note(36, 127, 0, 4);

        pattern.addNote(kickNote);

        assertEquals(1, pattern.getNotes().size());
        assertEquals(36, pattern.getNotes().get(0).pitch());
        assertEquals(127, pattern.getNotes().get(0).velocity());
    }

    @Test
    void shouldThrowExceptionWhenAddingNullNote() {
        MidiPattern pattern = new MidiPattern("Main-Sequence", 135);

        assertThrows(IllegalArgumentException.class, () -> pattern.addNote(null));
    }

    @Test
    void shouldPreventModifyingNotesListDirectly() {
        MidiPattern pattern = new MidiPattern("Main-Sequence", 135);
        Note note = new Note(36, 127, 0, 4);
        pattern.addNote(note);

        assertThrows(UnsupportedOperationException.class, () -> pattern.getNotes().clear());
    }
}