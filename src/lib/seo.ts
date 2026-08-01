import type { Metadata } from "next";

export const siteUrl = (
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const siteConfig = {
  name: "LiveLeaf",
  title: "LiveLeaf — A calmer place for your thoughts",
  description:
    "LiveLeaf is a peaceful writing sanctuary for deep focus, structured thoughts, and rapid search. Built around distraction-free writing, fluid organization, and instant search.",
  url: siteUrl,
  ogImage: `${siteUrl}/og-image.png`,
  keywords: [
    "LiveLeaf",
    "notes app",
    "personal knowledge management",
    "distraction free editor",
    "Notion alternative",
    "block editor",
    "fast full text search",
    "structured notes",
    "minimalist writing",
  ],
  author: {
    name: "LiveLeaf Team",
    url: siteUrl,
  },
};

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  canonicalUrl,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
} = {}): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,

    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),

    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl || siteUrl,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@liveleafapp",
    },

    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}
