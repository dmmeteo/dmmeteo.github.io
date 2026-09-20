# dmmeteo.dev

Source for [dmmeteo.dev](https://dmmeteo.dev/) — a static Hugo site with no
theme, no framework, no JavaScript and no third-party runtime requests.

## Layout

```
site/            Hugo project (the only source of the site)
  content/       _index.md is the homepage; log/*.md are Builder's Log entries
  data/          systems.yaml — the "Things That Actually Run" rows
  layouts/       original templates (flat layout structure, Hugo >= 0.146)
  assets/        css/main.css and the hero image, both through Hugo's pipeline
  static/        favicon, OG card, CNAME — copied verbatim
CNAME            repo-root custom domain record
server-apps/     unrelated homelab docker-compose stack (see below)
```

Build output goes to `site/public/` and is **not** committed.

## Build

Hugo **extended 0.166.0**, pinned in `.github/workflows/hugo.yml`. `hugo.toml`
sets a minimum of 0.146.0, so an older binary fails loudly rather than
silently rendering nothing.

```bash
hugo --source site --minify --gc --printPathWarnings
```

Preview with a plain static server rather than `hugo server`, which injects a
livereload script that must never reach a build you are inspecting:

```bash
python3 -m http.server 8000 --directory site/public
```

`baseURL` lives in `hugo.toml` and is deliberately **not** overridden in CI, so
a local build is byte-identical to the deployed one.

## Publishing

- A Builder's Log entry is one file: `site/content/log/<slug>.md`. Reading time
  is computed; do not write one in. It appears on the homepage, at `/log/`, in
  the sitemap and in both feeds automatically.
- A systems row is an entry in `site/data/systems.yaml`. Omit `url` and it
  renders as plain text instead of a link — that is how the site avoids dead
  links, so do not add a placeholder URL.
- Status values are words (`PUBLIC`, `PRIVATE`), never uptimes, durations or
  version numbers.

## Deployment

Pushes to `master` that touch `site/**` build and deploy to GitHub Pages via
`.github/workflows/hugo.yml`. Pull requests run the same build **without**
deploying — only the `deploy` job holds `pages: write`.

The build includes a smoke check that fails on an empty render, a missing
canonical, a livereload or `localhost:1313` leak, a dead `href="#"`, or any
analytics or Twitter-widget markup. It exists because Hugo exits 0 even when it
renders no home page, which is how a local development build once reached
production and stayed there.

`site/static/CNAME` ships the custom domain in the artifact; the root `CNAME`
is kept as the record for the legacy branch-based source.

## Not part of the site

`server-apps/`, `.github/workflows/deploy-apps.yml` and `.github/ansible-deploy.yml`
deploy a separate homelab docker-compose stack and have nothing to do with the
website.
