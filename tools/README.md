# tools

Renders the README's cards into `assets/` in Nyx, the design language of [aerulion.net](https://aerulion.net/design).
The light variants are the one sanctioned departure: GitHub serves light mode, so they swap the two inks and change
nothing else.

## Running it

```bash
node tools/render.mjs                              # every card, needs a token
node tools/render.mjs --offline                    # banner only, no network
GITHUB_TOKEN=$(gh auth token) node tools/render.mjs
```

Output lands in `assets/` as `<card>-dark.svg` and `<card>-light.svg`. The README picks between them with
`<picture media="(prefers-color-scheme: …)">`.

## Tokens

Contribution totals, the calendar and both streaks come from the contribution graph and read the same for any token.

Repository count, stars, pull requests and the language mix cover only what the token can see. `GITHUB_TOKEN` reaches
public repositories; a classic PAT with the `repo` scope, set as the `GH_STATS_TOKEN` secret, also reaches private ones.

WakaTime needs no key.

## Layout

| Path                  | What it is                                                                 |
|-----------------------|----------------------------------------------------------------------------|
| `lib/poster.mjs`      | Primitives: the cut, the rule, the rail, mono labels, hatch, mark and rays |
| `lib/fonts.mjs`       | Subset woff2 → base64 `@font-face`                                         |
| `lib/github.mjs`      | GraphQL: profile, contribution calendars, language totals, streaks         |
| `lib/wakatime.mjs`    | WakaTime's public all-time stats                                           |
| `cards/banner.mjs`    | The masthead. Static — renders with no network                             |
| `cards/telemetry.mjs` | `01 / 04` Telemetry and `02 / 04` Composition, two panels in one image     |
| `cards/activity.mjs`  | `03 / 04` Cadence                                                          |
| `cards/wakatime.mjs`  | `04 / 04` Instrumentation                                                  |

## Constraints

- Two inks, `#000` and `#fff`. Hierarchy comes from size, position and density.
- Every angle is 30° or 60°. Panel corners are bevelled at 30°.
- 1px, always. No rule, hatch or outline is thickened or thinned; a heavier line is a different idea.
- Density, not opacity — the language strip hatches by rank at ramp pitches (4 → 24), the contribution grid grows
  squares by area (4 / 6 / 8 / 12) and marks an empty day with a single node.
- Type follows the site: Tektur 700 set tight, Chakra Petch 600 for statistics, Space Grotesk 400 at 16, IBM Plex Mono
  400 with every label at 11 and 0.2em.
- Paddings and row pitches sit on the spacing ramp (4/6/8/12/16/24/32/48/…).
- The mark is `brand/svg/mark-white-tight.svg` from the site, inked, with no shell of its own. Its four outer edges
  carry on as rays to the walls of its cell, the same move as the site's desktop and lockscreen wallpapers.
- Rows are separated by solid hairlines, as in the site's fact lists. No dotted leaders.
- Every card is full width, so the README stacks images and never needs a table (GitHub draws borders around one).
- One frame for every card: panel 12 in, content 24 inside it, the top rail at 48, the footer at height − 28. No crop
  marks; the cut is the only corner treatment.
- Readouts read `Label / value`, dates are ISO, thousands take a comma because the point belongs to the decimals.
- No animation. GitHub renders README images in secure static mode, where SMIL is throttled with the tab, so anything
  that starts hidden can stay hidden.

## Fonts

`assets/fonts/` holds four woff2 subsets — Tektur 700, Chakra Petch 600, Space Grotesk 400 and IBM Plex Mono 400 — cut
down to the characters the cards use, 17 kB in total. They are inlined as `data:` URIs at render time, since an SVG
loaded as an image cannot fetch anything.
