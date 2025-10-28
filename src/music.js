// ABOUTME: Music theory constants and functions for scales and chords
// ABOUTME: Pure logic with no DOM or audio dependencies

const NOTES = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
const MAJOR_SCALE_INTERVALS = [2, 2, 1, 2, 2, 2, 1];
const GUITAR_TUNING = [4, 11, 7, 2, 9, 4];
const BASE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

function getMajorScaleNotes(rootIndex) {
    const scaleNotes = [rootIndex];
    let currentIndex = rootIndex;

    for (let i = 0; i < MAJOR_SCALE_INTERVALS.length - 1; i++) {
        currentIndex = (currentIndex + MAJOR_SCALE_INTERVALS[i]) % 12;
        scaleNotes.push(currentIndex);
    }

    return scaleNotes;
}

function spellScaleWithSharps(rootIndex) {
    const letterOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const noteToSemitone = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
    const sharpLetters = {
        0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F',
        6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B'
    };

    const rootNoteName = sharpLetters[rootIndex];
    const rootLetter = rootNoteName[0];
    const startLetterIndex = letterOrder.indexOf(rootLetter);

    const scaleNotes = [];
    let currentIndex = rootIndex;

    for (let i = 0; i < 7; i++) {
        const expectedLetter = letterOrder[(startLetterIndex + i) % 7];
        const expectedNatural = noteToSemitone[expectedLetter];
        const diff = (currentIndex - expectedNatural + 12) % 12;

        if (diff === 0) {
            scaleNotes.push(expectedLetter);
        } else if (diff === 1) {
            scaleNotes.push(expectedLetter + '#');
        } else if (diff === 2) {
            scaleNotes.push(expectedLetter + '##');
        } else if (diff === 11) {
            scaleNotes.push(expectedLetter + 'b');
        } else if (diff === 10) {
            scaleNotes.push(expectedLetter + 'bb');
        }

        if (i < 6) {
            currentIndex = (currentIndex + MAJOR_SCALE_INTERVALS[i]) % 12;
        }
    }

    return scaleNotes;
}

function spellScaleWithFlats(rootIndex) {
    const letterOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const noteToSemitone = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
    const flatLetters = {
        0: 'C', 1: 'Db', 2: 'D', 3: 'Eb', 4: 'E', 5: 'F',
        6: 'Gb', 7: 'G', 8: 'Ab', 9: 'A', 10: 'Bb', 11: 'B'
    };

    const rootNoteName = flatLetters[rootIndex];
    const rootLetter = rootNoteName[0];
    const startLetterIndex = letterOrder.indexOf(rootLetter);

    const scaleNotes = [];
    let currentIndex = rootIndex;

    for (let i = 0; i < 7; i++) {
        const expectedLetter = letterOrder[(startLetterIndex + i) % 7];
        const expectedNatural = noteToSemitone[expectedLetter];
        const diff = (currentIndex - expectedNatural + 12) % 12;

        if (diff === 0) {
            scaleNotes.push(expectedLetter);
        } else if (diff === 11) {
            scaleNotes.push(expectedLetter + 'b');
        } else if (diff === 10) {
            scaleNotes.push(expectedLetter + 'bb');
        } else if (diff === 1) {
            scaleNotes.push(expectedLetter + '#');
        } else if (diff === 2) {
            scaleNotes.push(expectedLetter + '##');
        }

        if (i < 6) {
            currentIndex = (currentIndex + MAJOR_SCALE_INTERVALS[i]) % 12;
        }
    }

    return scaleNotes;
}

function getScaleSpellings(rootIndex) {
    const naturalNotes = [0, 2, 4, 5, 7, 9, 11];
    const scales = [];

    if (naturalNotes.includes(rootIndex)) {
        const sharpSpelling = spellScaleWithSharps(rootIndex);
        const scaleNoteIndices = getMajorScaleNotes(rootIndex);
        scales.push({
            name: NOTES[rootIndex] + ' Major',
            notes: sharpSpelling,
            noteIndices: scaleNoteIndices
        });
    } else {
        const sharpSpelling = spellScaleWithSharps(rootIndex);
        const flatSpelling = spellScaleWithFlats(rootIndex);
        const scaleNoteIndices = getMajorScaleNotes(rootIndex);

        const sharpLetters = {
            1: 'C#', 3: 'D#', 6: 'F#', 8: 'G#', 10: 'A#'
        };
        const flatLetters = {
            1: 'Db', 3: 'Eb', 6: 'Gb', 8: 'Ab', 10: 'Bb'
        };

        scales.push({
            name: sharpLetters[rootIndex] + ' Major',
            notes: sharpSpelling,
            noteIndices: scaleNoteIndices
        });
        scales.push({
            name: flatLetters[rootIndex] + ' Major',
            notes: flatSpelling,
            noteIndices: scaleNoteIndices
        });
    }

    return scales;
}

function buildTriadsFromScale(scaleNotes, scaleNoteNames) {
    const chords = [];

    for (let i = 0; i < 7; i++) {
        const root = scaleNotes[i];
        const third = scaleNotes[(i + 2) % 7];
        const fifth = scaleNotes[(i + 4) % 7];

        const rootName = scaleNoteNames[i];
        const thirdInterval = (third - root + 12) % 12;
        const fifthInterval = (fifth - root + 12) % 12;

        let quality = '';
        if (thirdInterval === 4 && fifthInterval === 7) {
            quality = '';
        } else if (thirdInterval === 3 && fifthInterval === 7) {
            quality = 'm';
        } else if (thirdInterval === 3 && fifthInterval === 6) {
            quality = 'dim';
        }

        chords.push({
            name: rootName + quality,
            notes: [root, third, fifth],
            degree: i + 1
        });
    }

    return chords;
}
