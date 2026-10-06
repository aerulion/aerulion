import {fontFaces} from '../lib/fonts.mjs';
import {heading, monoLabel, monoValue, panel, round, rule, sectionRail, svg} from '../lib/poster.mjs';
import {groupDigits} from './telemetry.mjs';

const W = 1200;
const H = 260;

const column = (x, width, title, rows, ink) => {
    let out = monoLabel(x, 92, title, {ink});
    out += rule(x, 104, x + width, 104, {ink});
    rows.forEach((row, i) => {
        const y = 128 + i * 24;
        out += monoLabel(x, y, row.name, {ink});
        out += monoValue(x + width, y, `${row.percent.toFixed(1)}%`, {ink, anchor: 'end'});
        out += rule(x, y + 8, x + width, y + 8, {ink});
    });
    return out;
};

export const wakatime = (theme, data) => {
    const {ink} = theme;
    const px = 12;
    const py = 12;
    const pw = W - px * 2;
    const ph = H - py * 2;
    const inner = px + 24;
    const railEnd = W - inner;

    let out = panel(px, py, pw, ph, {ink});

    out += sectionRail(inner, railEnd, 48, 'Instrumentation', '04 / 04', {ink});

    out += heading(inner - 2, 96, groupDigits(Math.round(data.hours)), {ink});
    out += monoLabel(inner, 120, 'Hours / at the keyboard', {ink});
    out += monoLabel(inner, 144, data.range, {ink});

    const colX = 312;
    const gap = 48;
    const colW = round((railEnd - colX - gap * 2) / 3);
    out += rule(colX - 24, 64, colX - 24, 208, {ink});

    out += column(colX, colW, 'Languages', data.languages, ink);
    out += column(colX + colW + gap, colW, 'Editors', data.editors, ink);
    out += column(colX + (colW + gap) * 2, colW, 'Categories', data.categories, ink);

    out += rule(inner, 208, colX - 24, 208, {ink});
    out += monoLabel(inner, H - 28, 'Source / WakaTime', {ink});

    return svg({
        width: W,
        height: H,
        theme,
        faces: fontFaces('chakra', 'mono'),
        body: out,
        title: 'Tracked coding time',
        desc:
            `${Math.round(data.hours)} hours tracked, ${data.range.replace(' / ', ' ').toLowerCase()}. ` +
            data.languages.map((l) => `${l.name} ${l.percent.toFixed(1)}%`).join(', ')
    });
};
