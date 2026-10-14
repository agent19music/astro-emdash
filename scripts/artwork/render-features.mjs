import { createRequire } from 'node:module';
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { artworkKeys, artworkLayouts, artworkPath } from '../../src/components/artwork/feature-artwork.ts';

// Use project dependencies, or an explicitly supplied browser-artifact runtime.
const require = createRequire(process.env.ARTWORK_NODE_MODULES
	? path.join(process.env.ARTWORK_NODE_MODULES, 'package.json') : import.meta.url);
const { chromium } = require('playwright');
const sharp = require(process.env.ARTWORK_NODE_MODULES ? 'sharp' : createRequire(import.meta.resolve('astro')).resolve('sharp'));
const origin = process.env.ARTWORK_ORIGIN ?? 'http://localhost:4321';
const output = path.resolve('public/images/features');
const staging = path.resolve('public/images/.features-export');
await mkdir(staging, { recursive: true });
let browser;
let count = 0;
let totalBytes = 0;

try {
	browser = await chromium.launch({ headless: true, executablePath: process.env.ARTWORK_BROWSER_PATH || undefined });
	const page = await browser.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2, colorScheme: 'light' });
	const response = await page.goto(`${origin}/artwork/features`, { waitUntil: 'networkidle' });
	if (!response?.ok()) throw new Error(`Artwork canvas unavailable: ${response?.status()}. Start pnpm dev and set ARTWORK_ORIGIN to its URL.`);
	// Rendering source artwork is an export operation, not a UI test. No public page is opened.
	await page.evaluate(async () => {
		for (const image of document.images) {
			image.loading = 'eager';
			await image.decode();
		}
		await document.fonts.ready;
	});
	for (const reduced of [false, true]) {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.evaluate(reduced => {
			document.getElementById('export-transparency')?.remove();
			if (!reduced) return;
			const style = document.createElement('style');
			style.id = 'export-transparency';
			style.textContent = ':root body .feature-blur > span { backdrop-filter: none; -webkit-backdrop-filter: none; } :root body .feature-blur::after { background: linear-gradient(to bottom, rgb(0 0 0 / 0) 0%, rgb(0 0 0 / .5) 40%, rgb(0 0 0 / .8) 100%); } :root body .wa-bottom-chrome { background: #f7f7f7; backdrop-filter: none; }';
			document.head.append(style);
		}, reduced);
		for (const [layout, { widths, height }] of Object.entries(artworkLayouts)) {
			for (const width of widths) {
				await page.evaluate(({ layout, width, height }) => {
					const root = document.documentElement.style;
					root.setProperty('--export-width', `${width}px`);
					root.setProperty('--export-height', `${height}px`);
					const desktop = layout === 'desktop' || layout === 'tablet';
					root.setProperty('--export-phone-width', `${desktop ? (layout === 'tablet' ? 300 : 340) : Math.min(320, width - 36)}px`);
					root.setProperty('--export-phone-top', desktop ? '-62px' : '-24px');
					root.setProperty('--export-phone-scale', desktop ? '1.22' : '1');
					root.setProperty('--export-blur-height', layout === 'compact' ? '75%' : '60%');
				}, { layout, width, height });
				for (const key of artworkKeys) {
					const screenshot = await page.locator(`[data-artwork="${key}"]`).screenshot({ type: 'png', animations: 'disabled' });
					const encoded = await sharp(screenshot).webp({ quality: 94, effort: 6 }).toBuffer();
					await writeFile(path.join(staging, path.basename(artworkPath(key, layout, width, reduced))), encoded);
					count++;
					totalBytes += encoded.length;
				}
			}
		}
		console.log(`Rendered ${reduced ? 'reduced transparency' : 'progressive blur'} artwork.`);
	}
	// Keep existing assets intact until every export succeeds.
	await mkdir(output, { recursive: true });
	for (const key of artworkKeys) {
		for (const [layout, { widths }] of Object.entries(artworkLayouts)) {
			for (const width of widths) {
				for (const reduced of [false, true]) {
					const name = path.basename(artworkPath(key, layout, width, reduced));
					await rename(path.join(staging, name), path.join(output, name));
				}
			}
		}
	}
	console.log(`Exported ${count} WebP assets (${(totalBytes / 1024 / 1024).toFixed(2)} MiB total). Each card loads one responsive asset.`);
} finally {
	await browser?.close();
	await rm(staging, { recursive: true, force: true });
}
