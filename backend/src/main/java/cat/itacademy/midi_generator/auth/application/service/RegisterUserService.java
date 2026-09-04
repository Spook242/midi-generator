package cat.itacademy.midi_generator.auth.application.service;

import cat.itacademy.midi_generator.auth.application.port.in.RegisterUserCommand;
import cat.itacademy.midi_generator.auth.application.port.in.RegisterUserUseCase;
import cat.itacademy.midi_generator.auth.domain.Email;
import cat.itacademy.midi_generator.auth.domain.PasswordHasher;
import cat.itacademy.midi_generator.auth.domain.RawPassword;
import cat.itacademy.midi_generator.auth.domain.User;
import cat.itacademy.midi_generator.auth.domain.UserRepository;
import cat.itacademy.midi_generator.auth.domain.exception.UserAlreadyExistsException;
import org.springframework.stereotype.Service;

@Service
public class RegisterUserService implements RegisterUserUseCase {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    public RegisterUserService(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    @Override
    public void register(RegisterUserCommand command) {
        var email = new Email(command.email());

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException(email.value());
        }

        var rawPassword = new RawPassword(command.rawPassword());
        var hashedPassword = passwordHasher.hash(rawPassword);

        var newUser = User.register(email, hashedPassword);

        userRepository.save(newUser);
    }
}