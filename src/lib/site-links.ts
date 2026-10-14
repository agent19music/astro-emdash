export const CONTACT_URL = 'https://wc.uzskicorp.agency/contact';

/** Keep previously saved CMS destinations aligned with the site's contact flow. */
export function resolveSiteLink(href: string): string {
  try {
    const url = new URL(href, CONTACT_URL);
    const hostname = url.hostname.toLowerCase();
    if (hostname === 'warpcart.shop' || hostname.endsWith('.warpcart.shop')) {
      return CONTACT_URL;
    }
    if (hostname === 'play.google.com' && url.searchParams.get('id') === 'com.warpcart.vendor') {
      return CONTACT_URL;
    }
  } catch {
    // Preserve relative links and fragments.
  }
  return href;
}
