package cat.itacademy.midi_generator.auth.application.port.in;

public interface RegisterUserUseCase {
    void register(RegisterUserCommand command);
}