import { defineMiddleware } from "astro:middleware";

const publicPages = new Set(["/", "/pricing", "/contact"]);

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();
	const path = context.url.pathname.replace(/\/$/, "") || "/";
	const shared = publicPages.has(path)
		&& ["GET", "HEAD"].includes(context.request.method)
		&& !context.url.search
		&& !context.locals.user
		&& !context.request.headers.has("Authorization")
		&& !response.headers.has("Set-Cookie")
		&& response.status === 200
		&& !/\b(?:private|no-store)\b/i.test(response.headers.get("Cache-Control") ?? "");
	const headers = new Headers(response.headers);

	if (shared) {
		// Browsers revalidate; Astro's Cloudflare provider supplies the edge TTL.
		context.cache?.set({ maxAge: 60, swr: 0 });
		headers.set("Cache-Control", "public, max-age=0, must-revalidate");
	} else {
		// Workers Cache can otherwise heuristically cache custom 200 responses.
		context.cache?.set(false);
		headers.set("Cache-Control", "private, no-store");
		headers.delete("Cloudflare-CDN-Cache-Control");
		headers.delete("CDN-Cache-Control");
	}

	return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
});
