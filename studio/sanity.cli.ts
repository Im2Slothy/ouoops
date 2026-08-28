import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "g4sgm4tt",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  project: {
    basePath: "/admin",
  },
  studioHost: process.env.SANITY_STUDIO_HOSTNAME,
});
