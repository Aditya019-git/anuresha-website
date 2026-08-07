import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login", "/client"],
    },
    sitemap: "https://www.anuresha.com/sitemap.xml",
  };
}
