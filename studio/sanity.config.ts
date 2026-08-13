import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "replacewithprojectid";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "ou-ooops",
  title: "Ou Ooops — Manage Collectibles",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Ou Ooops")
          .items([
            S.listItem()
              .title("Collectibles")
              .schemaType("collectible")
              .child(S.documentTypeList("collectible").title("Collectibles")),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
