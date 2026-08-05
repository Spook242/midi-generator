package cat.itacademy.midi_generator.domain;

import java.util.Arrays;
import java.util.List;

public enum MusicalScale {
    MAJOR(0, 2, 4, 5, 7, 9, 11),
    MINOR(0, 2, 3, 5, 7, 8, 10),
    HARMONIC_MINOR(0, 2, 3, 5, 7, 8, 11),
    PHRYGIAN(0, 1, 3, 5, 7, 8, 10),
    DORIAN(0, 2, 3, 5, 7, 9, 10),
    MINOR_PENTATONIC(0, 3, 5, 7, 10),
    LOCRIAN(0, 1, 3, 5, 6, 8, 10),
    CHROMATIC(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);

    private final int[] intervals;

    MusicalScale(int... intervals) {
        this.intervals = intervals;
    }

    public List<Integer> generatePitches(PitchClass rootPitch) {
        return Arrays.stream(intervals)
                .mapToObj(interval -> rootPitch.getBaseMidiValue() + interval)
                .toList();
    }

    public static MusicalScale fromString(String text) {
        return Arrays.stream(MusicalScale.values())
                .filter(scale -> scale.name().equalsIgnoreCase(text.replace(" ", "_")))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unsupported scale: " + text));
    }
}