package cat.itacademy.midi_generator.auth.application.port.out;

import cat.itacademy.midi_generator.auth.domain.User;

public interface JwtTokenPort {
    String generateToken(User user);
}