package cat.itacademy.midi_generator.auth.application.port.in;

import cat.itacademy.midi_generator.auth.application.port.in.command.LoginUserCommand;

public interface LoginUserUseCase {
    String login(LoginUserCommand command);
}