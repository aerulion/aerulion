import {fontFaces} from '../lib/fonts.mjs';
import {heading, monoLabel, monoValue, panel, round, rule, svg} from '../lib/poster.mjs';
import {groupDigits} from './stats.mjs';

const W = 1200;
const H = 252;

const column = (x, width, title, rows, ink) => {
    let out = monoLabel(x, 96, title, {ink, size: 9});
    out += rule(x, 104, x + width, 104, {ink});
    rows.forEach((row, i) => {
        const y = 128 + i * 22;
        out += monoLabel(x, y, row.name, {ink, size: 10});
        out += monoValue(x + width, y, `${row.percent.toFixed(1)}%`, {ink, size: 11, weight: 600, anchor: 'end'});
        out += rule(x, y + 7, x + width, y + 7, {ink, dash: '1 4'});
    });
    return out;
};

export const wakatime = (theme, data) => {
    const {ink} = theme;
    const px = 12;
    const py = 12;
    const pw = W - px * 2;
    const ph = H - py * 2;
    const inner = px + 26;
    const railEnd = W - inner;

    let out = panel(px, py, pw, ph, {ink});

    out += monoLabel(inner, 48, 'Instrumentation', {ink, size: 10});
    out += rule(inner + 128, 44, railEnd - 68, 44, {ink});
    out += monoLabel(railEnd, 48, '04 / 04', {ink, size: 10, anchor: 'end'});

    out += heading(inner - 2, 108, `${groupDigits(Math.round(data.hours))} h`, {ink, size: 46});
    out += monoLabel(inner, 128, 'At the keyboard', {ink, size: 10});
    out += monoLabel(inner, 148, data.range, {ink, size: 9});

    const colX = 300;
    const gap = 40;
    const colW = round((railEnd - colX - gap * 2) / 3);
    out += rule(colX - 28, 74, colX - 28, 212, {ink, dash: '1 5'});

    out += column(colX, colW, 'Languages', data.languages, ink);
    out += column(colX + colW + gap, colW, 'Editors', data.editors, ink);
    out += column(colX + (colW + gap) * 2, colW, 'Categories', data.categories, ink);

    out += rule(inner, 212, colX - 44, 212, {ink});
    out += monoLabel(inner, 228, 'Source / WakaTime', {ink, size: 9});

    return svg({
        width: W,
        height: H,
        theme,
        faces: fontFaces('chakra', 'mono'),
        body: out,
        title: 'Tracked coding time',
        desc:
            `${Math.round(data.hours)} hours tracked ${data.range}. ` +
            data.languages.map((l) => `${l.name} ${l.percent.toFixed(1)}%`).join(', ')
    });
};
