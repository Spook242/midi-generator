package cat.itacademy.midi_generator.auth.infrastructure.adapter.out.security;

import cat.itacademy.midi_generator.auth.application.port.out.JwtTokenPort;
import cat.itacademy.midi_generator.auth.domain.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenAdapter implements JwtTokenPort {

    private final SecretKey secretKey;
    private final long expirationTimeInMs;

    public JwtTokenAdapter(
            @Value("${app.security.jwt.secret:SuperSecretaClaveDe256BitsParaFirmarTokensMidiGenerator}") String secret,
            @Value("${app.security.jwt.expiration:86400000}") long expirationTimeInMs) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationTimeInMs = expirationTimeInMs;
    }

    @Override
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTimeInMs);

        return Jwts.builder()
                .subject(user.getEmail().value())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }
}