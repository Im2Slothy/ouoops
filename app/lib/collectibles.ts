import type { Collectible } from "../types";

const sampleItems: Collectible[] = [
  {
    id: "sample-globes", title: "Pair of Library Globes",
    description: "A handsome pair of vintage tabletop globes with warm patina and clear map details.",
    category: "Globes", price: 85, status: "available", featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1771797628619-926785541b8d?auto=format&fit=crop&w=1400&q=85", alt: "Three antique globes on a wooden table" }],
  },
  {
    id: "sample-books", title: "Old Illustrated Books",
    description: "A small group of well-loved illustrated volumes with decorative cloth covers.",
    category: "Books", price: 42, status: "available", featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=85", alt: "Shelves filled with old books" }],
  },
  {
    id: "sample-camera", title: "Mid-Century Camera",
    description: "A display-worthy vintage camera with its original leather case and plenty of character.",
    category: "Art Deco", price: 65, status: "on-hold", featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1400&q=85", alt: "A vintage camera on a wooden surface" }],
  },
  {
    id: "sample-buttons", title: "Political Button Group",
    description: "An assorted group of campaign and cause buttons collected over several decades.",
    category: "Buttons", price: 38, status: "available", featured: false,
    images: [{ url: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&w=1400&q=85", alt: "A collection of vintage printed objects" }],
  },
  {
    id: "sample-toy", title: "Tin Wind-Up Toy",
    description: "Colorful little mechanical toy with honest wear from years of play and display.",
    category: "Games and Toys", price: 55, status: "sold", featured: false,
    images: [{ url: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&w=1400&q=85", alt: "A colorful vintage toy" }],
  },
  {
    id: "sample-map", title: "Folded Road Map Set",
    description: "A nostalgic collection of regional road maps with bold mid-century cover graphics.",
    category: "Maps", price: 28, status: "available", featured: false,
    images: [{ url: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1400&q=85", alt: "A colorful folded map" }],
  },
];

const query = `*[_type == "collectible" && coalesce(isVisible, true)] | order(coalesce(sortOrder, 9999) asc, _createdAt desc) {
  "id": _id, title, description, category, price, priceLabel,
  "status": coalesce(status, "available"), "featured": coalesce(featured, false),
  "images": images[]{"url": asset->url, "alt": coalesce(alt, ^.title)}
}`;

export async function getCollectibles(): Promise<Collectible[]> {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || "production";
  if (!projectId) return sampleItems;

  try {
    const endpoint = `https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}?query=${encodeURIComponent(query)}`;
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) throw new Error(`Sanity returned ${response.status}`);
    const payload = (await response.json()) as { result?: Collectible[] };
    return payload.result?.length ? payload.result : sampleItems;
  } catch (error) {
    console.error("Unable to load Sanity listings; showing sample items.", error);
    return sampleItems;
  }
}
