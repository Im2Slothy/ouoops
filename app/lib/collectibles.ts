import type { Collectible } from "../types";

type SanityImage = {
  alt?: string;
  asset?: { url?: string };
};

type SanityCollectible = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  slug?: string;
  title?: string;
  description?: string;
  details?: string;
  category?: string;
  price?: number;
  priceLabel?: string;
  status?: string;
  featured?: boolean;
  primaryImage?: SanityImage;
  additionalImages?: SanityImage[];
  images?: SanityImage[];
};

type SanityEnvironment = {
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
};

// Public, read-only production defaults. Environment variables still override
// these values for previews or a future Sanity project migration.
const defaultSanityEnvironment: Required<SanityEnvironment> = {
  SANITY_PROJECT_ID: "g4sgm4tt",
  SANITY_DATASET: "production",
  SANITY_API_VERSION: "2025-02-19",
};

async function getSanityEnvironment(): Promise<SanityEnvironment> {
  try {
    const { env } = await import("cloudflare:workers");
    return env as SanityEnvironment;
  } catch {
    return process.env;
  }
}

const query = `*[
  _type == "collectible" &&
  coalesce(isVisible, true) &&
  (defined(primaryImage.asset) || defined(images[0].asset))
] | order(coalesce(sortOrder, 9999) asc, _createdAt desc) {
  _id, _createdAt, _updatedAt, "slug": slug.current,
  title, description, details, category, price, priceLabel, status, featured,
  primaryImage { alt, asset->{ url } },
  additionalImages[] { alt, asset->{ url } },
  images[] { alt, asset->{ url } }
}`;

const statuses = new Set<Collectible["status"]>(["available", "on-hold", "sold"]);

function imageFor(image: SanityImage | undefined, title: string) {
  const url = image?.asset?.url;
  return url ? { url, alt: image.alt?.trim() || title } : null;
}

function normalizeCollectible(item: SanityCollectible): Collectible | null {
  const title = item.title?.trim();
  const description = item.description?.trim();
  const category = item.category?.trim();
  if (!title || !description || !category) return null;

  const legacyImages = (item.images || [])
    .map((image) => imageFor(image, title))
    .filter((image): image is NonNullable<typeof image> => image !== null);
  const newPrimaryImage = imageFor(item.primaryImage, title);
  const primaryImage = newPrimaryImage || legacyImages[0];
  if (!primaryImage) return null;

  const additionalImages = (item.additionalImages || [])
    .map((image) => imageFor(image, title))
    .filter((image): image is NonNullable<typeof image> => image !== null);
  const candidateImages = newPrimaryImage
    ? [primaryImage, ...additionalImages]
    : [primaryImage, ...legacyImages.slice(1), ...additionalImages];
  const images = candidateImages.filter(
    (image, index) => candidateImages.findIndex((candidate) => candidate.url === image.url) === index,
  );
  const status = statuses.has(item.status as Collectible["status"])
    ? (item.status as Collectible["status"])
    : "available";

  return {
    id: item.slug || item._id,
    slug: item.slug || item._id,
    title,
    description,
    details: item.details?.trim() || undefined,
    category,
    price: typeof item.price === "number" && Number.isFinite(item.price) ? item.price : null,
    priceLabel: item.priceLabel?.trim() || undefined,
    status,
    featured: item.featured === true,
    images,
    createdAt: item._createdAt,
    updatedAt: item._updatedAt,
  };
}

export async function getCollectibles(): Promise<Collectible[]> {
  const runtimeEnv = await getSanityEnvironment();
  const projectId = runtimeEnv.SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || defaultSanityEnvironment.SANITY_PROJECT_ID;
  const dataset = runtimeEnv.SANITY_DATASET || process.env.SANITY_DATASET || defaultSanityEnvironment.SANITY_DATASET;
  const apiVersion = runtimeEnv.SANITY_API_VERSION || process.env.SANITY_API_VERSION || defaultSanityEnvironment.SANITY_API_VERSION;

  if (!/^[a-z0-9-]+$/.test(projectId) || !/^[a-zA-Z0-9_-]+$/.test(dataset) || !/^\d{4}-\d{2}-\d{2}$/.test(apiVersion)) {
    console.error("Sanity configuration is invalid; no listings were loaded.");
    return [];
  }

  try {
    const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}&perspective=published`;
    const response = await fetch(endpoint, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Sanity returned ${response.status}`);
    const payload = (await response.json()) as { result?: SanityCollectible[] };
    return (payload.result || [])
      .map(normalizeCollectible)
      .filter((item): item is Collectible => item !== null);
  } catch (error) {
    console.error("Unable to load published Sanity listings.", error);
    return [];
  }
}
