// ABOUTME: Scale wheel visualization for musicians to see notes in different keys
// ABOUTME: Displays a circular wheel with 12 chromatic notes and draggable scale pattern

const NOTES = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
const MAJOR_SCALE_INTERVALS = [2, 2, 1, 2, 2, 2, 1];
// const GUITAR_TUNING = [4, 9, 2, 7, 11, 4];
const GUITAR_TUNING = [4, 11, 7, 2, 9, 4];


const CENTER_X = 300;
const CENTER_Y = 300;
const LONG_RADIUS = 220;
const SHORT_RADIUS = 160;
const LABEL_RADIUS = 190;

let currentRotation = 0;
let isDragging = false;
let lastAngle = 0;
let animationFrameId = null;

function getMajorScaleNotes(rootIndex) {
    const scaleNotes = [rootIndex];
    let currentIndex = rootIndex;

    for (let i = 0; i < MAJOR_SCALE_INTERVALS.length - 1; i++) {
        currentIndex = (currentIndex + MAJOR_SCALE_INTERVALS[i]) % 12;
        scaleNotes.push(currentIndex);
    }

    return scaleNotes;
}

function createSegmentPath(index, isInScale) {
    const radius = isInScale ? LONG_RADIUS : SHORT_RADIUS;
    const angleStart = (index * 30 - 90) * Math.PI / 180;
    const angleEnd = ((index + 1) * 30 - 90) * Math.PI / 180;

    const x1 = CENTER_X + radius * Math.cos(angleStart);
    const y1 = CENTER_Y + radius * Math.sin(angleStart);
    const x2 = CENTER_X + radius * Math.cos(angleEnd);
    const y2 = CENTER_Y + radius * Math.sin(angleEnd);

    return `M ${CENTER_X} ${CENTER_Y} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
}

function renderWheel() {
    const wheelGroup = document.getElementById('wheel-group');
    const labelsGroup = document.getElementById('labels-group');

    const rootNoteIndex = Math.round(currentRotation / 30) % 12;
    const scaleNotes = getMajorScaleNotes(rootNoteIndex);

    wheelGroup.setAttribute('transform', `rotate(${currentRotation}, ${CENTER_X}, ${CENTER_Y})`);

    if (wheelGroup.children.length === 0) {
        const majorScalePattern = [0, 2, 4, 5, 7, 9, 11];

        for (let i = 0; i < 12; i++) {
            const isInScale = majorScalePattern.includes(i);
            const isRoot = i === 0;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', createSegmentPath(i, isInScale));
            path.setAttribute('class', `segment ${isInScale ? 'in-scale' : 'out-of-scale'} ${isRoot ? 'root-segment' : ''}`);
            wheelGroup.appendChild(path);
        }
    }

    labelsGroup.innerHTML = '';

    for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x = CENTER_X + LABEL_RADIUS * Math.cos(angle + Math.PI / 12);
        const y = CENTER_Y + LABEL_RADIUS * Math.sin(angle + Math.PI / 12);
        const isInScale = scaleNotes.includes(i);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('class', `note-label ${isInScale ? 'in-scale' : 'out-of-scale'}`);
        text.textContent = NOTES[i];
        labelsGroup.appendChild(text);
    }

    updateScaleInfo(rootNoteIndex, scaleNotes);
}

function updateScaleInfo(rootNoteIndex, scaleNotes) {
    const scaleName = document.getElementById('scale-name');
    const scaleNotesList = document.getElementById('scale-notes');

    const rootNote = NOTES[rootNoteIndex];
    scaleName.textContent = `${rootNote} Major`;

    const noteNames = scaleNotes.map(index => NOTES[index]).join(', ');
    scaleNotesList.textContent = noteNames;

    renderFretboard(rootNoteIndex, scaleNotes);
}

function renderFretboard(rootNoteIndex, scaleNotes) {
    const fretboard = document.getElementById('fretboard');
    fretboard.innerHTML = '';

    const fretWidth = 60;
    const stringSpacing = 30;
    const startX = 40;
    const startY = 20;
    const numFrets = 12;
    const numStrings = 6;

    for (let fret = 0; fret <= numFrets; fret++) {
        const x = startX + fret * fretWidth;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', x);
        line.setAttribute('y2', startY + (numStrings - 1) * stringSpacing);
        line.setAttribute('class', 'fret-line');
        fretboard.appendChild(line);
    }

    for (let fret = 1; fret <= numFrets; fret++) {
        const x = startX + fret * fretWidth - fretWidth / 2;
        const y = startY + (numStrings - 1) * stringSpacing + 30;

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'fret-number');
        text.textContent = fret;
        fretboard.appendChild(text);
    }

    for (let string = 0; string < numStrings; string++) {
        const y = startY + string * stringSpacing;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startX);
        line.setAttribute('y1', y);
        line.setAttribute('x2', startX + numFrets * fretWidth);
        line.setAttribute('y2', y);
        line.setAttribute('class', 'string-line');
        fretboard.appendChild(line);
    }

    for (let string = 0; string < numStrings; string++) {
        const openNote = GUITAR_TUNING[string];

        for (let fret = 0; fret <= numFrets; fret++) {
            const noteIndex = (openNote + fret) % 12;

            if (scaleNotes.includes(noteIndex)) {
                const x = startX + (fret === 0 ? -20 : fret * fretWidth - fretWidth / 2);
                const y = startY + string * stringSpacing;
                const isRoot = noteIndex === rootNoteIndex;

                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                circle.setAttribute('r', 12);
                circle.setAttribute('class', `fretboard-note ${isRoot ? 'root-note' : ''}`);
                fretboard.appendChild(circle);
            }
        }
    }
}

function getAngleFromMouse(mouseX, mouseY) {
    const dx = mouseX - CENTER_X;
    const dy = mouseY - CENTER_Y;
    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;
    return angle;
}

function snapToNearestNote(angle) {
    return Math.round(angle / 30) * 30;
}

function animateToAngle(targetAngle) {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    const startAngle = currentRotation;
    let delta = targetAngle - startAngle;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const finalAngle = startAngle + delta;
    const duration = 200;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3);
        currentRotation = startAngle + delta * eased;

        renderWheel();

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            currentRotation = (targetAngle + 360) % 360;
            animationFrameId = null;
        }
    }

    animationFrameId = requestAnimationFrame(animate);
}

const svg = document.getElementById('scale-wheel');

svg.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    lastAngle = getAngleFromMouse(mouseX, mouseY);
});

svg.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const currentAngle = getAngleFromMouse(mouseX, mouseY);

    const deltaAngle = currentAngle - lastAngle;
    currentRotation = (currentRotation + deltaAngle + 360) % 360;
    lastAngle = currentAngle;

    renderWheel();
});

svg.addEventListener('mouseup', () => {
    isDragging = false;
});

svg.addEventListener('mouseleave', () => {
    isDragging = false;
});

renderWheel();
