package cat.itacademy.midi_generator.auth.application;

import cat.itacademy.midi_generator.auth.domain.Email;
import cat.itacademy.midi_generator.auth.domain.HashedPassword;
import cat.itacademy.midi_generator.auth.domain.PasswordHasher;
import cat.itacademy.midi_generator.auth.domain.RawPassword;
import cat.itacademy.midi_generator.auth.domain.User;
import cat.itacademy.midi_generator.auth.domain.UserRepository;

public class RegisterUserUseCase {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    public RegisterUserUseCase(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    public void execute(RegisterUserCommand command) {
        Email email = new Email(command.email());
        RawPassword rawPassword = new RawPassword(command.rawPassword());

        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException("The email address is already registered.");
        }

        HashedPassword hashedPassword = passwordHasher.hash(rawPassword);

        User user = User.register(email, hashedPassword);

        userRepository.save(user);
    }

    public record RegisterUserCommand(String email, String rawPassword) {}
}