package cat.itacademy.midi_generator.auth.infrastructure.config;

import cat.itacademy.midi_generator.auth.application.port.in.LoginUserUseCase;
import cat.itacademy.midi_generator.auth.application.port.in.RegisterUserUseCase;
import cat.itacademy.midi_generator.auth.application.service.LoginUserService;
import cat.itacademy.midi_generator.auth.application.service.RegisterUserService;
import cat.itacademy.midi_generator.auth.application.port.out.JwtTokenPort;
import cat.itacademy.midi_generator.auth.application.port.out.PasswordEncoderPort;
import cat.itacademy.midi_generator.auth.domain.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthUseCasesConfig {

    @Bean
    public RegisterUserUseCase registerUserUseCase(
            UserRepository userRepository,
            PasswordEncoderPort passwordEncoder) {
        return new RegisterUserService(userRepository, passwordEncoder);
    }

    @Bean
    public LoginUserUseCase loginUserUseCase(
            UserRepository userRepository,
            PasswordEncoderPort passwordEncoderPort,
            JwtTokenPort jwtTokenPort) {
        return new LoginUserService(userRepository, passwordEncoderPort, jwtTokenPort);
    }
}