package cat.itacademy.midi_generator.auth.application.service;

import cat.itacademy.midi_generator.auth.application.port.in.command.LoginUserCommand;
import cat.itacademy.midi_generator.auth.application.port.out.PasswordEncoderPort;
import cat.itacademy.midi_generator.auth.application.port.out.JwtTokenPort;
import cat.itacademy.midi_generator.auth.domain.Email;
import cat.itacademy.midi_generator.auth.domain.HashedPassword;
import cat.itacademy.midi_generator.auth.domain.User;
import cat.itacademy.midi_generator.auth.domain.UserRepository;
import cat.itacademy.midi_generator.auth.domain.exception.InvalidCredentialsException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LoginUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoderPort passwordEncoder;

    @Mock
    private JwtTokenPort jwtTokenPort;

    @InjectMocks
    private LoginUserService loginUserService;

    @Test
    void shouldLoginSuccessfullyAndReturnJwtToken() {
        var command = new LoginUserCommand("test@example.com", "SecurePass1!");
        var email = new Email("test@example.com");
        var hashedPassword = new HashedPassword("hashed_secure_pass");
        var user = User.register(email, hashedPassword);

        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtTokenPort.generateToken(any(User.class))).thenReturn("eyJhbGciOiJIUzI1NiJ9...");

        var token = loginUserService.login(command);

        assertEquals("eyJhbGciOiJIUzI1NiJ9...", token);

        verify(userRepository, times(1)).findByEmail(any(Email.class));
        verify(passwordEncoder, times(1)).matches(anyString(), anyString());
        verify(jwtTokenPort, times(1)).generateToken(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenUserNotFound() {
        var command = new LoginUserCommand("test@example.com", "SecurePass1!");

        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> loginUserService.login(command));

        verify(userRepository, times(1)).findByEmail(any(Email.class));
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtTokenPort, never()).generateToken(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsIncorrect() {
        var command = new LoginUserCommand("test@example.com", "WrongPass1!");
        var email = new Email("test@example.com");
        var hashedPassword = new HashedPassword("hashed_secure_pass");
        var user = User.register(email, hashedPassword);

        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> loginUserService.login(command));

        verify(userRepository, times(1)).findByEmail(any(Email.class));
        verify(passwordEncoder, times(1)).matches(anyString(), anyString());
        verify(jwtTokenPort, never()).generateToken(any(User.class));
    }
}