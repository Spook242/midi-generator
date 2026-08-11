package cat.itacademy.midi_generator.infrastructure.adapter.in.web.mapper;

import cat.itacademy.midi_generator.domain.MidiPattern;
import cat.itacademy.midi_generator.domain.Note;
import cat.itacademy.midi_generator.infrastructure.adapter.in.web.response.PlaybackSequenceResponse;
import cat.itacademy.midi_generator.infrastructure.adapter.in.web.response.NoteEventResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PlaybackResponseMapper {

    private static final String[] NOTE_NAMES = {"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"};

    public PlaybackResponseMapper() {}

    public PlaybackSequenceResponse toPlaybackResponse(MidiPattern pattern) {
        List<NoteEventResponse> notes = pattern.getNotes().stream()
                .map(this::mapToNoteEventResponse)
                .collect(Collectors.toList());

        return new PlaybackSequenceResponse(pattern.getBpm(), notes);
    }

    private NoteEventResponse mapToNoteEventResponse(Note note) {
        return new NoteEventResponse(
                midiToNoteName(note.pitch()),
                calculateToneTime(note.startPosition()),
                "16n",
                (double) note.velocity() / 127.0
        );
    }

    private String midiToNoteName(int midiNote) {
        int octave = (midiNote / 12) - 1;
        String noteName = NOTE_NAMES[midiNote % 12];
        return noteName + octave;
    }

    private String calculateToneTime(int startPosition) {
        int bar = startPosition / 16;
        int quarter = (startPosition % 16) / 4;
        int sixteenth = startPosition % 4;
        return String.format("%d:%d:%d", bar, quarter, sixteenth);
    }
}