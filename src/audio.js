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

function indexToNoteName(noteIndex) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return noteNames[noteIndex] + '4';
}

function playNote(noteIndex) {
    if (!synth) {
        initAudio();
        return;
    }
    const noteName = indexToNoteName(noteIndex);
    synth.triggerAttackRelease(noteName, '0.5');
}

function playChord(noteIndices) {
    if (!synth) {
        initAudio();
        return;
    }
    const noteNames = noteIndices.map(index => indexToNoteName(index));
    synth.triggerAttackRelease(noteNames, '0.8');
}
