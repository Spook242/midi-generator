package cat.itacademy.midi_generator.auth.infrastructure.adapter.in.web;

import cat.itacademy.midi_generator.auth.application.port.in.RegisterUserCommand;
import cat.itacademy.midi_generator.auth.application.port.in.RegisterUserUseCase;
import cat.itacademy.midi_generator.auth.infrastructure.adapter.in.web.dto.RegisterUserRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class RegisterUserController {

    private final RegisterUserUseCase registerUserUseCase;

    public RegisterUserController(RegisterUserUseCase registerUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Validated @RequestBody RegisterUserRequest request) {
        var command = new RegisterUserCommand(request.email(), request.password());

        registerUserUseCase.register(command);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}