# tools

Renders the README's cards into `assets/`, in the same poster language as [aerulion.net](https://aerulion.net).

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
| `lib/poster.mjs`      | Primitives: the 30° bevel, hairlines, mono labels, hatch density, the mark |
| `lib/fonts.mjs`       | Subset woff2 → base64 `@font-face`                                         |
| `lib/github.mjs`      | GraphQL: profile, contribution calendars, language totals, streaks         |
| `lib/wakatime.mjs`    | WakaTime's public all-time stats                                           |
| `cards/banner.mjs`    | The masthead. Static — renders with no network                             |
| `cards/stats.mjs`     | `01 / 04` Telemetry                                                        |
| `cards/languages.mjs` | `02 / 04` Composition                                                      |
| `cards/activity.mjs`  | `03 / 04` Cadence                                                          |
| `cards/wakatime.mjs`  | `04 / 04` Instrumentation                                                  |

## Constraints

- Two colours, `#000` and `#fff`. Hierarchy comes from size, position and density.
- Every angle is 30° or 60°. Panel corners are bevelled at 30°.
- 1px hairlines instead of boxes and backgrounds.
- Density, not opacity — the language strip hatches by rank, the contribution grid grows squares by area.
- No animation. GitHub renders README images in secure static mode, where SMIL is throttled with the tab, so anything
  that starts hidden can stay hidden.

## Fonts

`assets/fonts/` holds five woff2 subsets — Tektur, Chakra Petch, Space Grotesk and IBM Plex Mono at two weights — cut
down to the characters the cards use, 32 kB in total. They are inlined as `data:` URIs at render time, since an SVG
loaded as an image cannot fetch anything.
