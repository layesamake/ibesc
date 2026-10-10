import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return process.env.ALLOW_INDEXING === "1"
    ? { rules: { userAgent: "*", allow: "/" } }
    : { rules: { userAgent: "*", disallow: "/" } };
}
