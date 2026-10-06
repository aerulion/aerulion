import {fontFaces} from '../lib/fonts.mjs';
import {hatch, heading, monoLabel, monoValue, panel, round, rule, sectionRail, svg} from '../lib/poster.mjs';

// Two panels side by side in one image, so the README needs no table and they line up with the full-width cards.
const W = 1200;
const H = 312;
const HALF = W / 2;
const PX = 12;
const INNER = PX + 24;
const RAIL_END = HALF - INNER;
// Hatch pitch by rank, straight off the spacing ramp: denser is more.
const PITCH = [4, 6, 8, 12, 16, 24];

// Comma thousands: the decimal point is already taken by the percentages beside them.
export const groupDigits = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const share = (lang) => `${(lang.share * 100).toFixed(1)}%`;

const statsPanel = (ink, data) => {
    let out = panel(PX, PX, HALF - PX * 2, H - PX * 2, {ink});
    out += sectionRail(INNER, RAIL_END, 48, 'Telemetry', '01 / 04', {ink});

    out += heading(INNER - 2, 96, groupDigits(data.contributions), {ink});
    out += monoLabel(INNER, 120, 'Contributions / all time', {ink});
    out += rule(INNER, 136, RAIL_END, 136, {ink});

    const rows = [
        ['Repositories', data.repoCount],
        ['Stars earned', data.stars],
        ['Pull requests', data.pullRequests],
        ['Contributed to', data.contributedTo],
        ['Followers', data.followers]
    ];
    rows.forEach(([label, value], i) => {
        const y = 160 + i * 24;
        out += monoLabel(INNER, y, label, {ink});
        out += monoValue(RAIL_END, y, groupDigits(value), {ink, anchor: 'end'});
        out += rule(INNER, y + 8, RAIL_END, y + 8, {ink});
    });

    out += monoLabel(INNER, 284, 'Source / GraphQL', {ink});
    out += monoLabel(RAIL_END, 284, `Synced / ${data.synced}`, {ink, anchor: 'end'});
    return out;
};

const languagesPanel = (ink, langs) => {
    const width = RAIL_END - INNER;
    let defs = '';
    let out = panel(PX, PX, HALF - PX * 2, H - PX * 2, {ink});
    out += sectionRail(INNER, RAIL_END, 48, 'Composition', '02 / 04', {ink});

    if (langs[0]) {
        out += heading(INNER - 2, 96, share(langs[0]), {ink});
        out += monoLabel(INNER, 120, `${langs[0].name} / by volume`, {ink});
    }

    const stripY = 140;
    const stripH = 24;
    let cursor = INNER;
    langs.forEach((lang, i) => {
        defs += hatch(`seg${i}`, ink, PITCH[i]);
        const w = Math.max(1.5, round(lang.share * width));
        out += `<rect x="${round(cursor)}" y="${stripY}" width="${w}" height="${stripH}" fill="url(#seg${i})"/>`;
        if (i > 0) out += rule(round(cursor), stripY, round(cursor), stripY + stripH, {ink});
        cursor += w;
    });
    out += `<rect x="${INNER + 0.5}" y="${stripY + 0.5}" width="${width - 1}" height="${stripH - 1}" fill="none" stroke="${ink}" stroke-width="1"/>`;

    const half = Math.ceil(langs.length / 2);
    langs.forEach((lang, i) => {
        const y = 196 + (i % half) * 24;
        const x = INNER + (i < half ? 0 : round(width / 2 + 12));
        const end = x + round(width / 2 - 12);
        out += monoLabel(x, y, `${String(i + 1).padStart(2, '0')} ${lang.name}`, {ink});
        out += monoValue(end, y, share(lang), {ink, anchor: 'end'});
        if (i % half < half - 1) out += rule(x, y + 8, end, y + 8, {ink});
    });

    out += rule(INNER, 264, RAIL_END, 264, {ink});
    out += monoLabel(INNER, 284, 'Owned repos / non-fork', {ink});
    out += monoLabel(RAIL_END, 284, 'Density / rank', {ink, anchor: 'end'});
    return {defs, out};
};

export const telemetry = (theme, data, mix) => {
    const {ink} = theme;
    const langs = mix.slice(0, PITCH.length);
    const right = languagesPanel(ink, langs);

    return svg({
        width: W,
        height: H,
        theme,
        faces: fontFaces('chakra', 'mono'),
        defs: right.defs,
        body: statsPanel(ink, data) + `<g transform="translate(${HALF},0)">${right.out}</g>`,
        title: 'GitHub telemetry and language mix',
        desc:
            `${groupDigits(data.contributions)} contributions all time, ${data.repoCount} repositories, ` +
            `${data.stars} stars, ${data.pullRequests} pull requests, ${data.followers} followers. ` +
            `Languages: ${langs.map((l) => `${l.name} ${share(l)}`).join(', ')}.`
    });
};
