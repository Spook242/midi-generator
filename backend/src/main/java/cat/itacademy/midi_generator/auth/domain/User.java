package cat.itacademy.midi_generator.auth.domain;

public class User {

    private final UserId id;
    private Email email;
    private HashedPassword password;
    private boolean active;
    private boolean emailVerified;

    public User(UserId id, Email email, HashedPassword password, boolean active, boolean emailVerified) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.active = active;
        this.emailVerified = emailVerified;
    }

    public static User register(Email email, HashedPassword password) {
        return new User(UserId.generate(), email, password, true, false);
    }

    public static User reconstitute(UserId id, Email email, HashedPassword password, boolean active, boolean emailVerified) {
        return new User(id, email, password, active, emailVerified);
    }

    public UserId getId() {
        return id;
    }

    public Email getEmail() {
        return email;
    }

    public HashedPassword getPassword() {
        return password;
    }

    public boolean isActive() {
        return active;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

}