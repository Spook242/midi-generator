package cat.itacademy.midi_generator.auth.application.service;

import cat.itacademy.midi_generator.auth.application.port.out.PasswordEncoderPort;
import cat.itacademy.midi_generator.auth.application.port.in.command.RegisterUserCommand;
import cat.itacademy.midi_generator.auth.application.port.in.RegisterUserUseCase;
import cat.itacademy.midi_generator.auth.domain.Email;
import cat.itacademy.midi_generator.auth.domain.HashedPassword;
import cat.itacademy.midi_generator.auth.domain.RawPassword;
import cat.itacademy.midi_generator.auth.domain.User;
import cat.itacademy.midi_generator.auth.domain.UserRepository;
import cat.itacademy.midi_generator.auth.domain.exception.UserAlreadyExistsException;

public class RegisterUserService implements RegisterUserUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoderPort passwordEncoder;

    public RegisterUserService(UserRepository userRepository, PasswordEncoderPort passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void register(RegisterUserCommand command) {
        var email = new Email(command.email());

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException(email.value());
        }

        var rawPassword = new RawPassword(command.rawPassword());

        String encodedString = passwordEncoder.encode(rawPassword.value());
        var hashedPassword = new HashedPassword(encodedString);

        var newUser = User.register(email, hashedPassword);

        userRepository.save(newUser);
    }
}