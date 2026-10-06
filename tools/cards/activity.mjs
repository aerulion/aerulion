import {fontFaces} from '../lib/fonts.mjs';
import {groupDigits} from './telemetry.mjs';
import {heading, labelWidth, monoLabel, monoValue, panel, round, rule, sectionRail, svg} from '../lib/poster.mjs';

const W = 1200;
const H = 268;
const CELL = 12;
const GAP = 4;
const WEEKS = 53;
// Mark side by level, off the spacing ramp. Area carries the count, never opacity.
const SIDE = [0, 4, 6, 8, 12];

const level = (count, peak) => {
    if (count <= 0) return 0;
    const q = count / Math.max(peak, 1);
    if (q > 0.5) return 4;
    if (q > 0.25) return 3;
    if (q > 0.1) return 2;
    return 1;
};

// An empty day is a single node, the way the lattice marks a vertex.
const emptyCell = (x, y, ink) => `<rect x="${x + CELL / 2 - 0.5}" y="${y + CELL / 2 - 0.5}" width="1" height="1" fill="${ink}"/>`;

const emptyGrid = (id, x, y, ink) =>
    `<pattern id="${id}" x="${x}" y="${y}" width="${CELL + GAP}" height="${CELL + GAP}" patternUnits="userSpaceOnUse">` +
    emptyCell(0, 0, ink) +
    `</pattern>`;

const mark = (x, y, lvl, ink) => {
    if (lvl <= 0) return '';
    const off = (CELL - SIDE[lvl]) / 2;
    return `<rect x="${round(x + off)}" y="${round(y + off)}" width="${SIDE[lvl]}" height="${SIDE[lvl]}" fill="${ink}"/>`;
};

export const activity = (theme, {days, contributions, streak}) => {
    const {ink} = theme;
    const px = 12;
    const py = 12;
    const pw = W - px * 2;
    const ph = H - py * 2;
    const inner = px + 24;
    const railEnd = W - inner;

    const today = new Date(`${days.at(-1)?.[0] ?? new Date().toISOString().slice(0, 10)}T00:00:00Z`);
    const lastCell = (WEEKS - 1) * 7 + today.getUTCDay();
    const cellOf = ([date]) => lastCell - Math.round((today - new Date(`${date}T00:00:00Z`)) / 86400000);

    const recent = days.filter((day) => cellOf(day) >= 0);
    const peak = recent.reduce((m, [, c]) => Math.max(m, c), 0);

    const gridX = inner;
    const gridY = 88;
    const gridW = WEEKS * (CELL + GAP) - GAP;

    const grid = recent
        .map((day) => {
            const cell = cellOf(day);
            return mark(
                gridX + Math.floor(cell / 7) * (CELL + GAP),
                gridY + (cell % 7) * (CELL + GAP),
                level(day[1], peak),
                ink
            );
        })
        .join('');

    const statX = gridX + gridW + 48;

    let out = panel(px, py, pw, ph, {ink});

    out += sectionRail(inner, railEnd, 48, 'Cadence', '03 / 04', {ink});

    out += monoLabel(inner, 72, 'Contributions / last 12 months', {ink});
    out += `<rect x="${gridX}" y="${gridY}" width="${gridW}" height="${7 * (CELL + GAP) - GAP}" fill="url(#cellGrid)"/>`;
    out += grid;

    const stats = [
        ['Current streak', `${streak.current} d`],
        ['Longest streak', `${streak.longest} d`],
        ['Year total', groupDigits(contributions.year)],
        ['Best day', groupDigits(peak)]
    ];

    out += rule(statX - 24, 64, statX - 24, 208, {ink});
    out += heading(statX, 96, 'Signal', {ink, size: 20});
    stats.forEach(([label, value], i) => {
        const y = 128 + i * 24;
        out += monoLabel(statX, y, label, {ink});
        out += monoValue(railEnd, y, value, {ink, anchor: 'end'});
        out += rule(statX, y + 8, railEnd, y + 8, {ink});
    });

    out += rule(inner, 208, statX - 24, 208, {ink});

    const legendY = H - 28 - 11;
    const cellsX = inner + labelWidth('Less') + 8;
    out += monoLabel(inner, legendY + 11, 'Less', {ink});
    for (let i = 0; i < SIDE.length; i++) {
        const x = cellsX + i * (CELL + GAP);
        out += emptyCell(x, legendY, ink) + mark(x, legendY, i, ink);
    }
    const moreX = cellsX + SIDE.length * (CELL + GAP) + 4;
    out += monoLabel(moreX, legendY + 11, 'More', {ink});
    out += monoLabel(moreX + labelWidth('More') + 48, legendY + 11, 'Area, not opacity', {ink});

    return svg({
        width: W,
        height: H,
        theme,
        faces: fontFaces('chakra', 'mono'),
        defs: emptyGrid('cellGrid', gridX, gridY, ink),
        body: out,
        title: 'Contribution cadence',
        desc: `${contributions.year} contributions in the last year, current streak ${streak.current} days, longest streak ${streak.longest} days.`
    });
};
