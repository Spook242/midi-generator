package cat.itacademy.midi_generator.auth.infrastructure.adapter.in.web;

import cat.itacademy.midi_generator.auth.application.port.in.RegisterUserUseCase;
import cat.itacademy.midi_generator.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RegisterUserController.class)
@Import(SecurityConfig.class)
class RegisterUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RegisterUserUseCase registerUserUseCase;

    @Test
    void shouldReturn201WhenRequestIsValid() throws Exception {
        String validJson = """
                {
                    "email": "test@example.com",
                    "password": "SecurePassword123!"
                }
                """;

        doNothing().when(registerUserUseCase).register(any());

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validJson))
                .andExpect(status().isCreated());
    }

    @Test
    void shouldReturn400WhenEmailIsInvalid() throws Exception {
        String invalidJson = """
                {
                    "email": "not-an-email",
                    "password": "SecurePassword123!"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
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

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
}