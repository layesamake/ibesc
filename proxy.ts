import { NextResponse, type NextRequest } from "next/server";

const LANGS = ["fr", "en", "nl"];

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (LANGS.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return NextResponse.next();
  const accept = (req.headers.get("accept-language") ?? "").toLowerCase();
  const first = accept.split(",")[0]?.trim().slice(0, 2);
  const lang = LANGS.includes(first) ? first : accept.includes("nl") ? "nl" : accept.includes("en") ? "en" : "fr";
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 307);
}

export const config = { matcher: ["/((?!api|admin|_next|flags|robots.txt|favicon.ico|.*\\..*).*)"] };
