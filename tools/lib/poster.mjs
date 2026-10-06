import {STACK} from './fonts.mjs';

export const TAN30 = Math.tan(Math.PI / 6);
export const CUT_X = 26;
export const HAIRLINE = 1;
// --label-size: every instrumentation label, at every size.
export const LABEL_SIZE = 11;
const LABEL_TRACKING = 0.2;

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

// Plex Mono advances 0.6em, plus the tracking.
export const labelWidth = (content) => String(content).length * LABEL_SIZE * (0.6 + LABEL_TRACKING);

export const monoLabel = (x, y, content, {ink, anchor} = {}) =>
    text(x, y, String(content).toUpperCase(), {
        family: STACK.mono,
        size: LABEL_SIZE,
        weight: 400,
        anchor,
        fill: ink,
        tracking: +(LABEL_SIZE * LABEL_TRACKING).toFixed(2)
    });

export const monoValue = (x, y, content, {ink, size = 14, anchor} = {}) =>
    text(x, y, content, {family: STACK.mono, size, weight: 400, anchor, fill: ink});

// Chakra Petch 600, uppercase, tracked slightly open. 36 is --font-size-3xl, the statistic.
export const heading = (x, y, content, {ink, size = 36, anchor} = {}) =>
    text(x, y, String(content).toUpperCase(), {
        family: STACK.display,
        size,
        weight: 600,
        anchor,
        fill: ink,
        tracking: +(size * 0.01).toFixed(2)
    });

// Tektur 700, lowercase, set tight.
export const wordmark = (x, y, content, {ink, size = 64, anchor} = {}) =>
    text(x, y, content, {
        family: STACK.wordmark,
        size,
        weight: 700,
        anchor,
        fill: ink,
        tracking: -(size * 0.01).toFixed(2)
    });

export const body = (x, y, content, {ink, size = 16, anchor} = {}) =>
    text(x, y, content, {family: STACK.body, size, weight: 400, anchor, fill: ink});

export const rule = (x1, y1, x2, y2, {ink, dash = null} = {}) =>
    `<line x1="${round(x1)}" y1="${round(y1)}" x2="${round(x2)}" y2="${round(y2)}" stroke="${ink}"` +
    ` stroke-width="${HAIRLINE}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

export const strokePath = (d, {ink, dash = null} = {}) =>
    `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${HAIRLINE}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

export const panelPath = (x, y, w, h, cutX = CUT_X) => {
    const cutY = round(cutX * TAN30);
    return (
        `M${round(x + cutX)} ${round(y)}H${round(x + w)}V${round(y + h - cutY)}` +
        `L${round(x + w - cutX)} ${round(y + h)}H${round(x)}V${round(y + cutY)}Z`
    );
};

export const panel = (x, y, w, h, {ink, cutX = CUT_X, dash = null} = {}) =>
    strokePath(panelPath(x, y, w, h, cutX), {ink, dash});

// Eyebrow, hairline, count: the three-part rule that opens every block.
export const sectionRail = (x, end, y, eyebrow, count, {ink}) =>
    monoLabel(x, y, eyebrow, {ink}) +
    rule(x + labelWidth(eyebrow) + 16, y - 4, end - labelWidth(count) - 16, y - 4, {ink}) +
    monoLabel(end, y, count, {ink, anchor: 'end'});

// The hero's tick wave, held still: full, two-thirds on every third, two-fifths on every fourth.
export const ticks = (cx, cy, count, {ink, height = 24}) => {
    const pitch = 6;
    let out = '';
    for (let i = 1; i <= count; i++) {
        const tx = cx + (i - (count + 1) / 2) * pitch;
        const h = height * (i % 4 === 0 ? 0.4 : i % 3 === 0 ? 0.66 : 1);
        out += rule(tx, cy - h / 2, tx, cy + h / 2, {ink});
    }
    return out;
};

// The Nyx Mark, from aerulion.github.io brand/svg/mark-white-tight.svg: X = 24, box √3 : 2.
const MARK_D =
    'M25.8564 20.7846 22.641 22.641 18.9282 16.2102 13.8564 19.1384 12 18.0666 13.8564 14.8512 17.0717 12.9948 ' +
    '13.8564 7.4256 6.9282 19.4256 13.8564 23.4256 17.5692 21.282 19.4256 24.4974 13.8564 27.7128 1.8564 20.7846 13.8564 0Z';
const MARK_H = 27.7128;

const markPoint = (x, y, size, [ux, uy]) => {
    const k = size / MARK_H;
    return [x + (size * (1 - Math.sqrt(3) / 2)) / 2 + (ux - 1.8564) * k, y + uy * k];
};

// The four outer edges of the mark (apex, right, tail, left), carried on in both directions and cut by `box`.
export const markRays = (id, box, x, y, size, {ink}) => {
    const [apex, right, tail, left] = [
        [13.8564, 0],
        [25.8564, 20.7846],
        [13.8564, 27.7128],
        [1.8564, 20.7846]
    ].map((p) => markPoint(x, y, size, p));
    const reach = box.w + box.h;
    const ray = ([ax, ay], [bx, by]) => {
        const len = Math.hypot(bx - ax, by - ay);
        const [dx, dy] = [((bx - ax) / len) * reach, ((by - ay) / len) * reach];
        return rule(ax - dx, ay - dy, ax + dx, ay + dy, {ink});
    };
    return (
        `<clipPath id="${id}"><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}"/></clipPath>` +
        `<g clip-path="url(#${id})">${ray(apex, right)}${ray(apex, left)}${ray(right, tail)}${ray(left, tail)}</g>`
    );
};

// Inked, centred in a square of side `size`; the height fills it and the width is √3/2 of that.
export const logoMark = (x, y, size, {ink} = {}) =>
    `<g transform="translate(${round(x + (size * (1 - Math.sqrt(3) / 2)) / 2)},${round(y)}) ` +
    `scale(${round(size / MARK_H)}) translate(-1.8564,0)"><path d="${MARK_D}" fill="${ink}"/></g>`;

// Density, not weight: every hatch is a 1px line, only the pitch changes.
export const hatch = (id, ink, pitch) =>
    `<pattern id="${id}" width="${pitch}" height="${pitch}" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">` +
    `<line x1="0.5" y1="0" x2="0.5" y2="${pitch}" stroke="${ink}" stroke-width="${HAIRLINE}"/>` +
    `</pattern>`;

export const svg = ({width, height, theme, faces, defs = '', body: content, title, desc}) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t d">` +
    `<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>` +
    `<defs><style>${faces}</style>${defs}</defs>` +
    `<rect width="${width}" height="${height}" fill="${theme.ground}"/>` +
    content +
    `</svg>`;
