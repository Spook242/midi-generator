package com.midigen.auth.application;

import com.midigen.auth.domain.Email;
import com.midigen.auth.domain.HashedPassword;
import com.midigen.auth.domain.PasswordHasher;
import com.midigen.auth.domain.RawPassword;
import com.midigen.auth.domain.User;
import com.midigen.auth.domain.UserRepository;

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