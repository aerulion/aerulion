import {STACK} from './fonts.mjs';

export const TAN30 = Math.tan(Math.PI / 6);
export const CUT_X = 26;
export const HAIRLINE = 1;
export const LABEL_SIZE = 11;

export const THEMES = {
    dark: {name: 'dark', ink: '#ffffff', ground: '#000000'},
    light: {name: 'light', ink: '#000000', ground: '#ffffff'}
};

export const esc = (value) =>
    String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const round = (n) => +n.toFixed(3);

const text = (x, y, content, {family, size, weight, anchor, fill, tracking = 0}) =>
    `<text x="${round(x)}" y="${round(y)}" font-family="${family}" font-size="${size}"` +
    `${weight ? ` font-weight="${weight}"` : ''}${anchor ? ` text-anchor="${anchor}"` : ''}` +
    `${tracking ? ` letter-spacing="${tracking}"` : ''} fill="${fill}">${esc(content)}</text>`;

export const monoLabel = (x, y, content, {ink, size = LABEL_SIZE, anchor, weight = 400} = {}) =>
    text(x, y, String(content).toUpperCase(), {
        family: STACK.mono,
        size,
        weight,
        anchor,
        fill: ink,
        tracking: +(size * 0.2).toFixed(2)
    });

export const monoValue = (x, y, content, {ink, size = 13, anchor, weight = 400, tracking = 0} = {}) =>
    text(x, y, content, {family: STACK.mono, size, weight, anchor, fill: ink, tracking});

export const heading = (x, y, content, {ink, size = 34, anchor, weight = 700} = {}) =>
    text(x, y, String(content).toUpperCase(), {
        family: STACK.display,
        size,
        weight,
        anchor,
        fill: ink,
        tracking: +(size * 0.01).toFixed(2)
    });

export const wordmark = (x, y, content, {ink, size = 64, anchor} = {}) =>
    text(x, y, content, {family: STACK.wordmark, size, weight: 700, anchor, fill: ink});

export const body = (x, y, content, {ink, size = 15, anchor} = {}) =>
    text(x, y, content, {family: STACK.body, size, weight: 400, anchor, fill: ink});

export const rule = (x1, y1, x2, y2, {ink, dash = null, width = HAIRLINE} = {}) =>
    `<line x1="${round(x1)}" y1="${round(y1)}" x2="${round(x2)}" y2="${round(y2)}" stroke="${ink}"` +
    ` stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

export const strokePath = (d, {ink, dash = null, width = HAIRLINE} = {}) =>
    `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

export const panelPath = (x, y, w, h, cutX = CUT_X) => {
    const cutY = round(cutX * TAN30);
    return (
        `M${round(x + cutX)} ${round(y)}H${round(x + w)}V${round(y + h - cutY)}` +
        `L${round(x + w - cutX)} ${round(y + h)}H${round(x)}V${round(y + cutY)}Z`
    );
};

export const panel = (x, y, w, h, {ink, cutX = CUT_X, dash = null} = {}) =>
    strokePath(panelPath(x, y, w, h, cutX), {ink, dash});

export const cropMarks = (x, y, w, h, {ink, arm = 14} = {}) =>
    [
        rule(x, y, x + arm, y, {ink}),
        rule(x, y, x, y + arm, {ink}),
        rule(x + w - arm, y, x + w, y, {ink}),
        rule(x + w, y, x + w, y + arm, {ink}),
        rule(x, y + h - arm, x, y + h, {ink}),
        rule(x, y + h, x + arm, y + h, {ink}),
        rule(x + w - arm, y + h, x + w, y + h, {ink}),
        rule(x + w, y + h - arm, x + w, y + h, {ink})
    ].join('');

export const ticks = (x, y, w, count, {ink, height = 6}) => {
    const step = w / (count - 1);
    let out = '';
    for (let i = 0; i < count; i++) {
        const tx = x + i * step;
        out += rule(tx, y, tx, y + (i % 4 === 0 ? height : height * 0.5), {ink});
    }
    return out;
};

const LOGO_D =
    'm24.686 19.8438-3.1349 1.81-3.3773-5.8496-4.9444 2.8546-1.8102-1.0449 1.81-3.1348 3.1347-1.8098' +
    '-3.1347-5.4297-6.512 11.2793 6.512 3.7597 3.3773-1.95 1.81 3.135-5.1873 2.9947-11.4568-6.6145L13.2292 0Z';

export const logoMark = (x, y, size, {ink} = {}) =>
    `<g transform="translate(${round(x)},${round(y)}) scale(${round(size / 32)}) translate(2.2399,2.24) scale(1.040127)">` +
    `<path d="${LOGO_D}" fill="${ink}"/></g>`;

export const LOGO_HULL = [
    [0.5, 0],
    [0.933, 0.75],
    [0.5, 1],
    [0.067, 0.75]
];

export const hullPath = (x, y, size) =>
    LOGO_HULL.map(([hx, hy], i) => `${i ? 'L' : 'M'}${round(x + hx * size)} ${round(y + hy * size)}`).join('') + 'Z';

export const hatch = (id, ink, level) => {
    const spacing = 14 - level * 1.4;
    return (
        `<pattern id="${id}" width="${round(spacing)}" height="${round(spacing)}" patternUnits="userSpaceOnUse"` +
        ` patternTransform="rotate(-30)">` +
        `<rect width="${round(spacing)}" height="${round(spacing)}" fill="none"/>` +
        `<line x1="0" y1="0" x2="0" y2="${round(spacing)}" stroke="${ink}" stroke-width="${round(1 + level * 0.42)}"/>` +
        `</pattern>`
    );
};

export const svg = ({width, height, theme, faces, defs = '', body: content, title, desc}) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t d">` +
    `<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>` +
    `<defs><style>${faces}</style>${defs}</defs>` +
    `<rect width="${width}" height="${height}" fill="${theme.ground}"/>` +
    content +
    `</svg>`;
