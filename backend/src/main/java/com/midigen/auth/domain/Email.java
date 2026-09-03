package com.midigen.auth.domain;

import java.util.regex.Pattern;

public record Email(String value) {

    private static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    private static final Pattern PATTERN = Pattern.compile(EMAIL_REGEX);

    public Email {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("The email cannot be empty.");
        }

        value = value.trim().toLowerCase();

        if (!PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("The email format is invalid.");
        }
    }
}