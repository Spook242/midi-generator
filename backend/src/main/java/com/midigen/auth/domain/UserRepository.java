package com.midigen.auth.domain;

import java.util.Optional;

public interface UserRepository {
    void save(User user);
    Optional<User> findByEmail(Email email);
    boolean existsByEmail(Email email);
}