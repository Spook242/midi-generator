package cat.itacademy.midi_generator.auth.domain;

public interface PasswordHasher {

    HashedPassword hash(RawPassword rawPassword);

    boolean matches(RawPassword rawPassword, HashedPassword hashedPassword);
}