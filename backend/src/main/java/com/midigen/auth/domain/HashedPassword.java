package com.midigen.auth.domain;

public record HashedPassword(String value) {

    public HashedPassword {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("The password hash cannot be empty.");
        }
    }
}