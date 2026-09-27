package cat.itacademy.midi_generator.auth.application.port.in;

import cat.itacademy.midi_generator.auth.application.port.in.command.RegisterUserCommand;

public interface RegisterUserUseCase {
    void register(RegisterUserCommand command);
}