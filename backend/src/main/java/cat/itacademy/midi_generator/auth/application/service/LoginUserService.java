package cat.itacademy.midi_generator.auth.application.service;

import cat.itacademy.midi_generator.auth.application.port.in.LoginUserUseCase;
import cat.itacademy.midi_generator.auth.application.port.in.command.LoginUserCommand;
import cat.itacademy.midi_generator.auth.application.port.out.JwtTokenPort;
import cat.itacademy.midi_generator.auth.application.port.out.PasswordEncoderPort;
import cat.itacademy.midi_generator.auth.domain.Email;
import cat.itacademy.midi_generator.auth.domain.User;
import cat.itacademy.midi_generator.auth.domain.UserRepository;
import cat.itacademy.midi_generator.auth.domain.exception.InvalidCredentialsException;

public class LoginUserService implements LoginUserUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoderPort passwordEncoderPort;
    private final JwtTokenPort jwtTokenPort;

    public LoginUserService(UserRepository userRepository,
                            PasswordEncoderPort passwordEncoderPort,
                            JwtTokenPort jwtTokenPort) {
        this.userRepository = userRepository;
        this.passwordEncoderPort = passwordEncoderPort;
        this.jwtTokenPort = jwtTokenPort;
    }

    @Override
    public String login(LoginUserCommand command) {
        User user = userRepository.findByEmail(new Email(command.email()))
                .orElseThrow(() -> new InvalidCredentialsException("Invalid Credentials."));

        if (!passwordEncoderPort.matches(command.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid Credentials.");
        }

        return jwtTokenPort.generateToken(user);
    }
}