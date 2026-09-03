package cat.itacademy.midi_generator.auth.domain;

public record HashedPassword(String value) {

    public HashedPassword {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("The password hash cannot be empty.");
        }
    }
}