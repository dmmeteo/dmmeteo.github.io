---
title: "dmmeteo.dev, rebuilt as static field notes"
date: 2026-09-20T20:30:00+03:00
kind: log
summary: "The old page had a video background, analytics and a Twitter widget. Now it is static Hugo with no trackers and no runtime requests."
---

The old page was a `COMING SOON` placeholder with a 19 MB video background,
Google Analytics and an embedded Twitter widget. Underneath it sat a dead
Docsify site and a committed `docs/` build that still pointed at
`localhost:1313`.

It is now a plain Hugo site built in CI and published to GitHub Pages:
no theme, no framework, no analytics, and the only `<script>` on the first
version was JSON-LD. Lighthouse locally: 100 / 100 / 100 / 100.

The first version was a baseline, not the design I wanted. This site is
the second revision.
