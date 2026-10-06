import {fontFaces} from '../lib/fonts.mjs';
import {body, logoMark, markRays, monoLabel, panel, rule, svg, ticks, wordmark} from '../lib/poster.mjs';

// Same frame as every other card: panel 12 in, content 24 inside that, rails at 48 and H - 28.
const W = 1200;
const H = 336;
const PX = 12;
const INNER = PX + 24;
const RAIL_END = W - INNER;

const META = ['Java runtime', 'Systems design', 'Gameplay logic', 'Data layer'];

const STATUS = [
    ['Role', 'Lead developer'],
    ['Base', 'Saarland, Germany'],
    ['Stack', 'Java 25 / Paper']
];

export const banner = (theme) => {
    const {ink} = theme;

    const top = 64;
    const bottom = H - 48;
    const divider = 250;
    const col = divider + 34;
    const factX = RAIL_END - 232;

    let out = panel(PX, PX, W - PX * 2, H - PX * 2, {ink});

    out += monoLabel(INNER, 48, 'Java / Systems / Plugin architecture', {ink});
    out += ticks(W / 2, 44, 12, {ink, height: 24});
    out += monoLabel(RAIL_END, 48, 'Germany / EU Central / Online', {ink, anchor: 'end'});
    out += rule(PX, top, W - PX, top, {ink});

    // The wallpaper move: the mark inked, its four outer edges carried on to the walls of its cell.
    const cell = {x: PX, y: top, w: divider - PX, h: bottom - top};
    const markSize = 96;
    const markX = cell.x + (cell.w - markSize) / 2;
    const markY = cell.y + (cell.h - markSize) / 2;
    out += markRays('cell', cell, markX, markY, markSize, {ink});
    out += logoMark(markX, markY, markSize, {ink});
    out += rule(divider, top, divider, bottom, {ink});

    out += monoLabel(col, top + 36, 'Professional Java developer / Minecraft system design', {ink});
    out += wordmark(col - 4, top + 104, 'aerulion', {ink, size: 78});
    out += body(col, top + 136, 'Professional Java development for custom Minecraft', {ink});
    out += body(col, top + 160, 'systems and long-term server architecture.', {ink});

    STATUS.forEach(([label, value], i) => {
        const y = top + 44 + i * 24;
        if (i === 0) out += rule(factX, y - 16, RAIL_END, y - 16, {ink});
        out += monoLabel(factX, y, label, {ink});
        out += monoLabel(RAIL_END, y, value, {ink, anchor: 'end'});
        out += rule(factX, y + 8, RAIL_END, y + 8, {ink});
    });

    const chipY = bottom - 24 - 28;
    const chipW = (RAIL_END - col - 8 * (META.length - 1)) / META.length;
    META.forEach((item, i) => {
        const x = col + i * (chipW + 8);
        out += `<rect x="${x + 0.5}" y="${chipY + 0.5}" width="${chipW - 1}" height="27" fill="none" stroke="${ink}" stroke-width="1"/>`;
        out += monoLabel(x + 12, chipY + 18, item, {ink});
    });

    out += rule(PX, bottom, W - PX, bottom, {ink});
    out += monoLabel(INNER, H - 28, 'Node / 001', {ink});
    out += monoLabel(INNER + 140, H - 28, 'Status / Active', {ink});
    out += monoLabel(RAIL_END - 240, H - 28, 'Developing since / 2012', {ink, anchor: 'end'});
    out += monoLabel(RAIL_END, H - 28, 'Telemetry / below', {ink, anchor: 'end'});

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
