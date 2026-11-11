package cat.itacademy.midi_generator.auth.infrastructure.adapter.in.web;

import cat.itacademy.midi_generator.auth.application.port.in.LoginUserUseCase;
import cat.itacademy.midi_generator.auth.domain.exception.InvalidCredentialsException;
import cat.itacademy.midi_generator.shared.infrastructure.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LoginUserController.class)
@Import(SecurityConfig.class)
class LoginUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LoginUserUseCase loginUserUseCase;

    @Test
    void shouldReturn200AndTokenWhenCredentialsAreValid() throws Exception {
        String validJson = """
                {
                    "email": "test@example.com",
                    "password": "SecurePassword123!"
                }
                """;

        when(loginUserUseCase.login(any())).thenReturn("eyJhbGciOiJIUzI1NiJ9.mock.token");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("eyJhbGciOiJIUzI1NiJ9.mock.token"));
    }

    @Test
    void shouldReturn401WhenCredentialsAreInvalid() throws Exception {
        String invalidCredentialsJson = """
                {
                    "email": "test@example.com",
                    "password": "WrongPassword123!"
                }
                """;

        when(loginUserUseCase.login(any())).thenThrow(new InvalidCredentialsException());

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidCredentialsJson))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Invalid credentials. Access to Pattern Visualizer denied."));
    }

    @Test
    void shouldReturn400WhenEmailIsInvalid() throws Exception {
        String invalidJson = """
                {
                    "email": "not-an-email",
                    "password": "SecurePassword123!"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400WhenPasswordIsMissing() throws Exception {
        String invalidJson = """
                {
                    "email": "test@example.com",
                    "password": ""
                }
                """;

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
}
