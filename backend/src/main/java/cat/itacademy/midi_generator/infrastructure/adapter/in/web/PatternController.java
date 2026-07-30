private byte[] generateMidiBytes(MidiPattern pattern) throws Exception {
    Sequence sequence = new Sequence(Sequence.PPQ, 4);
    Track track = sequence.createTrack();

    int microsecondsPerQuarterNote = 60000000 / pattern.getBpm();
    MetaMessage tempoMessage = new MetaMessage();
    byte[] tempoData = new byte[] {
            (byte) ((microsecondsPerQuarterNote >> 16) & 0xFF),
            (byte) ((microsecondsPerQuarterNote >> 8) & 0xFF),
            (byte) (microsecondsPerQuarterNote & 0xFF)
    };
    tempoMessage.setMessage(0x51, tempoData, 3);
    track.add(new MidiEvent(tempoMessage, 0));

    long tick = 0;
    for (Note note : pattern.getNotes()) {
        ShortMessage on = new ShortMessage();
        on.setMessage(ShortMessage.NOTE_ON, 0, note.pitch(), 90);
        track.add(new MidiEvent(on, tick));

        tick += (long) (note.duration() * 4);

        ShortMessage off = new ShortMessage();
        off.setMessage(ShortMessage.NOTE_OFF, 0, note.pitch(), 0);
        track.add(new MidiEvent(off, tick));
    }

    ByteArrayOutputStream out = new ByteArrayOutputStream();
    MidiSystem.write(sequence, 1, out);
    return out.toByteArray();
}