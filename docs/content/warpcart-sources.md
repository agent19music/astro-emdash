# WarpCart content pass

Researched on 14 October 2026 for Sean's independent, unsolicited design pitch. These are public product claims, not evidence of a commissioned relationship or independently tested functionality.

## Sources

- Original WarpCart product page — WhatsApp storefront, catalog sync, campaigns/broadcasts, abandoned-cart follow-up, recommendations, dashboard, existing WhatsApp Business app number/Cloud API connection, M-Pesa and Android vendor app.
- Original WarpCart pricing page — 50,000 free starter tokens; Starter KES 500 / 100,000 tokens; Growth KES 2,000 / 500,000 tokens; Scale KES 7,000 / 2,000,000 tokens. AI usage pricing and customer M-Pesa payments to the merchant till. Custom amounts are offered; purchase actions link to https://wc.uzskicorp.agency/contact.
- https://wa.me/254119413044 — WhatsApp destination published in the homepage footer.
- Original WarpCart Android Play Store listing — the homepage app action now links to https://wc.uzskicorp.agency/contact. Availability/features were not independently tested.

## Local content

Published `home`, `pricing` and `contact` in the local EmDash CMS at http://localhost:4322. The pages collection had no existing entries before creation. Updated demo Acme site title/tagline and the demo footer email through EmDash's settings/menu APIs. No database reset or production write was performed.

`seed/seed.json` contains the same authored content for fresh installations. `scripts/content/*.json` retain the request payloads used for this pass. Existing databases do not automatically update when seeds change. Content updates should use CLI revision tokens after reading existing entries; do not blindly recreate pages or reset the database.

The contact page previously hardcoded three Acme email addresses outside the CMS; it now uses the one verified WhatsApp number. Page blocks, title/tagline and footer contact link are CMS-managed. The static contact card remains code-managed.

## Deliberate boundaries

No demo testimonials, vendor counts, conversion figures, GMV or inferred integrations are included. Pricing is a dated public snapshot, not a guarantee; current purchases go to WarpCart's live pricing page. No product screenshots or new gradient assets were invented. The monochrome hero illustration remains a template placeholder. Bespoke navbar, mobile mockups and product-visual sections await Sean's references. Gradient workflow reference: https://gurade.netlify.app/.

Testing and implemented-UI QA were not executed. Sean should exercise Home/Pricing/Contact, responsive layouts, theme choices, FAQ disclosures and outgoing links. Dev-server readiness and CMS write receipts were inspected, not treated as UI validation.

Git delivery is unavailable in this environment: `.git` is an empty read-only directory, so there is no usable branch/history/remote for a commit or PR.

## Photography and WhatsApp visual correction

The follow-up pass inspected https://overtake-wbs.framer.website/ in the browser, including its broad pale hero, centred display headline and substantial side-by-side photo/content panels. The homepage now uses the supplied two-person phone photo as a dominant natural-colour visual, beside an illustrative iPhone/WhatsApp store conversation. The existing Hero image field is populated in the local CMS; a bundled photo fallback supports fresh seeds without a localhost media-download dependency. The fallback template SVG is no longer the landing hero visual.

Feature cards now have two-column product frames, small step numbers and concise existing CMS descriptions. Code-built iPhone views use sample catalog items and demo chat to illustrate catalog, stock questions, campaign response, cart continuation, recommendation and payment/fulfillment. They are labelled illustrative demos, not claimed screenshots or customer endorsements. Text/capability descriptions remain CMS editable; mockup sample chat is code managed.

Gurade was actually used in the browser: Moss / Mesh / Duotone / Grain, colours #505B3F, #ADB59A, #EEEDE5, #D4CDBB, square ratio, scale 50%, distortion 55%. Its PNG export confirmed 1600 × 1600 and the downloaded file was copied to `public/images/gradients/gurade-olive-mesh.png`. The browser initially reported WebGL unavailable; its export retains the colour field but lacks WebGL grain. A separate static SVG noise overlay supplies restrained texture in code. No claim is made that Gurade rendered the grain finish. The exported colour field is used behind the hero and feature phone visuals only.

Hero source: supplied `smiling-at-phone/1.png` (720 × 480). The limited source resolution may soften at large desktop sizes; no AI upscaling or substitute image was generated. A second supplied portrait was imported into the media library as an available candidate, but is not placed in the design.

Bespoke navbar remains pending. Tests, build/typecheck execution and implemented-site UI QA were not performed, following Sean's boundary; visual matching and responsive behaviour await his review in the preview.

The original Gurade PNG is retained for provenance. The site serves a 17 KB WebP conversion of that export (quality 88) rather than the 2.8 MB PNG. Colour/layout were not regenerated.

## iOS fidelity, Kumo and pricing follow-up

Read the full installed `apple-design` skill and inspected the official WhatsApp Messenger iPhone App Store listing and its full-size private-messaging screenshot:

- https://apps.apple.com/tz/app/whatsapp-messenger/id310633997?platform=iphone
- https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/60/0f/39/600f39e2-82c1-d2dd-eb76-d9c58d88e1f9/6.9__Display_2-en_US.png/600x1300bb.webp

The mockup was rebuilt on a logical 390 × 844 phone canvas, scaling type and geometry together with container units. It now uses platform system typography, drawn iOS-style glyphs, distinct cellular/Wi-Fi/battery indicators, a modern Dynamic Island, a 55-point chat header, tailed message bubbles, inline timestamps/read marks, native-colour toolbar glyphs, a denser doodle wallpaper, a product message rather than a generic two-item grid, and a bottom composer/safe area. The official screenshot is a marketing reference, not a complete specification of every current WhatsApp business/commerce screen. Sample catalog/chat/order UI remains illustrative and code managed; there is no live WhatsApp integration.

Kumo 2.14.0 was initially installed, then aligned to 2.6.0 because `@emdash-cms/cloudflare@1.2.0` requires that exact peer version. Its required `@phosphor-icons/react@2.1.10` peer was added. `pnpm peers check` reports no peer dependency issues. Installed 2.6.0 documentation and types confirm `LinkButton` and standalone styles. The actual Kumo LinkButton renders hero CTAs, the header CTA and pricing actions as server-rendered native anchors, without hydration. Standalone Kumo CSS is isolated in a lower cascade layer before site tokens, and site action styling retains olive/neutral colours. Real controls get immediate pressed colour feedback, with a 100ms scale transition only when reduced motion is not requested. Reduced-transparency/high-contrast preferences produce solid phone chrome.

The shared pricing renderer retains the three CMS token packs, prices, feature text and destinations. Cards now align evenly, separate currency/amount/unit, use an inline quiet Growth badge and full-width Kumo actions, and stack below 980px. No schema/content reset, test suite, typecheck, build or implemented-site browser QA was run. Source and dependency metadata were reviewed; rendered fidelity, interaction and responsive results await Sean's testing.
