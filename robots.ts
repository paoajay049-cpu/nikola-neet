import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: ["/", "/learn"], disallow: ["/admin", "/api", "/dashboard", "/signin-with-chatgpt", "/signout-with-chatgpt"] },
    ],
    sitemap: "https://nikolaneet.com/sitemap.xml",
  };
}
