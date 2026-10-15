package cat.itacademy.midi_generator.auth.infrastructure.adapter.out.security;

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
    void shouldEncodePasswordSuccessfully() {
        String plainTextPassword = "SecurePass1!";

        String encodedPassword = passwordHasherAdapter.encode(plainTextPassword);

        assertNotNull(encodedPassword);
        assertNotEquals(plainTextPassword, encodedPassword);
        assertTrue(encodedPassword.startsWith("$2a$"));
    }
}