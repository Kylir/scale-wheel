# Scale Wheel

A browser-based music theory tool for exploring major scales, chords, and guitar fretboard positions.

## What it does

Rotate the wheel to select any of the 12 major scales. The wheel highlights which notes belong to the selected scale and which don't. Below the wheel, the app shows:

- The scale name and notes, with correct enharmonic spelling (e.g. F# Major vs Gb Major)
- All 7 diatonic triads with Roman numeral analysis (I, ii, iii, IV, V, vi, vii°)
- A guitar fretboard diagram showing where scale notes fall across all 6 strings

Click any chord button to hear it played and see its notes highlighted on the fretboard. Click the same chord again to deselect it. Click any segment on the wheel to hear that individual note.

## Live demo

https://kylir.github.io/scale-wheel/

## How to use it

Open `index.html` in a browser. No build step, no server required.

Drag the wheel with a mouse or finger to rotate it. The scale updates as you turn. The wheel snaps to the nearest semitone when you release.

## Tech

- Vanilla JavaScript, HTML, CSS
- SVG for the wheel and fretboard
- [Tone.js](https://tonejs.github.io/) for audio (triangle wave polyphonic synth)

Audio is initialized on first interaction, as required by browser autoplay policies.
