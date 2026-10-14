import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const require = createRequire(process.env.ARTWORK_NODE_MODULES
	? path.join(process.env.ARTWORK_NODE_MODULES, "package.json") : import.meta.url);
const sharp = require(process.env.ARTWORK_NODE_MODULES
	? "sharp" : createRequire(import.meta.resolve("astro")).resolve("sharp"));
const mark = (await readFile(new URL("../../public/favicon.svg", import.meta.url), "utf8"))
	.replace(/<style>[\s\S]*?<\/style>/, "")
	.replace("<g>", '<g fill="#171717">');

for (const [size, filename] of [[32, "favicon-32x32.png"], [48, "favicon-48x48.png"],
	[180, "apple-touch-icon.png"], [192, "android-chrome-192x192.png"], [512, "android-chrome-512x512.png"]]) {
	const inset = Math.round(size * 0.16);
	const icon = await sharp(Buffer.from(mark)).resize(size - inset * 2).png().toBuffer();
	await sharp({ create: { width: size, height: size, channels: 4, background: "#ffffff" } })
		.composite([{ input: icon, left: inset, top: inset }]).png()
		.toFile(new URL(`../../public/${filename}`, import.meta.url).pathname);
}

// ICO permits PNG payloads. Include both standard browser sizes.
const frames = await Promise.all([32, 48].map(size =>
	readFile(new URL(`../../public/favicon-${size}x${size}.png`, import.meta.url))));
const directory = Buffer.alloc(6 + frames.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(frames.length, 4);
let offset = directory.length;
frames.forEach((frame, i) => {
	const entry = 6 + i * 16;
	directory[entry] = directory[entry + 1] = [32, 48][i];
	directory.writeUInt16LE(1, entry + 4);
	directory.writeUInt16LE(32, entry + 6);
	directory.writeUInt32LE(frame.length, entry + 8);
	directory.writeUInt32LE(offset, entry + 12);
	offset += frame.length;
});
await writeFile(new URL("../../public/favicon.ico", import.meta.url), Buffer.concat([directory, ...frames]));
