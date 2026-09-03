package cat.itacademy.midi_generator.auth.infrastructure.adapter.out.security;

import cat.itacademy.midi_generator.auth.domain.HashedPassword;
import cat.itacademy.midi_generator.auth.domain.RawPassword;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BcryptPasswordHasherAdapterTest {

    private BcryptPasswordHasherAdapter passwordHasherAdapter;

    @BeforeEach
    void setUp() {
        passwordHasherAdapter = new BcryptPasswordHasherAdapter();
    }

    @Test
    void shouldHashRawPasswordSuccessfully() {
        RawPassword rawPassword = new RawPassword("SecurePass1!");

        HashedPassword hashedPassword = passwordHasherAdapter.hash(rawPassword);

        assertNotNull(hashedPassword);
        assertNotNull(hashedPassword.value());
        assertNotEquals("SecurePass1!", hashedPassword.value());
    }

    @Test
    void shouldMatchCorrectRawPasswordWithHashedPassword() {
        RawPassword rawPassword = new RawPassword("SecurePass1!");
        HashedPassword hashedPassword = passwordHasherAdapter.hash(rawPassword);

        boolean matches = passwordHasherAdapter.matches(rawPassword, hashedPassword);

        assertTrue(matches);
    }

    @Test
    void shouldNotMatchIncorrectRawPasswordWithHashedPassword() {
        RawPassword rawPassword = new RawPassword("SecurePass1!");
        RawPassword incorrectPassword = new RawPassword("OtherSecure2!");
        HashedPassword hashedPassword = passwordHasherAdapter.hash(rawPassword);

        boolean matches = passwordHasherAdapter.matches(incorrectPassword, hashedPassword);

        assertFalse(matches);
    }
}