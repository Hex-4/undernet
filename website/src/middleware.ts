import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Match exactly four digits, and only at root level
  const match = path.match(/^\/(\d{4})$/);
  if (match) {
    const code = match[1];
    return Response.redirect(`${url.origin}/fragments/${code}.txt`, 302);
  }

  return next();
});
