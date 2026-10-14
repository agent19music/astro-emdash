# Response-time fix

## Observed before deployment

The supplied scan reports 5.682 seconds. A separate anonymous HTML request on
14 October 2026 returned HTTP 200 with 1.896 seconds to first byte, including
0.682 seconds through TLS connection establishment. The server's own timing
header reported 157 ms rendering/middleware, 157 ms database time, two queries,
and one cache miss. That reading did not reproduce the reported five-second delay.

D1 reports the primary region as WEUR and read replication as disabled. The
source and previous generated deployment config have no route-cache provider,
no KV query cache binding, and no placement setting. Session mode was `auto`.
The installed adapter documents a five-second session fallback for a known
compatibility-flag issue, but the generated configuration does not contain that
flag: the timeout is a hypothesis, not an established cause of this site's delay.

## Implemented

- Disabled D1 sessions, matching the database's disabled replication mode.
- Enabled EmDash's supported KV object cache for CMS queries. Entries have a
  300-second TTL backstop; normal cache invalidation uses EmDash's epochs. KV
  operations have a 500 ms timeout so a stalled cache read falls back to D1.
- Enabled Astro's Cloudflare cache provider for Home, Pricing and Contact with
  a 60-second edge lifetime and no stale-while-revalidate window. Existing entry,
  settings and menu cache hints provide invalidation tags; EmDash edit/publish
  routes purge those tags through the provider.
- Added middleware to opt query-string previews, authenticated/Authorization
  responses, cookies, errors and other dynamic routes out of shared caching.
  Browsers revalidate anonymous public pages; the Cloudflare provider supplies
  their edge TTL. Admin/API responses stay private.
- Enabled Smart Placement so Cloudflare can choose execution locations from
  observed upstream latency. This avoids guessing the exact primary location
  from the broad WEUR region. Placement requires traffic and can take time to
  settle; it does not accelerate every request automatically.

Wrangler automatically provisions or reuses `warpcart-CACHE` when Sean next runs
`pnpm deploy`. The existing D1 database ID, R2 bucket, CMS entries, mobile-section
text and metadata assets remain unchanged. No database migration or content
update is part of this performance change.

## Tradeoffs and review

Workers Cache runs before Worker authentication. A signed-in editor can receive
an existing anonymous public-page cache entry without an editing toolbar for up
to 60 seconds. Editor-generated responses are never stored. The admin dashboard
is uncached; a unique query string on a public page bypasses its cached variant.
KV is eventually consistent, so cross-location readers may briefly see older
public data after a change. Editor reads retain EmDash's normal cache bypass.

This implementation has not been deployed or performance-tested after the
change. No automated tests or UI QA were run. The pre-change network request and
D1 info command were diagnostic reads. After deploying, Sean should repeat the
SEO scan, compare cold/warm public-page timing, and exercise login, public preview
and a CMS edit to check visibility and cache invalidation.

The complete head-tag reference remains `home-head.html`; no meta tag can remove
the server wait. The current tags already address the reported metadata warnings.

References:

- [EmDash caching](https://docs.emdashcms.com/deployment/cloudflare/)
- [KV object cache](https://docs.emdashcms.com/deployment/object-cache/)
- [Cloudflare placement](https://developers.cloudflare.com/workers/configuration/placement/)
- [Automatic provisioning](https://developers.cloudflare.com/workers/wrangler/configuration/#automatic-provisioning)
