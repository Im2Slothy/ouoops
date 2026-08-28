import { defineField, defineType } from "sanity";

export const listingCategory = defineType({
  name: "listingCategory",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Category name",
      description: "Use a short name visitors will understand, such as “Maps & Ephemera.”",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
  ],
  orderings: [
    {
      title: "Category name",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name" },
    prepare({ title }) {
      return { title: title || "Unnamed category" };
    },
  },
});
