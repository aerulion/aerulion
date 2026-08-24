import {fontFaces} from '../lib/fonts.mjs';
import {hatch, heading, monoLabel, monoValue, panel, round, rule, svg} from '../lib/poster.mjs';

const W = 590;
const H = 300;
const ROWS = 6;

export const languages = (theme, langs) => {
    const {ink} = theme;
    const px = 12;
    const py = 12;
    const pw = W - px * 2;
    const ph = H - py * 2;
    const inner = px + 26;
    const railEnd = W - inner;
    const width = railEnd - inner;

    const top = langs.slice(0, ROWS);
    const lead = top[0];

    let defs = '';
    let out = panel(px, py, pw, ph, {ink});

    out += monoLabel(inner, 48, 'Composition', {ink, size: 10});
    out += rule(inner + 96, 44, railEnd - 68, 44, {ink});
    out += monoLabel(railEnd, 48, '02 / 04', {ink, size: 10, anchor: 'end'});

    if (lead) {
        out += heading(inner - 2, 104, `${(lead.share * 100).toFixed(1)}%`, {ink, size: 46});
        out += monoLabel(inner, 124, `${lead.name} / by volume`, {ink, size: 10});
    }

    const stripY = 146;
    const stripH = 26;
    let cursor = inner;
    top.forEach((lang, i) => {
        const id = `seg${i}`;
        defs += hatch(id, ink, ROWS - 1 - i);
        const w = Math.max(1.5, round(lang.share * width));
        out += `<rect x="${round(cursor)}" y="${stripY}" width="${w}" height="${stripH}" fill="url(#${id})"/>`;
        if (i > 0) out += rule(round(cursor), stripY, round(cursor), stripY + stripH, {ink});
        cursor += w;
    });
    out += `<rect x="${inner}" y="${stripY}" width="${round(width)}" height="${stripH}" fill="none" stroke="${ink}" stroke-width="1"/>`;

    const half = Math.ceil(top.length / 2);
    top.forEach((lang, i) => {
        const col = i < half ? 0 : 1;
        const y = 206 + (i % half) * 22;
        const x = inner + col * round(width / 2 + 8);
        const end = x + round(width / 2 - 8);
        out += monoLabel(x, y, `${String(i + 1).padStart(2, '0')} ${lang.name}`, {ink, size: 10});
        out += monoValue(end, y, `${(lang.share * 100).toFixed(1)}%`, {ink, size: 11, weight: 600, anchor: 'end'});
        out += rule(x, y + 7, end, y + 7, {ink, dash: '1 4'});
    });

    out += rule(inner, 262, railEnd, 262, {ink});
    out += monoLabel(inner, 278, 'Owned repos / non-fork', {ink, size: 9});
    out += monoLabel(railEnd, 278, 'Density / rank', {ink, size: 9, anchor: 'end'});

    return svg({
        width: W,
        height: H,
        theme,
        faces: fontFaces('chakra', 'mono'),
        defs,
        body: out,
        title: 'Language mix',
        desc: top.map((l) => `${l.name} ${(l.share * 100).toFixed(1)}%`).join(', ')
    });
};
