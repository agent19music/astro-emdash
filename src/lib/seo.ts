export const homeSeo = {
	title: "WarpCart | Sell on WhatsApp, Manage Catalogs & Orders",
	description: "Sell on WhatsApp with WarpCart. Manage your catalog, orders and customer conversations in one workspace.",
};

export const socialImageAlt = "WarpCart: Sell on WhatsApp. Keep everything in one place, over a colourful tulip field.";

// Dimensions belong to the selected asset, not every future CMS upload.
// Add new assets here, or supply imageMeta to Base when selecting another image.
const socialImages: Record<string, { width: number; height: number; alt: string; type: string }> = {
	"/images/warpcart-og.png": { width: 1200, height: 630, alt: socialImageAlt, type: "image/png" },
	"/_emdash/api/media/file/01M4WY3HMGEPD621D71PWS152Y.01M4WY3JDE521PH3ZEAW259KAW.webp": { width: 1200, height: 630, alt: socialImageAlt, type: "image/webp" },
	"/_emdash/api/media/file/01M4WY0DK1BRSPN9916JD97TYJ.01M4WY0HMAJE03AESBDNK1PY43.png": { width: 1200, height: 630, alt: socialImageAlt, type: "image/png" },
};

export function getSocialImageMeta(url: string) {
	return socialImages[new URL(url).pathname];
}
