package cat.itacademy.midi_generator.infrastructure.adapter.in.web;

import cat.itacademy.midi_generator.infrastructure.adapter.in.web.response.NoteResponse;
import cat.itacademy.midi_generator.infrastructure.adapter.in.web.response.PatternPreviewResponse;
import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase;
import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase.CreatePatternCommand;
import cat.itacademy.midi_generator.domain.MidiPattern;
import cat.itacademy.midi_generator.domain.Note;
import cat.itacademy.midi_generator.infrastructure.adapter.in.web.request.CreatePatternRequest;

import jakarta.validation.Valid;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sound.midi.*;
import java.io.ByteArrayOutputStream;
import java.util.List;

@RestController
@RequestMapping("/api/v1/patterns")
@CrossOrigin(origins = "http://localhost:4200")
public class PatternController {

    private final CreatePatternUseCase createPatternUseCase;

    public PatternController(CreatePatternUseCase createPatternUseCase) {
        this.createPatternUseCase = createPatternUseCase;
    }

    @PostMapping("/preview")
    public ResponseEntity<PatternPreviewResponse> previewPattern(
            @Valid @RequestBody CreatePatternRequest request) {

        var command = new CreatePatternUseCase.CreatePatternCommand(
                request.name(),
                request.bpm(),
                request.key(),
                request.scale(),
                request.lengthInBars()
        );

        MidiPattern pattern = createPatternUseCase.createPattern(command);

        List<NoteResponse> notes = pattern.getNotes().stream()
                .map(note -> new NoteResponse(
                        note.pitch(),
                        note.velocity(),
                        note.startPosition(),
                        note.duration()
                ))
                .toList();

        PatternPreviewResponse response = new PatternPreviewResponse(
                pattern.getName(),
                pattern.getBpm(),
                notes
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<byte[]> createPattern(@Valid @RequestBody CreatePatternRequest request) {
        var command = new CreatePatternCommand(
                request.name(),
                request.bpm(),
                request.key(),
                request.scale(),
                request.lengthInBars()
        );

        MidiPattern pattern = createPatternUseCase.createPattern(command);

        try {
            byte[] midiBytes = generateMidiBytes(pattern);
            String filename = (pattern.getName() != null ? pattern.getName().replaceAll("\\s+", "_") : "pattern") + ".mid";

            return ResponseEntity.status(HttpStatus.CREATED)
                    .contentType(MediaType.parseMediaType("audio/midi"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(midiBytes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private byte[] generateMidiBytes(MidiPattern pattern) throws Exception {
        Sequence sequence = new Sequence(Sequence.PPQ, 4);
        Track track = sequence.createTrack();

        int microsecondsPerQuarterNote = 60000000 / pattern.getBpm();
        MetaMessage tempoMessage = new MetaMessage();
        byte[] tempoData = new byte[] {
                (byte) ((microsecondsPerQuarterNote >> 16) & 0xFF),
                (byte) ((microsecondsPerQuarterNote >> 8) & 0xFF),
                (byte) (microsecondsPerQuarterNote & 0xFF)
        };
        tempoMessage.setMessage(0x51, tempoData, 3);
        track.add(new MidiEvent(tempoMessage, 0));

        long tick = 0;
        for (Note note : pattern.getNotes()) {
            ShortMessage on = new ShortMessage();
            on.setMessage(ShortMessage.NOTE_ON, 0, note.pitch(), 90);
            track.add(new MidiEvent(on, tick));

            tick += (long) (note.duration() * 4);

            ShortMessage off = new ShortMessage();
            off.setMessage(ShortMessage.NOTE_OFF, 0, note.pitch(), 0);
            track.add(new MidiEvent(off, tick));
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        MidiSystem.write(sequence, 1, out);
        return out.toByteArray();
    }
}