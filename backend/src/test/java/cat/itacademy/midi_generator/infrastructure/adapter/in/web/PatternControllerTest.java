package cat.itacademy.midi_generator.infrastructure.adapter.in.web;

import cat.itacademy.midi_generator.application.port.in.CreatePatternUseCase;
import cat.itacademy.midi_generator.domain.MidiPattern;
import cat.itacademy.midi_generator.domain.Note;
import cat.itacademy.midi_generator.infrastructure.adapter.in.web.request.CreatePatternRequest;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

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

    @Test
    void shouldReturnPatternPreviewWhenRequestIsValid() throws Exception {

        CreatePatternRequest request = new CreatePatternRequest(
                "Test Pattern",
                120,
                "C",
                "Major",
                4
        );

        MidiPattern mockPattern = new MidiPattern("Test Pattern", 120);
        mockPattern.addNote(new Note(60, 100, 0, 1));
        mockPattern.addNote(new Note(64, 100, 1, 1));


        when(createPatternUseCase.createPattern(any())).thenReturn(mockPattern);

        mockMvc.perform(post("/api/v1/patterns/preview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("Test Pattern"))
                .andExpect(jsonPath("$.bpm").value(120))
                .andExpect(jsonPath("$.notes").isArray())
                .andExpect(jsonPath("$.notes.length()").value(2))
                .andExpect(jsonPath("$.notes[0].pitch").value(60))
                .andExpect(jsonPath("$.notes[0].duration").value(1))
                .andExpect(jsonPath("$.notes[1].pitch").value(64))
                .andExpect(jsonPath("$.notes[1].duration").value(1));
    }
}