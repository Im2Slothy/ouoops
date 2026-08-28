import { defineArrayMember, defineField, defineType } from "sanity";
import { siteConfig } from "../../app/site-config";

const photoDescription = defineField({
  name: "alt",
  title: "What is shown in this photo? (optional)",
  description: "A short description helps visitors who use screen readers.",
  type: "string",
  validation: (rule) => rule.max(160),
});

export const collectible = defineType({
  name: "collectible",
  title: "Listing",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Listing title",
      description: "Use the name visitors should see, such as “1930s Chicago Street Map.”",
      type: "string",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "slug",
      title: "Website ID",
      description: "After entering the title, choose Generate. You normally never need to change this later.",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Availability",
      description: "Change this whenever an item is put on hold or sold.",
      type: "string",
      initialValue: "available",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "On Hold", value: "on-hold" },
          { title: "Sold", value: "sold" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "Choose the closest match so visitors can filter the collection.",
      type: "string",
      options: {
        list: siteConfig.categories.map((category) => ({ title: category, value: category })),
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price in dollars",
      description: "Enter only the amount, such as 45 or 125.50. Leave blank to show “Ask for price.”",
      type: "number",
      validation: (rule) => rule.min(0).precision(2),
    }),
    defineField({
      name: "priceLabel",
      title: "Special price wording (optional)",
      description: "Only use this for wording such as “Make an offer.” It replaces the dollar amount on the website.",
      type: "string",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "description",
      title: "Short description",
      description: "Give visitors the most useful facts in two or three sentences.",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(800),
    }),
    defineField({
      name: "images",
      title: "Photos from the older listing form",
      description: "These photos are still live on the website. To replace them, add the photos you want to keep to Main Photo and Additional Photos below.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [photoDescription],
        }),
      ],
      options: { layout: "grid" },
      readOnly: true,
      hidden: ({ document }) => {
        const legacyImages = document?.images;
        return Boolean(document?.primaryImage) || !Array.isArray(legacyImages) || legacyImages.length === 0;
      },
    }),
    defineField({
      name: "primaryImage",
      title: "Main photo",
      description: "This is the first photo shown on the website. Choose Upload to add a photo from the computer or phone.",
      type: "image",
      options: { hotspot: true },
      fields: [photoDescription],
      validation: (rule) => rule.custom((photo, context) => {
        const legacyImages = context.document?.images;
        const hasMainPhoto = Boolean(photo?.asset);
        const hasLegacyPhoto = Array.isArray(legacyImages) && legacyImages.length > 0;

        return hasMainPhoto || hasLegacyPhoto || "Add a main photo.";
      }),
    }),
    defineField({
      name: "additionalImages",
      title: "Additional photos (optional)",
      description: "Add more angles or close-ups. Drag photos to rearrange them.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [photoDescription],
        }),
      ],
      options: { layout: "grid" },
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: "featured",
      title: "Feature this listing",
      description: "Turn this on to use the item in the photo group near the top of the homepage.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "details",
      title: "Story or extra details (optional)",
      description: "Add history, condition notes, measurements, or anything else a buyer may want to know.",
      type: "text",
      rows: 6,
      validation: (rule) => rule.max(2000),
    }),
    defineField({
      name: "isVisible",
      title: "Show this listing on the website",
      description: "Leave this on. Turn it off only when you want to hide the listing without deleting it.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Recently updated",
      name: "updatedAtDesc",
      by: [{ field: "_updatedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      primaryMedia: "primaryImage",
      legacyMedia: "images.0",
      status: "status",
      price: "price",
      priceLabel: "priceLabel",
      category: "category",
    },
    prepare({ title, primaryMedia, legacyMedia, status, price, priceLabel, category }) {
      const statusLabel = status === "sold" ? "Sold" : status === "on-hold" ? "On Hold" : "Available";
      const priceText = priceLabel || (typeof price === "number" ? `$${price.toLocaleString("en-US")}` : "Ask for price");
      return {
        title: title || "Untitled listing",
        media: primaryMedia || legacyMedia,
        subtitle: [statusLabel, priceText, category].filter(Boolean).join(" · "),
      };
    },
  },
});
