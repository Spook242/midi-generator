package cat.itacademy.midi_generator.auth.domain;

import java.util.Optional;

public interface UserRepository {
    void save(User user);
    Optional<User> findByEmail(Email email);
    boolean existsByEmail(Email email);
}