#!/usr/bin/env node
//   node tools/render.mjs              every card, needs a token
//   node tools/render.mjs --offline    banner only

import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

import {THEMES} from './lib/poster.mjs';
import {fetchContributions, fetchProfile, languageTotals, streaks} from './lib/github.mjs';
import {fetchWakatime} from './lib/wakatime.mjs';
import {banner} from './cards/banner.mjs';
import {stats} from './cards/stats.mjs';
import {languages} from './cards/languages.mjs';
import {activity} from './cards/activity.mjs';
import {wakatime} from './cards/wakatime.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets');

const LOGIN = process.env.PROFILE_LOGIN ?? 'aerulion';
const WAKATIME_ID = process.env.WAKATIME_ID ?? '19c2a3e4-3014-48f7-8f0e-658d94406267';
const EXCLUDED_LANGUAGES = ['HTML', 'CSS', 'Shell', 'Batchfile', 'Dockerfile', 'Makefile'];

const offline = process.argv.includes('--offline');

const write = (name, markup) => {
    writeFileSync(join(OUT, `${name}.svg`), markup);
    return `${name}.svg  ${(markup.length / 1024).toFixed(1)} kB`;
};

const bothThemes = (name, render) =>
    Object.values(THEMES).map((theme) => write(`${name}-${theme.name}`, render(theme)));

const main = async () => {
    mkdirSync(OUT, {recursive: true});
    const written = [];

    written.push(...bothThemes('banner', banner));

    if (offline) {
        console.log(written.join('\n'));
        console.log('\noffline: data cards skipped');
        return;
    }

    const token = process.env.GH_STATS_TOKEN || process.env.GITHUB_TOKEN;
    if (!token) throw new Error('Set GH_STATS_TOKEN or GITHUB_TOKEN, or pass --offline');

    const profile = await fetchProfile(token, LOGIN);
    const contributions = await fetchContributions(token, LOGIN, profile.createdAt);
    const streak = streaks(contributions.days);
    const mix = languageTotals(profile.repos, {exclude: EXCLUDED_LANGUAGES});

    const year = contributions.days.slice(-365).reduce((sum, [, c]) => sum + c, 0);
    const synced = new Date().toISOString().slice(0, 10);

    written.push(...bothThemes('stats', (theme) => stats(theme, {...profile, commits: contributions.commits, synced})));
    written.push(...bothThemes('languages', (theme) => languages(theme, mix)));
    written.push(
        ...bothThemes('activity', (theme) =>
            activity(theme, {
                days: contributions.days,
                contributions: {year, total: contributions.contributions},
                streak
            })
        )
    );

    // Keep the committed card rather than failing the run if WakaTime is unavailable.
    try {
        const hours = await fetchWakatime(WAKATIME_ID);
        written.push(...bothThemes('wakatime', (theme) => wakatime(theme, hours)));
    } catch (error) {
        console.warn(`wakatime skipped: ${error.message}`);
    }

    console.log(written.join('\n'));
    console.log(
        `\n${LOGIN}: ${contributions.commits} commits, ${profile.repoCount} repos, ${profile.stars} stars, ` +
        `streak ${streak.current}/${streak.longest}, top language ${mix[0]?.name ?? 'n/a'}`
    );
};

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
