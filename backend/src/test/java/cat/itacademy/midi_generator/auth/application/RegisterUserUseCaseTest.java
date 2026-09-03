package cat.itacademy.midi_generator.auth.application;

import cat.itacademy.midi_generator.auth.application.RegisterUserUseCase;
import cat.itacademy.midi_generator.auth.domain.Email;
import cat.itacademy.midi_generator.auth.domain.HashedPassword;
import cat.itacademy.midi_generator.auth.domain.PasswordHasher;
import cat.itacademy.midi_generator.auth.domain.RawPassword;
import cat.itacademy.midi_generator.auth.domain.User;
import cat.itacademy.midi_generator.auth.domain.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RegisterUserUseCaseTest {

    private UserRepository userRepository;
    private PasswordHasher passwordHasher;
    private RegisterUserUseCase useCase;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordHasher = mock(PasswordHasher.class);

        useCase = new RegisterUserUseCase(userRepository, passwordHasher);
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        RegisterUserUseCase.RegisterUserCommand command =
                new RegisterUserUseCase.RegisterUserCommand("test@example.com", "StrongP@ssw0rd!");

        when(userRepository.existsByEmail(any(Email.class))).thenReturn(false);
        when(passwordHasher.hash(any(RawPassword.class))).thenReturn(new HashedPassword("hashed-secret"));

        useCase.execute(command);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("test@example.com", savedUser.getEmail().value());
        assertEquals("hashed-secret", savedUser.getPassword().value());
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        RegisterUserUseCase.RegisterUserCommand command =
                new RegisterUserUseCase.RegisterUserCommand("test@example.com", "StrongP@ssw0rd!");

        when(userRepository.existsByEmail(any(Email.class))).thenReturn(true);

        Exception exception = assertThrows(IllegalStateException.class, () -> useCase.execute(command));
        assertEquals("The email address is already registered.", exception.getMessage());

        verify(passwordHasher, never()).hash(any());
        verify(userRepository, never()).save(any());
    }
}