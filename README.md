# Gabriel Bellamy — Portfolio

My personal site: what I build, how I build it, and how to reach me.

**Live:** https://gbielbellamy.github.io/

This is a personal site, and the repository is public so the work can be looked
at — the code as much as the pages. It is not a template or a starting point for
anyone else's site.

No framework, no build step, no dependencies: hand-written HTML, CSS and
JavaScript you can open by double-clicking. That is a deliberate choice rather
than a limitation — a portfolio should load instantly on a recruiter's phone,
and every line of it should be readable by whoever opens the repository.

## Running it locally

Open `index.html` in a browser. That's it — the site works straight from the
filesystem, with no server and nothing to install.

To serve it over HTTP instead:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Structure

```
index.html            The whole home page
work/
└── northstar.html     Case study
css/
└── style.css          Design tokens, components, responsive rules
js/
├── projects.js        Project data — the work grid is rendered from this
├── tech-icons.js      Technology icon registry
└── main.js            Theme, rendering, scroll behaviour
assets/                Images, résumé, favicon, social preview
└── northstar/         Section screenshots, in both themes
```

## How it works

**Design tokens.** Every colour, space and duration is a CSS custom property.
The theme is a single attribute on `<html>`: `data-theme="light" | "dark"`.
Nothing else in the stylesheet knows a theme exists — the same rules serve both.
Visitors who have not chosen get their system preference through
`prefers-color-scheme`, and an inline script in `<head>` applies the stored
choice before the first paint, so the page never flashes the wrong theme.

**The project grid is data.** Adding a project is one object in
`js/projects.js`; the markup never changes:

```js
{
  id: 'my-project',
  title: 'My Project',
  year: '2026',
  role: 'What the work actually was',
  summary: 'Two or three sentences. What it does and what was hard.',
  tags: ['React', 'TypeScript'],
  image: 'assets/my-project.png',
  alt: 'A real description of the screenshot.',
  links: [{ label: 'GitHub', href: '…', variant: 'outline' }]
}
```

**One icon registry.** `js/tech-icons.js` maps a technology's label to its
glyph, and both the static markup and the generated cards read from it. A
technology therefore looks identical everywhere it appears, and adding one is a
single line. Brand marks come from the [simple-icons](https://simple-icons.org)
set; concepts with no logo of their own — REST APIs, accessibility, the command
line — get a drawn outline instead.

**Screenshots follow the theme.** Each Northstar shot exists twice, captured in
the app's own dark and light themes, and the page shows whichever matches. This
is done with classes rather than `<picture>` and `media`, because `<picture>`
only ever obeys the system preference and would ignore the theme toggle. The
hidden copy is `display: none` and lazy-loaded, so it is never downloaded.

**Classic scripts, not modules.** `js/*.js` load as ordinary scripts on purpose:
ES modules are blocked by CORS on `file://`, and the site should work when
opened directly from disk, not just when served.

## Accessibility

- Skip link, one visible focus ring, and landmarks throughout.
- Real `alt` text on every image; decorative copies are hidden from assistive
  technology rather than described twice.
- The icon-only technology chips keep their label as an accessible name, so
  nothing is lost when the glyph cannot be read.
- All text meets WCAG AA contrast in both themes.
- Every animation is disabled under `prefers-reduced-motion: reduce`.

## Performance

- No dependencies and no build output: one stylesheet, three small scripts.
- Images are lazy-loaded and carry explicit dimensions, so nothing shifts as
  the page loads.
- Fonts are preconnected and loaded with `display=swap`.
- The single scroll listener is throttled with `requestAnimationFrame`, so it
  never runs more often than the browser paints.

## Deploying

The site is static, so any host works. On GitHub Pages: **Settings → Pages**,
source `main` and the root folder.

## Copyright

Copyright (c) 2026 Gabriel Bellamy. All rights reserved.

This repository is published so the work can be viewed, not to be reused. It is
not open source: no licence is granted to copy, modify or redistribute the code
or the content — the written copy, résumé, photographs and screenshots included.

Read it, ask me about any of it, take an idea from it. If you want to use
something, get in touch. See [LICENSE](./LICENSE).
