export const photoScenes: Record<string, { src: string; alt: string; width: number; height: number; position: string }> = {
	cloud: { src: '/images/people/vendor-at-laptop.webp', alt: 'A vendor in a beanie working on a laptop at a wooden desk', width: 1200, height: 1600, position: '50% 30%' },
	users: { src: '/images/people/customer-reading-message.webp', alt: 'A customer smiling at a message on her phone over coffee', width: 1004, height: 1490, position: '50% 6%' },
	chart: { src: '/images/people/customer-checking-order.webp', alt: 'A customer smiling at an order update on her phone in a park', width: 1080, height: 1080, position: '50% 30%' },
};

export const artworkKeys = ['cloud', 'users', 'chart', 'catalog', 'catalog-light', 'clock', 'clock-light', 'star', 'star-light'];
export const artworkLayouts = {
	desktop: { widths: [415, 490, 564], height: 480 },
	tablet: { widths: [304, 359, 414], height: 480 },
	mobile: { widths: [288, 318, 358, 398, 448, 508, 568, 648], height: 400 },
	compact: { widths: [140, 155, 175, 200, 230, 270, 320], height: 296 },
};

export function artworkKey(icon: string, index: number) {
	if (photoScenes[icon]) return icon;
	const scene = icon === 'clock' || icon === 'star' ? icon : 'catalog';
	return scene + (index % 2 === 1 ? '-light' : '');
}

export function artworkAlt(icon: string) {
	return photoScenes[icon]?.alt ?? `Illustrative iPhone ${icon === 'clock' ? 'Instagram direct message' : 'WhatsApp business chat'}. Sample store and products, not a live screenshot.`;
}

export function artworkPath(key: string, layout: string, width: number, reduced = false) {
	return `/images/features/${key}-${layout}-${width}${reduced ? '-reduced' : ''}.webp`;
}
