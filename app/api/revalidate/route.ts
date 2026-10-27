import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.WP_REVALIDATE_SECRET;
  if (!secret || secret.length < 32) {
    return Response.json({ error: "Synchronisation non configurée." }, { status: 503 });
  }

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return Response.json({ error: "Accès refusé." }, { status: 401 });
  }

  // A WordPress webhook must expire the old value before the next page visit.
  revalidateTag("wordpress", { expire: 0 });
  return Response.json({ revalidated: true });
}
