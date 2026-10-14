# Feature artwork

The public feature cards render responsive WebP canvases with the progressive
blur and dark caption gradient already baked in. Titles and descriptions stay
as live CMS text. No mockup DOM, SVG noise filter, or backdrop-filter layers are
rendered inside public feature cards.

The original photo crops and phone mockups remain in
`src/components/artwork/FeatureArtworkSource.astro` and `WhatsAppMockup.astro`.
The original blur rules live in `src/styles/feature-artwork-source.css`, imported
only by the development export canvas at `/artwork/features` (404 in production).

## Regenerating

Start `pnpm dev`, then run `pnpm artwork:features`. The exporter needs Playwright,
a Chromium browser, and Sharp. It uses project-installed Playwright and Astro's
Sharp dependency by default; the production app does not need Playwright.
When using a shared artifact runtime, point `ARTWORK_NODE_MODULES` to its
`node_modules` directory and optionally set `ARTWORK_BROWSER_PATH`.
Set `ARTWORK_ORIGIN` when the development server runs on a port other than 4321.

For the current Codex workspace runtime:

```sh
ARTWORK_ORIGIN=http://localhost:4322 \
ARTWORK_NODE_MODULES=/home/uzski/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
ARTWORK_BROWSER_PATH=/home/uzski/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell \
pnpm artwork:features
```

The command renders the source canvas only. It does not navigate the public
site or run UI tests. It stages every image before replacing existing assets.
All output is committed under `public/images/features`; regeneration is not
part of the production build.

## Framing and preferences

The art direction follows viewport width, independently of screen density.
Exports are at 2x resolution, with desktop, tablet, full-width mobile, and
compact mobile framing. Every scene has both background treatments for CMS
reordering and a version matching the existing reduced-transparency fallback.
Unsupported feature icons retain the original catalog illustration fallback.

Card heights, radii, captions, and hover behavior remain CSS-controlled.
The baked blur matches the source at exported sizes. Between samples the image
scales, so arbitrary intermediate widths are not guaranteed pixel-identical to
the original live composition. Lossy WebP uses quality 94.

After changing mockups, photo crops, background art, card dimensions, or blur
rules, regenerate. Editing CMS headings/descriptions does not require exports.
The developer should check scroll smoothness and visual framing in Zen, Firefox,
and mobile Chrome, in both themes. No performance improvement is claimed until
that device validation is done. Automatic dark mode and the floating header's
backdrop blur are unchanged.
