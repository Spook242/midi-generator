package cat.itacademy.midi_generator.auth.application.port.out;

public interface PasswordEncoderPort {
    String encode(String rawPassword);

    boolean matches(String rawPassword, String encodedPassword);
}