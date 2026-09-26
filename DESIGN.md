# dimaforcepush — design system (rev 02)

Decisions come from the design grilling of 2026-09-21…25
(`~/projects/dimaforcepush-brand/DESIGN-GRILLING.md`, Q1–Q18). Main
inspiration: typesafe.ai; house foundation: `design-foundation`.

## Shape of the site

- **Home**: hero (headline, Dima + cactus banner, pinned NOW = latest
  `kind: now` entry), then one mixed chronological feed, 12 entries, then
  `load older` → `/log/page/2/`.
- **log/**: the same feed, paginated, plus a monthly archive on page 1.
- **things/**: feature pages, tagged `PROJECT` or `RESEARCH`; one page per
  project, not per release. Data-only rows from `data/systems.yaml` below.
- **whoami/**: `$ whoami`, banner, prose, `cat facts.txt` sidebar.
- Nav: `log/ · things/ · whoami/`. English only; Hugo multilingual later.

## Entry kinds

| kind | label | body |
| --- | --- | --- |
| `note` | NOTE | text inline, optional Literata aside, no title |
| `log` | BUILDER'S LOG | title, summary, link; optional `thing:` link |
| `artifact` | ARTIFACT | title, summary, real preview image |
| `incident` | BROKE / RECOVERED | title, `timeline:` rows (BROKE, CAUSE, FIX, PROOF) |
| `now` | NOW BUILDING | title, summary, `status`, `mood`; latest one is pinned |

No author name or avatar on entries: single-author site.

## Tokens

**Light**: paper `#f6f4ee` · reading card `#fffdf8` · ink `#151515` · muted
`#5d5a55` (paper only) · link `#1537d6` · visited `#551a8b` · mark/selection
`#ffe14d` · fields: lime `#d9ff62` (now), sky `#b9dfff` (artifact), coral
`#ffb3a7` (incident), lilac `#c5b6ff` (log / project), sun `#ffd878`
(research). Text on colored fields is always ink.

**Dark** (decided 2026-09-26): the design-foundation dark seed (after
Stripe.dev night-owl), mapped role by role, not inverted. Paper `#011627` ·
card `#0a2534` · outside `#010e1a` · ink `#c0c7d1` (10.8:1) · muted `#708da6`
(paper/card only, ≥4.5:1) · rules and hard shadows `#5f7d97` · link `#75d1c4`
· visited `#b39ddb` · mark/selection/focus amber `#fec97d`. Fields keep the
light hues at OKLCH L≈.33 so ink stays ≥6.9:1: lime `#124020`, sky `#083959`,
coral `#56241e`, lilac `#382d58`, sun `#463111`. The hero wash is its own dark
gradient (teal → navy → violet → wine). The banner ink is `currentColor`, so
Dima and the cactus turn light with the text.

**Theme choice**: follows the system (`prefers-color-scheme`, works without
JS). The header `◐ dark` toggle (`aria-pressed`) stores the other theme in
`localStorage`; clicking back to the system's theme clears it. A tiny inline
script in `<head>` applies a stored choice before the CSS, so there is no
flash. The dark token block exists twice in `main.css` (attribute + media
query) and the two must stay identical.

## Wide screens (≥1600×760, decided 2026-09-26)

The frame grows from 1440 to 2200px. The identity panel stays put and the
content scrolls next to it:

- **Home**: the hero (headline, intro, banner at the bottom) is a sticky left
  panel, 42%; the feed scrolls on the right. NOW turns from the hero card into
  a row above the feed, so it never covers the cactus.
- **log/**: title and intro on the left with the banner under them; feed and
  archive on the right.
- **A log entry**: its colored head (kind, date, title, deck) is the left
  panel, the text scrolls on the right.

Below 760px of height the panels would crop, so shorter screens keep the
stacked layout. The banner is sized from the space left (`cqw`/`cqh`).

## Type

Fixel Display 500 (identity, headlines; tight −0.035…−0.068em), Fixel Text
400/500 (reading, 18px/1.55), Geist Mono 400 (dates, tags, statuses, logs),
Literata italic 400 (rare personal asides only). Self-hosted woff2, subset to
Latin + Cyrillic; no Russian-origin faces.

## Banner

`site/assets/img/dima-cactus.svg` is traced with potrace from Dima's own drawing
(`ChatGPT_Image_Sep_25_2026_10_57_51_PM.png`), not redrawn. **Outlines only**:
no fills, every area is transparent; ink uses `currentColor`, the cactus
outline can be tinted with `--dfp-cactus`. Animated parts: `.dfp-eye` (Dima's
eye blinks from both sides — `.dfp-lid` drops ~60% of the opening while
the part below it rises and fades), `.dfp-read`
(pupils read in small jumps toward the viewer's left — his left-to-right, he faces us — and back), `.dfp-ceyes`
(the cactus's eyes blink). The cactus body and pot do not move; its motion marks are removed.
Rebuild with `build_svg.py` / `build_mini.py` in
`~/projects/dimaforcepush-brand/assets/trace/`.

## Motion

Quiet on home: hero gradient drift (transform only); Dima reads (pupils
drift) and blinks with his eyes; the cactus blinks too, always 3 s apart from
Dima (shared 6 s cycle, offset delays); nothing else in the banner moves.
Motion starts after load settles. Feature pages:
scroll-revealed chapters, growing bars, reading progress — CSS scroll-driven
animation inside `@supports`. Everything stops under
`prefers-reduced-motion`.

## Micro-details

Yellow `::selection` (amber in dark), ink focus ring with offset (amber in dark), underline offset .18em and
2px on hover, blue caret, ink scrollbar, current nav item on a marker
background, blinking caret on `$ whoami`.

## Windows

Desktop only (≥1100px, fine pointer): feed links with `data-window` open the
article in a draggable, resizable window with macOS-style lights: red closes,
yellow rolls the window up to its title bar, green maximizes (so does a
double-click on the bar); `↗` opens the page in a new tab. Escape closes
the top window. Ctrl/Cmd/Shift/middle-click are never intercepted, so the
browser opens a new tab as usual. Things pages always open
as full pages. Mobile and no-JS use normal navigation.

## Checks

Lighthouse (mobile, simulated throttling), 2026-09-26 local build: home
97/100/100/100; log 97–100/100/100/100; log entry 99/100/100/100. CI smoke
check in `.github/workflows/hugo.yml`.

Browser review 2026-09-26 (headless Chrome, reduced motion), both themes:
1600×800, 1920×1000, 2560×1300 (home, log/, entries, things/, a feature page,
whoami/), 1440×900, 390×844 with no horizontal overflow. Theme toggle: stored
choice survives reload and clears when it matches the system again; without
JS the system theme applies. Tab reaches the toggle with a visible ring (amber
in dark), and Enter switches the theme. Windows, dragging, maximize, Escape and
load older still pass at 1920. Screenshots:
`~/projects/dimaforcepush-brand/references/review-2026-09-26/`.
