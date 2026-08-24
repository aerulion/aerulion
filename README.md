<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/banner-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/banner-light.svg">
  <img alt="aerulion — professional Java development for custom Minecraft systems" src="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/banner-dark.svg" width="100%">
</picture>

<sub>
  <a href="https://aerulion.net"><b>aerulion.net</b></a> &nbsp;·&nbsp;
  <a href="https://corpium.net">Corpium</a> &nbsp;·&nbsp;
  <a href="mailto:info@aerulion.net">info@aerulion.net</a> &nbsp;·&nbsp;
  Discord <code>aerulion</code>
</sub>

</div>

---

## Context &nbsp;<sub>`01 / 05`</sub>

> Custom Java architecture, gameplay systems and performant server-side tooling for projects that need stability under
> real load.

I'm a **Java developer from Saarland, Germany**, building **custom gameplay systems** that push past default Minecraft
constraints while staying coherent and maintainable.

As the **lead developer** at [Corpium](https://corpium.net), one of the oldest German Minecraft servers, I design and
maintain the plugin ecosystem the whole server runs on — performance-focused, mechanically deep, and deliberately
vanilla-adjacent in feel.

My range runs from low-level Java optimisation to high-level system design, with particular strengths in **database
architecture** and **scalable plugin development**. Clean abstractions, longevity and operational clarity are core to
the way I build.

|                      |                                            |
|----------------------|--------------------------------------------|
| **Role**             | Lead Developer                             |
| **Base**             | Saarland, Germany                          |
| **Focus**            | Paper, Bukkit, Java, database architecture |
| **Primary client**   | [Corpium](https://corpium.net)             |
| **Developing since** | 2012                                       |

---

## Selected work &nbsp;<sub>`02 / 05`</sub>

### Erenos &nbsp;<sub>`Server platform & plugin API`</sub>

**The platform the rest of Corpium is built on.**

What began in 2021 as a merge of several standalone plugins now spans **forty-four subsystems** and **100.000+ lines** —
items, mobs and drops, economy and auctions, parties, trading, mining, chat, and the player data underneath all of it.

Almost everything a player touches passes through it: thousands of custom items, mob families and drop tables, all
defined in code rather than configuration. It ships as a library too, so the plugins built alongside it compile against
Erenos — what started as a merge of plugins became the foundation the next ones are written on.

`Items, mobs & drops` `Damage & attributes` `Economy & auctions` `Parties & trading` `Player data`
`Published plugin API`

<sub>**Scale** 44 subsystems, 100.000+ lines &nbsp;·&nbsp; **Platform** Paper / Java 25 &nbsp;·&nbsp; **Status**
Active</sub>

### CloudStorage &nbsp;<sub>`Virtual storage system`</sub>

**A server-wide logistics backbone for items and experience.**

A fully integrated virtual storage system designed to manage massive quantities of items and experience. Inspired by
Applied Energistics and Refined Storage, it brings a server-friendly, survival-balanced take on cloud-based inventory,
built specifically for Corpium.

Every item is handled with precision: stacking logic, permissions, filters and upgrade tiers all keep it performant and
flexible at scale — a central logistics backbone that simplifies inventory management without removing the challenge of
resource handling.

`Virtual XP storage` `Import / export buses` `Full inventory syncing` `Stacking logic & filters` `Permissions`
`Upgrade tiers`

<sub>**Scale** Server-wide item & XP pool &nbsp;·&nbsp; **Platform** Custom Paper plugin &nbsp;·&nbsp; **Started**
2020</sub>

### Public code

Most of what I build is private, server-side work. What is public:

| Repository                                                               | What it is                                                                                                   |
|--------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [**VoidWorld**](https://github.com/aerulion/VoidWorld)                   | A super lightweight void world generator plugin for Paper.                                                   |
| [**aerulion.github.io**](https://github.com/aerulion/aerulion.github.io) | [aerulion.net](https://aerulion.net) — Astro, Bun, zero UI framework, four CI gates before anything deploys. |

---

## Stack &nbsp;<sub>`03 / 05`</sub>

|          |                        |
|----------|------------------------|
| Language | Java 25                |
| Platform | Paper API, Bukkit API  |
| Data     | MySQL / MariaDB, Redis |
| Build    | Gradle                 |

---

## Telemetry &nbsp;<sub>`04 / 05`</sub>

<div align="center">

<table>
<tr>
<td width="50%">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/stats-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/stats-light.svg">
  <img alt="GitHub telemetry" src="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/stats-dark.svg" width="100%">
</picture>

</td>
<td width="50%">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/languages-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/languages-light.svg">
  <img alt="Language mix" src="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/languages-dark.svg" width="100%">
</picture>

</td>
</tr>
</table>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/activity-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/activity-light.svg">
  <img alt="Contribution cadence" src="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/activity-dark.svg" width="100%">
</picture>

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/wakatime-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/wakatime-light.svg">
  <img alt="Tracked coding time" src="https://raw.githubusercontent.com/aerulion/aerulion/main/assets/wakatime-dark.svg" width="100%">
</picture>

</div>

---

## Timeline &nbsp;<sub>`05 / 05`</sub>

| Year    | Milestone              | Note                                                                                          |
|---------|------------------------|-----------------------------------------------------------------------------------------------|
| `2012`  | **First Java**         | Started writing Java, two years before any of it had a name.                                  |
| `2014`  | **The aerulion name**  | Picked the name. Personal and hobby work has run under it ever since.                         |
| `2016`  | **Corpium**            | Joined the staff as a supporter, and started writing plugins the same year.                   |
| `2019`  | **Developer**          | The rank caught up with the work that was already being done.                                 |
| `2020`  | **CloudStorage**       | A server-wide pool for items and experience.                                                  |
| `2021`  | **Erenos**             | Years of separate plugins merged into one engine.                                             |
| `2024`  | **The item service**   | The system most of Erenos leans on, taken apart and rebuilt in one pass.                      |
| `2026`  | **The database layer** | Hibernate out, a purpose-built CRUD layer in. Two years in the branch, close to 30.000 lines. |
| `Today` | **100.000+ lines**     | Erenos alone, still under active development.                                                 |

---

<div align="center">
<sub>
  <b>NODE / 001</b> &nbsp;·&nbsp; <b>STATUS / ACTIVE</b> &nbsp;·&nbsp;
  <a href="https://aerulion.net">aerulion.net</a>
</sub>
</div>
