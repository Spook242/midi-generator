package cat.itacademy.midi_generator.infrastructure.adapter.in.web;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase;
import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase.CreatePatternCommand;
import cat.itacademy.midi_generator.domain.MidiPattern;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PatternController.class)
class PatternControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CreatePatternUseCase createPatternUseCase;

    @Test
    void givenValidRequest_whenCreatePattern_thenReturns201() throws Exception {
        String requestJson = """
                {
                    "name": "Industrial Bassline",
                    "bpm": 120
                }
                """;

        MidiPattern mockPattern = new MidiPattern("Electronic Bassline", 120);

        when(createPatternUseCase.createPattern(any(CreatePatternCommand.class)))
                .thenReturn(mockPattern);

        mockMvc.perform(post("/api/v1/patterns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Electronic Bassline"))
                .andExpect(jsonPath("$.bpm").value(120));
    }

    @Test
    void givenInvalidName_whenCreatePattern_thenReturns400() throws Exception {
        String requestJson = """
                {
                    "name": "",
                    "bpm": 120
                }
                """;

        mockMvc.perform(post("/api/v1/patterns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenInvalidBpm_whenCreatePattern_thenReturns400() throws Exception {
        String requestJson = """
                {
                    "name": "EBM Sequence",
                    "bpm": 30
                }
                """;

        mockMvc.perform(post("/api/v1/patterns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isBadRequest());
    }
}