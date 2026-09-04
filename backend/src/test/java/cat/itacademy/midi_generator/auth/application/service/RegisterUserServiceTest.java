package cat.itacademy.midi_generator.auth.application.service;

import cat.itacademy.midi_generator.auth.application.port.in.RegisterUserCommand;
import cat.itacademy.midi_generator.auth.domain.Email;
import cat.itacademy.midi_generator.auth.domain.HashedPassword;
import cat.itacademy.midi_generator.auth.domain.PasswordHasher;
import cat.itacademy.midi_generator.auth.domain.RawPassword;
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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegisterUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordHasher passwordHasher;

    @InjectMocks
    private RegisterUserService registerUserService;

    @Test
    void shouldRegisterUserSuccessfully() {
        RegisterUserCommand command = new RegisterUserCommand("test@example.com", "SecurePass1!");
        HashedPassword hashedPassword = new HashedPassword("hashed_secure_pass");

        when(userRepository.existsByEmail(any(Email.class))).thenReturn(false);
        when(passwordHasher.hash(any(RawPassword.class))).thenReturn(hashedPassword);

        registerUserService.register(command);

        verify(userRepository, times(1)).existsByEmail(any(Email.class));
        verify(passwordHasher, times(1)).hash(any(RawPassword.class));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenUserAlreadyExists() {
        RegisterUserCommand command = new RegisterUserCommand("test@example.com", "SecurePass1!");

        when(userRepository.existsByEmail(any(Email.class))).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> registerUserService.register(command));

        verify(userRepository, times(1)).existsByEmail(any(Email.class));
        verify(passwordHasher, never()).hash(any(RawPassword.class));
        verify(userRepository, never()).save(any(User.class));
    }
}