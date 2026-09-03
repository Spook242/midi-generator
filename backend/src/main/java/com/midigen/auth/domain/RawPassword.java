package com.midigen.auth.domain;

import java.util.regex.Pattern;

public record RawPassword(String value) {

    private static final String OWASP_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
    private static final Pattern PATTERN = Pattern.compile(OWASP_REGEX);

    public RawPassword {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("The password cannot be empty.");
        }
        if (!PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("The password must be at least 8 characters long, and include one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).");
        }
    }
}