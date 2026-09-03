package com.midigen.auth.domain;

public interface PasswordHasher {

    HashedPassword hash(RawPassword rawPassword);

    boolean matches(RawPassword rawPassword, HashedPassword hashedPassword);
}