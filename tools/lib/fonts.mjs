// An SVG rendered as an image cannot fetch anything, so faces are inlined as data: URIs.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const FONT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'assets', 'fonts');

const FACES = {
    tektur: {file: 'tektur-700.woff2', family: 'Tektur', weight: 700},
    chakra: {file: 'chakra-700.woff2', family: 'Chakra Petch', weight: 700},
    grotesk: {file: 'grotesk-400.woff2', family: 'Space Grotesk', weight: 400},
    mono: {file: 'plexmono-400.woff2', family: 'IBM Plex Mono', weight: 400},
    monoBold: {file: 'plexmono-600.woff2', family: 'IBM Plex Mono', weight: 600}
};

const cache = new Map();

const encode = (file) => {
    if (!cache.has(file)) cache.set(file, readFileSync(join(FONT_DIR, file)).toString('base64'));
    return cache.get(file);
};

export const STACK = {
    display: "'Chakra Petch','Arial Narrow',sans-serif",
    wordmark: "'Tektur','Chakra Petch',sans-serif",
    body: "'Space Grotesk','Helvetica Neue',sans-serif",
    mono: "'IBM Plex Mono',ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace"
};

export const fontFaces = (...names) =>
    names
        .map((name) => {
            const face = FACES[name];
            return `@font-face{font-family:'${face.family}';font-style:normal;font-weight:${face.weight};src:url(data:font/woff2;base64,${encode(face.file)}) format('woff2')}`;
        })
        .join('');
