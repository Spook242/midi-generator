package cat.itacademy.midi_generator.auth.application.service;

import cat.itacademy.midi_generator.auth.application.port.in.command.RegisterUserCommand;
import cat.itacademy.midi_generator.auth.application.port.out.PasswordEncoderPort;
import cat.itacademy.midi_generator.auth.domain.Email;
import cat.itacademy.midi_generator.auth.domain.User;
import cat.itacademy.midi_generator.auth.domain.UserRepository;
import cat.itacademy.midi_generator.auth.domain.exception.UserAlreadyExistsException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegisterUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoderPort passwordEncoder;

    @InjectMocks
    private RegisterUserService registerUserService;

    @Test
    void shouldRegisterUserSuccessfully() {
        RegisterUserCommand command = new RegisterUserCommand("test@example.com", "SecurePass1!");

        when(userRepository.existsByEmail(any(Email.class))).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_secure_pass");

        registerUserService.register(command);

        verify(userRepository, times(1)).existsByEmail(any(Email.class));
        verify(passwordEncoder, times(1)).encode(anyString());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenUserAlreadyExists() {
        RegisterUserCommand command = new RegisterUserCommand("test@example.com", "SecurePass1!");

        when(userRepository.existsByEmail(any(Email.class))).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> registerUserService.register(command));

        verify(userRepository, times(1)).existsByEmail(any(Email.class));
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }
}