# WarpCart

WarpCart is a marketing website and content-managed product pitch for a WhatsApp commerce service. It presents how merchants can showcase products, answer customer questions, follow up on carts, and manage sales activity. The site is an Astro and EmDash CMS application; it is not the WarpCart commerce backend, WhatsApp integration, or vendor mobile app.

![WarpCart website screenshot](https://media.wc.uzskicorp.agency/captura-2026-10-14-1792009556.webp)

## What’s in the site

- **Home (`/`)** — CMS-authored marketing sections with product illustrations and an illustrative WhatsApp conversation.
- **Pricing (`/pricing`)** — CMS-authored token plans and frequently asked questions.
- **Contact (`/contact`)** — a contact page and an author note about this independent design pitch.
- **Admin (`/_emdash/admin`)** — EmDash’s content management interface for editing site pages and settings.
- **404 page** — a branded not-found response.

Content pages are server-rendered. The homepage has a local JSON fallback so it can still show useful content before a local CMS database has been initialized. Pricing content is read from EmDash and displays an editor-facing empty state when no published pricing entry exists.

## Stack and services

- Astro 7 with the Cloudflare adapter and React integration
- EmDash for content management and versioned marketing blocks
- Cloudflare D1 for content data, R2 for uploaded media, and KV for object caching
- Kumo components and Phosphor icons

The Cloudflare bindings are declared in `wrangler.jsonc`; local development uses the EmDash/Astro development runtime. Illustrations and phone conversations on the site are design examples, not live product integrations or customer screenshots.

## Run locally

Requirements: Node.js compatible with the project dependencies and pnpm 11.

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Astro (normally [http://localhost:4321](http://localhost:4321)). The CMS admin is at `/_emdash/admin`. On first setup, complete EmDash’s setup flow; its seed is configured as `seed/seed.json`. The seed initializes an empty installation. Editing that file does not overwrite content in a database that is already set up.

Useful commands:

```bash
pnpm build          # Build the production site
pnpm preview        # Preview the production build locally
pnpm typecheck      # Run Astro's type checker
pnpm deploy         # Build and deploy with Wrangler
pnpm artwork:features # Render feature artwork assets
```

`pnpm dev` also generates the EmDash environment types when the integration starts. Content payloads used to prepare the current site are kept in `scripts/content/`; use the EmDash admin or revision-aware content APIs/CLI to update an existing database.

## Content model

The site uses a `pages` collection with a title and a first-class blocks field. `src/components/MarketingBlocks.astro` maps the stored block types to their Astro renderers in `src/components/blocks/`:

- Hero
- Features
- Testimonials
- Pricing
- FAQ
- Vendor app

The schema and initial content are in `seed/seed.json`. Global typography, colour, and layout tokens are in `src/styles/tokens.css`; project-specific visual overrides belong in `src/styles/theme.css`.

## Deploy to Cloudflare

Deployment is configured for Cloudflare Workers. `wrangler.jsonc` declares the Worker entrypoint and its D1, R2, and KV bindings. Ensure the Cloudflare account has access to the configured resources and authenticate Wrangler before deploying:

```bash
pnpm wrangler login
pnpm deploy
```

For environment and CMS setup details, see the [EmDash Cloudflare deployment guide](https://docs.emdashcms.com/deployment/cloudflare/).

## Project notes

`docs/content/warpcart-sources.md` records the sources and boundaries used for public product and pricing claims. Pricing and product availability may change; verify current details with WarpCart before relying on this pitch as a live offer. The site contains no live checkout, M-Pesa processing, WhatsApp messaging, or vendor account workflows.
