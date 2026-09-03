package com.midigen.auth.domain;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UserTest {

    @Test
    void shouldRegisterNewUserWithDefaultState() {
        Email email = new Email("test@example.com");
        HashedPassword password = new HashedPassword("hashed-secret-value");

        User user = User.register(email, password);

        assertNotNull(user.getId());
        assertNotNull(user.getId().value());
        assertEquals(email, user.getEmail());
        assertEquals(password, user.getPassword());
        assertTrue(user.isActive());
        assertFalse(user.isEmailVerified());
    }

    @Test
    void shouldReconstituteExistingUser() {
        UserId id = UserId.generate();
        Email email = new Email("existing@example.com");
        HashedPassword password = new HashedPassword("hashed-secret-value");

        User user = User.reconstitute(id, email, password, false, true);

        assertEquals(id, user.getId());
        assertEquals(email, user.getEmail());
        assertEquals(password, user.getPassword());
        assertFalse(user.isActive());
        assertTrue(user.isEmailVerified());
    }
}