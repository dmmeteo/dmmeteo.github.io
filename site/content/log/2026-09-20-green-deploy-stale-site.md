---
title: "The deploy was green. The site was stale."
date: 2026-09-20T20:05:00+03:00
kind: incident
summary: "The Pages workflow could succeed without Hugo producing a home page, and then publish an old local build."
timeline:
  - t: "BROKE"
    text: "GitHub Pages workflow green, live site unchanged"
  - t: "CAUSE"
    text: "Hugo exits 0 even when it renders no index.html; the job never asserted its output"
  - t: "FIX"
    text: "A smoke check in CI: index.html, canonical, sitemap, RSS and CNAME must exist"
  - t: "PROOF"
    text: "The same check runs on every pull request, before merge"
---

A green check proves the job finished. It does not prove the artifact is
right. The fix was not in Hugo — it was making the pipeline look at the
thing it was about to ship.
