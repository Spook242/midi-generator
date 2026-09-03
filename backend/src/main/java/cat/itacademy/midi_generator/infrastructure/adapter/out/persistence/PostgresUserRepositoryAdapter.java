package cat.itacademy.midi_generator.infrastructure.adapter.out.persistence;

import cat.itacademy.midi_generator.auth.domain.*;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class PostgresUserRepositoryAdapter implements UserRepository {

    private final UserJpaRepository jpaRepository;

    public PostgresUserRepositoryAdapter(UserJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public void save(User user) {
        UserJpaEntity entity = new UserJpaEntity(
                user.getId().value(),
                user.getEmail().value(),
                user.getPassword().value(),
                user.isActive(),
                user.isEmailVerified()
        );
        jpaRepository.save(entity);
    }

    @Override
    public Optional<User> findByEmail(Email email) {
        return jpaRepository.findByEmail(email.value())
                .map(entity -> new User(
                        new UserId(entity.getId()),
                        email,
                        new HashedPassword(entity.getPassword()),
                        entity.isActive(),
                        entity.isEmailVerified()
                ));
    }

    @Override
    public boolean existsByEmail(Email email) {
        return jpaRepository.existsByEmail(email.value());
    }
}