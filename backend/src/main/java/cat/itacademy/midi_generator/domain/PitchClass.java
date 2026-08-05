package cat.itacademy.midi_generator.domain;

import java.util.Arrays;

public enum PitchClass {
    C(60, "C"),
    C_SHARP(61, "C#", "Db"),
    D(62, "D"),
    D_SHARP(63, "D#", "Eb"),
    E(64, "E"),
    F(65, "F"),
    F_SHARP(66, "F#", "Gb"),
    G(67, "G"),
    G_SHARP(68, "G#", "Ab"),
    A(69, "A"),
    A_SHARP(70, "A#", "Bb"),
    B(71, "B");

    private final int baseMidiValue;
    private final String[] aliases;

    PitchClass(int baseMidiValue, String... aliases) {
        this.baseMidiValue = baseMidiValue;
        this.aliases = aliases;
    }

    public int getBaseMidiValue() {
        return baseMidiValue;
    }

    public static PitchClass fromString(String text) {
        return Arrays.stream(PitchClass.values())
                .filter(pitchClass -> Arrays.stream(pitchClass.aliases).anyMatch(alias -> alias.equalsIgnoreCase(text)))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unrecognized Key: " + text));
    }
}