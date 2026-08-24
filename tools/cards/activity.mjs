import {fontFaces} from '../lib/fonts.mjs';
import {heading, monoLabel, monoValue, panel, round, rule, svg} from '../lib/poster.mjs';

const W = 1200;
const H = 268;
const CELL = 13;
const GAP = 3;
const WEEKS = 53;

const level = (count, peak) => {
    if (count <= 0) return 0;
    const q = count / Math.max(peak, 1);
    if (q > 0.5) return 4;
    if (q > 0.25) return 3;
    if (q > 0.1) return 2;
    return 1;
};

const emptyGrid = (id, x, y, ink) =>
    `<pattern id="${id}" x="${x}" y="${y}" width="${CELL + GAP}" height="${CELL + GAP}" patternUnits="userSpaceOnUse">` +
    `<rect x="0" y="0" width="${CELL}" height="${CELL}" fill="none" stroke="${ink}" stroke-width="0.5" stroke-dasharray="1 3"/>` +
    `</pattern>`;

const mark = (x, y, lvl, ink) => {
    if (lvl <= 0) return '';
    if (lvl === 4) return `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" fill="${ink}"/>`;
    const size = [0, CELL * 0.3, CELL * 0.55, CELL * 0.8][lvl];
    const off = round((CELL - size) / 2);
    return `<rect x="${round(x + off)}" y="${round(y + off)}" width="${round(size)}" height="${round(size)}" fill="${ink}"/>`;
};

const legendCell = (x, y, lvl, ink) =>
    `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" fill="none" stroke="${ink}" stroke-width="0.5" stroke-dasharray="1 3"/>` +
    mark(x, y, lvl, ink);

export const activity = (theme, {days, contributions, streak}) => {
    const {ink} = theme;
    const px = 12;
    const py = 12;
    const pw = W - px * 2;
    const ph = H - py * 2;
    const inner = px + 26;
    const railEnd = W - inner;

    const today = new Date(`${days.at(-1)?.[0] ?? new Date().toISOString().slice(0, 10)}T00:00:00Z`);
    const lastCell = (WEEKS - 1) * 7 + today.getUTCDay();
    const cellOf = ([date]) => lastCell - Math.round((today - new Date(`${date}T00:00:00Z`)) / 86400000);

    const recent = days.filter((day) => cellOf(day) >= 0);
    const peak = recent.reduce((m, [, c]) => Math.max(m, c), 0);

    const gridX = inner;
    const gridY = 90;
    const gridW = WEEKS * (CELL + GAP) - GAP;

    const grid = recent
        .map((day) => {
            const cell = cellOf(day);
            return mark(
                round(gridX + Math.floor(cell / 7) * (CELL + GAP)),
                round(gridY + (cell % 7) * (CELL + GAP)),
                level(day[1], peak),
                ink
            );
        })
        .join('');

    const statX = gridX + gridW + 56;

    let out = panel(px, py, pw, ph, {ink});

    out += monoLabel(inner, 48, 'Cadence', {ink, size: 10});
    out += rule(inner + 74, 44, railEnd - 68, 44, {ink});
    out += monoLabel(railEnd, 48, '03 / 04', {ink, size: 10, anchor: 'end'});

    out += monoLabel(inner, 74, 'Contributions / last 12 months', {ink, size: 9});
    out += `<rect x="${gridX}" y="${gridY}" width="${gridW}" height="${7 * (CELL + GAP) - GAP}" fill="url(#cellGrid)"/>`;
    out += grid;

    const stats = [
        ['Current streak', `${streak.current} d`],
        ['Longest streak', `${streak.longest} d`],
        ['Year total', String(contributions.year)],
        ['All time', String(contributions.total)]
    ];

    out += rule(statX - 28, 74, statX - 28, 206, {ink, dash: '1 5'});
    out += heading(statX, 96, 'Signal', {ink, size: 22});
    stats.forEach(([label, value], i) => {
        const y = 128 + i * 26;
        out += monoLabel(statX, y, label, {ink, size: 10});
        out += monoValue(railEnd, y, value, {ink, size: 14, weight: 600, anchor: 'end'});
        out += rule(statX, y + 7, railEnd, y + 7, {ink, dash: '1 4'});
    });

    const legendY = 218;
    out += monoLabel(inner, legendY + 11, 'Less', {ink, size: 9});
    for (let i = 0; i < 5; i++) out += legendCell(round(inner + 42 + i * (CELL + GAP)), legendY, i, ink);
    out += monoLabel(inner + 42 + 5 * (CELL + GAP) + 8, legendY + 11, 'More', {ink, size: 9});
    out += monoLabel(inner + 200, legendY + 11, 'Area, not opacity', {ink, size: 9});

    out += rule(inner, 206, statX - 28, 206, {ink});

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
