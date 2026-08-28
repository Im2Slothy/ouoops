import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { NewListingPane } from "./components/NewListingPane";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "g4sgm4tt";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "ouoops-admin",
  title: "OUOOPS Admin",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("OUOOPS Admin")
          .items([
            S.listItem()
              .title("Listings")
              .schemaType("collectible")
              .child(
                S.list()
                  .title("Listings")
                  .items([
                    S.listItem()
                      .id("add-new-listing")
                      .title("Add New Listing")
                      .child(
                        S.component(NewListingPane)
                          .id("add-new-listing-pane")
                          .title("Add New Listing"),
                      ),
                    S.divider(),
                    S.listItem()
                      .id("existing-listings")
                      .title("Existing Listings")
                      .schemaType("collectible")
                      .child(
                        S.documentTypeList("collectible")
                          .title("Existing Listings")
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.divider(),
                    S.listItem()
                      .id("manage-categories")
                      .title("Manage Categories")
                      .schemaType("listingCategory")
                      .child(
                        S.documentTypeList("listingCategory")
                          .title("Categories")
                          .defaultOrdering([{ field: "name", direction: "asc" }]),
                      ),
                  ]),
              ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
