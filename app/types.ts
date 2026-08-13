export type CollectibleImage = { url: string; alt: string };

export type Collectible = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  priceLabel?: string;
  status: "available" | "sold" | "on-hold";
  featured: boolean;
  images: CollectibleImage[];
};
