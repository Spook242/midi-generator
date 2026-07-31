package cat.itacademy.midi_generator.infrastructure.adapter.in.web;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase;
import cat.itacademy.midi_generator.domain.MidiPattern;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PatternController.class)
class PatternControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CreatePatternUseCase createPatternUseCase;

    @Test
    void shouldReturnMidiFileAsByteArrayWhenRequestIsValid() throws Exception {
        CreatePatternRequest request = new CreatePatternRequest(
                "Test Pattern",
                120,
                "C",
                "Major",
                4
        );

        MidiPattern mockPattern = new MidiPattern("Test Pattern", 120);
        when(createPatternUseCase.createPattern(any())).thenReturn(mockPattern);
        mockMvc.perform(post("/api/v1/patterns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType("audio/midi"))
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"Test_Pattern.mid\""))
                .andExpect(result -> org.assertj.core.api.Assertions.assertThat(result.getResponse().getContentAsByteArray()).isNotEmpty());
    }
}