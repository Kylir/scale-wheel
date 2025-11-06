// ABOUTME: Audio playback using Tone.js synthesizer
// ABOUTME: Handles initialization and playing of notes and chords

let synth = null;

async function initAudio() {
    await Tone.start();
    synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
            type: 'triangle'
        },
        envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 1
        }
    }).toDestination();
}

function indexToNoteName(noteIndex, rootNoteIndex) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = noteIndex >= rootNoteIndex ? 3 : 4;
    return noteNames[noteIndex] + octave;
}

function playNote(noteIndex, rootNoteIndex) {
    if (!synth) {
        initAudio();
        return;
    }
    const noteName = indexToNoteName(noteIndex, rootNoteIndex);
    synth.triggerAttackRelease(noteName, '0.5');
}

function playChord(noteIndices, rootNoteIndex) {
    if (!synth) {
        initAudio();
        return;
    }
    const chordRoot = noteIndices[0];
    const noteNames = noteIndices.map(index => indexToNoteName(index, chordRoot));
    console.log('Playing chord:', noteNames);
    synth.triggerAttackRelease(noteNames, '0.8');
}
