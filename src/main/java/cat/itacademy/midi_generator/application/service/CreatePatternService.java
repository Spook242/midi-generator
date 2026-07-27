package cat.itacademy.midi_generator.application.service;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase;
import cat.itacademy.midi_generator.domain.MidiPattern;
import org.springframework.stereotype.Service;

@Service
public class CreatePatternService implements CreatePatternUseCase {

    @Override
    public MidiPattern createPattern(CreatePatternCommand command) {
        MidiPattern pattern = new MidiPattern(command.name(), command.bpm());

        // Si tuviéramos base de datos, aquí llamaríamos a un Puerto de Salida (Out Port)
        // por ejemplo: patternRepository.save(pattern);

        return pattern;
    }
}