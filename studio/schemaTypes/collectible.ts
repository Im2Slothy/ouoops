import { defineArrayMember, defineField, defineType } from "sanity";
import { siteConfig } from "../../app/site-config";

export const collectible = defineType({
  name: "collectible",
  title: "Collectible",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "What is it called?",
      type: "string",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "images",
      title: "Photos",
      description: "The first photo will be the main photo on the website.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Short photo description", type: "string" })],
        }),
      ],
      options: { layout: "grid" },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "price",
      title: "Price in dollars",
      description: "Enter only the number, for example 45.",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "priceLabel",
      title: "Special price wording (optional)",
      description: "Use this only for wording such as ‘Make an offer’ or ‘Price for the set’.",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: siteConfig.categories.map((category) => ({ title: category, value: category })),
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Availability",
      type: "string",
      initialValue: "available",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "On hold", value: "on-hold" },
          { title: "Sold", value: "sold" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Show near the top of the page",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isVisible",
      title: "Show on the website",
      description: "Turn this off to hide an item without deleting it.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Order (optional)",
      description: "Lower numbers appear first.",
      type: "number",
      hidden: true,
    }),
  ],
  preview: {
    select: { title: "title", media: "images.0", status: "status", price: "price" },
    prepare({ title, media, status, price }) {
      const statusLabel = status === "sold" ? "Sold" : status === "on-hold" ? "On hold" : "Available";
      return { title, media, subtitle: `${statusLabel}${typeof price === "number" ? ` · $${price}` : ""}` };
    },
  },
});
