package cat.itacademy.midi_generator.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MidiPattern {
    private final String name;
    private final int bpm;
    private final List<Note> notes;

    public MidiPattern(String name, int bpm) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("The pattern name cannot be empty.");
        }
        if (bpm < 20 || bpm > 300) {
            throw new IllegalArgumentException("The BPM should be between 20 and 300.");
        }
        this.name = name;
        this.bpm = bpm;
        this.notes = new ArrayList<>();
    }

    public void addNote(Note note) {
        if (note == null) {
            throw new IllegalArgumentException("You cannot add a null note to the pattern.");
        }
        this.notes.add(note);
    }

    public String getName() {
        return name;
    }

    public int getBpm() {
        return bpm;
    }

    public List<Note> getNotes() {
        return Collections.unmodifiableList(notes);
    }
}