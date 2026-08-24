import {fontFaces} from '../lib/fonts.mjs';
import {heading, monoLabel, monoValue, panel, rule, svg} from '../lib/poster.mjs';

const W = 590;
const H = 300;

export const groupDigits = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const stats = (theme, data) => {
    const {ink} = theme;
    const px = 12;
    const py = 12;
    const pw = W - px * 2;
    const ph = H - py * 2;
    const inner = px + 26;
    const railEnd = W - inner;

    let out = panel(px, py, pw, ph, {ink});

    out += monoLabel(inner, 48, 'Telemetry', {ink, size: 10});
    out += rule(inner + 84, 44, railEnd - 68, 44, {ink});
    out += monoLabel(railEnd, 48, '01 / 04', {ink, size: 10, anchor: 'end'});

    out += heading(inner - 2, 104, groupDigits(data.contributions), {ink, size: 46});
    out += monoLabel(inner, 124, 'Contributions, all time', {ink, size: 10});
    out += rule(inner, 142, railEnd, 142, {ink});

    const rows = [
        ['Repositories', data.repoCount],
        ['Stars earned', data.stars],
        ['Pull requests', data.pullRequests],
        ['Contributed to', data.contributedTo],
        ['Followers', data.followers]
    ];

    rows.forEach(([label, value], i) => {
        const y = 168 + i * 22;
        out += monoLabel(inner, y, label, {ink, size: 10});
        out += monoValue(railEnd, y, groupDigits(value), {ink, size: 14, weight: 600, anchor: 'end'});
        if (i < rows.length - 1) out += rule(inner, y + 7, railEnd, y + 7, {ink, dash: '1 4'});
    });

    out += rule(inner, 262, railEnd, 262, {ink});
    out += monoLabel(inner, 278, 'Source / GraphQL', {ink, size: 9});
    out += monoLabel(railEnd, 278, `Synced / ${data.synced}`, {ink, size: 9, anchor: 'end'});

    return svg({
        width: W,
        height: H,
        theme,
        faces: fontFaces('chakra', 'mono'),
        body: out,
        title: 'GitHub telemetry',
        desc:
            `${groupDigits(data.contributions)} contributions all time, ${data.repoCount} repositories, ` +
            `${data.stars} stars, ${data.pullRequests} pull requests, ${data.followers} followers.`
    });
};
