package cat.itacademy.midi_generator.auth.infrastructure.adapter.in.web;

import cat.itacademy.midi_generator.auth.application.port.in.LoginUserUseCase;
import cat.itacademy.midi_generator.auth.application.port.in.command.LoginUserCommand;
import cat.itacademy.midi_generator.auth.infrastructure.adapter.in.web.dto.LoginRequest;
import cat.itacademy.midi_generator.auth.infrastructure.adapter.in.web.dto.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class LoginUserController {

    private final LoginUserUseCase loginUserUseCase;

    public LoginUserController(LoginUserUseCase loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginUserCommand command = new LoginUserCommand(request.email(), request.password());
        String token = loginUserUseCase.login(command);
        return ResponseEntity.ok(new LoginResponse(token));
    }
}