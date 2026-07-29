package cat.itacademy.midi_generator.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ScaleCalculator {
    private static final Map<String, Integer> ROOT_NOTES = Map.ofEntries(
            Map.entry("C", 60),
            Map.entry("C#", 61), Map.entry("Db", 61),
            Map.entry("D", 62),
            Map.entry("D#", 63), Map.entry("Eb", 63),
            Map.entry("E", 64),
            Map.entry("F", 65),
            Map.entry("F#", 66), Map.entry("Gb", 66),
            Map.entry("G", 67),
            Map.entry("G#", 68), Map.entry("Ab", 68),
            Map.entry("A", 69),
            Map.entry("A#", 70), Map.entry("Bb", 70),
            Map.entry("B", 71)
    );

    private static final Map<String, int[]> SCALES = Map.of(
            "Major", new int[]{0, 2, 4, 5, 7, 9, 11},
            "Minor", new int[]{0, 2, 3, 5, 7, 8, 10}
    );

    public static List<Integer> calculatePitches(String key, String scaleName) {
        int rootMidi = ROOT_NOTES.getOrDefault(key.toUpperCase(), 60);
        int[] intervals = SCALES.getOrDefault(scaleName, SCALES.get("Major"));

        List<Integer> pitches = new ArrayList<>();
        for (int interval : intervals) {
            pitches.add(rootMidi + interval);
        }

        return pitches;
    }
}