package cat.itacademy.midi_generator.auth.infrastructure.adapter.out.security;

import cat.itacademy.midi_generator.auth.domain.HashedPassword;
import cat.itacademy.midi_generator.auth.domain.PasswordHasher;
import cat.itacademy.midi_generator.auth.domain.RawPassword;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class BcryptPasswordHasherAdapter implements PasswordHasher {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public HashedPassword hash(RawPassword rawPassword) {
        String hashedValue = passwordEncoder.encode(rawPassword.value());
        return new HashedPassword(hashedValue);
    }

    @Override
    public boolean matches(RawPassword rawPassword, HashedPassword hashedPassword) {
        return passwordEncoder.matches(rawPassword.value(), hashedPassword.value());
    }
}