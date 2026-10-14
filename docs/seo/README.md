# WarpCart SEO changes

The homepage SEO title is `WarpCart | Sell on WhatsApp, Manage Catalogs & Orders`
(53 characters). Its existing description and selected WebP image are preserved.
The site's English/Kenyan context uses `en_KE`. Sean explicitly selected his
personal X account, `@uzski404`, for attribution.

`home-head.html` contains the complete SEO and identity tags requested for the
homepage. It is a reference, not a replacement for Astro's generated font,
stylesheet, script or EmDash JSON-LD contributions. The implementation retains
`EmDashHead` as the source of standard metadata and supplements only the tags it
does not generate. CMS noindex and other editor overrides still take precedence.

The icon files rasterize the existing WarpCart SVG mark on white. Regenerate with
`node scripts/artwork/render-icons.mjs`. If the project cannot resolve Sharp,
set `ARTWORK_NODE_MODULES` to a directory containing that package.
The manifest uses browser display and supplies 192/512 PNG icons; it does not
claim offline functionality or add a service worker.

Social-image dimensions and alt text are tied to known assets in `src/lib/seo.ts`.
When selecting a new CMS OG image, add its true metadata there or pass `imageMeta`
to Base. Unknown images do not inherit the old asset's dimensions.

## Live CMS update versus deployment

The live homepage's SEO panel title and description were updated through the
authenticated EmDash API using the previously read revision token. The mutation
receipt retained its published state, selected OG image, and no-index setting;
no draft revision was created. Its visible content was not changed.
New head tags, icons and the manifest are local source changes and require a
deployment. No deployment, build, tests, UI QA or new score measurement was run.
This checkout has an empty read-only `.git` directory, so no commit or PR is
available from this workspace.

## Response-time improvements

The supplied audit reports 2.424 seconds. Metadata changes cannot reduce server
response time, and one reading does not isolate DNS/TLS, Worker startup, database
round trips, or rendering. Use warm and cold readings from the locations that
matter after deployment; target TTFB at or below 0.8 seconds.

The subsequent speed fix now implements KV object caching, a 60-second public
route cache, direct-primary D1 reads and Smart Placement. See
[performance.md](performance.md) for the measured baseline, configuration,
editor/cache tradeoffs and post-deployment review steps. Keep the existing small
WebP OG image: changing it does not address HTML TTFB.

References: [EmDash SEO](https://docs.emdashcms.com/guides/seo/),
[Cloudflare deployment and caching](https://docs.emdashcms.com/deployment/cloudflare/),
[EmDash object cache](https://docs.emdashcms.com/deployment/object-cache/),
[TTFB guidance](https://web.dev/articles/optimize-ttfb).
