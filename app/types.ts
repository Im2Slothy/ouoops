export type CollectibleImage = { url: string; alt: string };

export type Collectible = {
  id: string;
  slug: string;
  title: string;
  description: string;
  details?: string;
  category: string;
  price: number | null;
  priceLabel?: string;
  status: "available" | "sold" | "on-hold";
  featured: boolean;
  images: CollectibleImage[];
  createdAt: string;
  updatedAt: string;
};
