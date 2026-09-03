package cat.itacademy.midi_generator.auth.infrastructure.adapter.out.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified;

    protected UserJpaEntity() {}

    public UserJpaEntity(UUID id, String email, String password, boolean active, boolean emailVerified) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.active = active;
        this.emailVerified = emailVerified;
    }

    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public boolean isActive() { return active; }
    public boolean isEmailVerified() { return emailVerified; }
}