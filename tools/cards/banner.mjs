import {fontFaces} from '../lib/fonts.mjs';
import {
    body,
    cropMarks,
    hullPath,
    logoMark,
    monoLabel,
    panel,
    round,
    rule,
    strokePath,
    svg,
    ticks,
    wordmark
} from '../lib/poster.mjs';

const W = 1200;
const H = 400;

const HEX = [
    [94, 50],
    [72, 11.895],
    [28, 11.895],
    [6, 50],
    [28, 88.105],
    [72, 88.105]
];
const TRI_UP = [
    [50, 6],
    [88.105, 72],
    [11.895, 72]
];
const TRI_DOWN = [
    [50, 94],
    [11.895, 28],
    [88.105, 28]
];
const AXES = [
    [
        [2, 50],
        [98, 50]
    ],
    [
        [26, 8.43],
        [74, 91.57]
    ],
    [
        [26, 91.57],
        [74, 8.43]
    ]
];

const closed = (pts) => `M${pts.map((p) => p.join(' ')).join('L')}Z`;
const open = (pts) => `M${pts.map((p) => p.join(' ')).join('L')}`;

const META = ['Java runtime', 'Systems design', 'Gameplay logic', 'Data layer'];

const STATUS = [
    ['Role', 'Lead developer'],
    ['Base', 'Saarland, Germany'],
    ['Stack', 'Java 25 / Paper']
];

export const banner = (theme) => {
    const {ink} = theme;

    const px = 44;
    const py = 40;
    const pw = W - px * 2;
    const ph = 320;
    const inner = px + 44;
    const railEnd = W - inner;

    const construct = {x: 92, y: 116, size: 150};
    const divider = 282;
    const col = 316;
    const copyEnd = 856;

    let out = '';

    out += cropMarks(16, 16, W - 32, H - 32, {ink});
    out += panel(px, py, pw, ph, {ink});

    out += monoLabel(inner, 76, 'Java / Systems / Plugin architecture', {ink});
    out += ticks(560, 64, 180, 13, {ink, height: 8});
    out += monoLabel(railEnd, 76, 'Germany / EU Central / Online', {ink, anchor: 'end'});
    out += rule(inner, 92, railEnd, 92, {ink});

    const {x: cx, y: cy, size: cs} = construct;
    const scale = cs / 100;
    const place = (pts) => pts.map(([a, b]) => [round(cx + a * scale), round(cy + b * scale)]);

    out += [closed(place(HEX)), closed(place(TRI_UP)), closed(place(TRI_DOWN)), ...AXES.map((a) => open(place(a)))]
        .map((d) => strokePath(d, {ink}))
        .join('');

    const markSize = round(cs * 0.58);
    const markX = round(cx + (cs - markSize) / 2);
    const markY = round(cy + (cs - markSize) / 2);
    out += logoMark(markX, markY, markSize, {ink});
    out += strokePath(hullPath(cx + cs * 0.14, cy + cs * 0.14, cs * 0.72), {ink, dash: '2 5'});

    out += monoLabel(cx, cy - 12, 'Core / Aerulion', {ink, size: 9});
    out += monoLabel(cx + cs, cy + cs + 18, 'Lattice / 30° / 60°', {ink, size: 9, anchor: 'end'});

    out += rule(divider, 116, divider, 322, {ink, dash: '1 6'});

    out += monoLabel(col, 136, 'Professional Java developer / Minecraft system design', {ink, size: 10});
    out += wordmark(col - 4, 212, 'aerulion', {ink, size: 78});
    out += rule(col, 232, col + 220, 232, {ink});
    out += body(col, 262, 'Professional Java development for custom Minecraft', {ink, size: 15.5});
    out += body(col, 284, 'systems and long-term server architecture.', {ink, size: 15.5});

    STATUS.forEach(([label, value], i) => {
        const y = 152 + i * 24;
        out += monoLabel(copyEnd + 30, y, label, {ink, size: 9});
        out += monoLabel(railEnd, y, value, {ink, size: 10, anchor: 'end'});
        out += rule(copyEnd + 30, y + 8, railEnd, y + 8, {ink, dash: '1 5'});
    });

    META.forEach((item, i) => {
        const x = col + i * 200;
        out += rule(x, 300, x, 308, {ink});
        out += monoLabel(x + 10, 308, `${String(i + 1).padStart(2, '0')} / ${item}`, {ink, size: 10});
    });

    out += rule(inner, 322, railEnd, 322, {ink});
    out += monoLabel(inner, 344, 'Node / 001', {ink, size: 10});
    out += monoLabel(inner + 140, 344, 'Status / Active', {ink, size: 10});
    out += monoLabel(railEnd - 240, 344, 'Developing since / 2012', {ink, size: 10, anchor: 'end'});
    out += monoLabel(railEnd, 344, 'Selected work / below', {ink, size: 10, anchor: 'end'});

    return svg({
        width: W,
        height: H,
        theme,
        faces: fontFaces('tektur', 'grotesk', 'mono'),
        body: out,
        title: 'aerulion',
        desc: 'Professional Java development for custom Minecraft systems, performance-focused plugins and long-term server architecture.'
    });
};
