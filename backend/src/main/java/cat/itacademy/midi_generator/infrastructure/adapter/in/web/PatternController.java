package cat.itacademy.midi_generator.infrastructure.adapter.in.web;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase;
import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase.CreatePatternCommand;
import cat.itacademy.midi_generator.domain.MidiPattern;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/patterns")
public class PatternController {

    private final CreatePatternUseCase createPatternUseCase;

    public PatternController(CreatePatternUseCase createPatternUseCase) {
        this.createPatternUseCase = createPatternUseCase;
    }

    @PostMapping
    public ResponseEntity<MidiPattern> createPattern(@Valid @RequestBody CreatePatternRequest request) {
        var command =  new CreatePatternCommand(
                request.name(),
                request.bpm(),
                request.key(),
                request.scale(),
                request.lengthInBars()
        );
        MidiPattern createdPattern = createPatternUseCase.createPattern(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPattern);
    }
}