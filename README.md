# OUOOPS

A mobile-friendly catalog for a lifetime collection of unusual old things. Visitors can search, filter by category, see availability and prices, and contact the owner. Sanity is the only inventory source; routine listing changes do not require GitHub or source-code edits.

## Architecture

- The storefront is a React/Next App Router application built by vinext and served by the existing Cloudflare Worker.
- `app/lib/collectibles.ts` makes a read-only, server-side GROQ request for published Sanity listings. It does not contain demo inventory and it does not use a write token.
- `app/components/CollectionExplorer.tsx` keeps the existing search, category filters, cards, statuses, and photo modal.
- `studio/` is a separate, client-friendly Sanity Studio deployed to Sanity's hosted Studio service.
- `/admin` is handled by the Cloudflare Worker and redirects to the hosted Studio configured in `SANITY_STUDIO_URL`.
- D1/Drizzle remains unused template scaffolding. Supabase is not used.

## Listing fields

Each Listing in Studio contains:

- Listing title and generated Website ID
- Category, price, and short description
- Availability: Available, On Hold, or Sold
- One required main photo and up to 12 additional photos
- Featured toggle
- Optional story or extra details
- Show-on-website toggle

Sanity supplies created and updated timestamps automatically. Publish, unpublish, delete, and image replacement use Sanity's normal document controls.

## Environment variables

For local development, copy `.env.example` to `.env.local`. Add the same values to the Cloudflare deployment environment for production:

```text
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2025-02-19
SANITY_STUDIO_URL=https://your-studio-name.sanity.studio
```

The dataset must allow public reads for this token-free storefront setup. Project IDs and dataset names are identifiers, not write credentials. Never add a Sanity write token to the public application.

Copy `studio/.env.example` to `studio/.env`:

```text
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_HOSTNAME=ouoops-admin
```

`SANITY_STUDIO_HOSTNAME` is optional if the Studio already has a registered hostname.

## Local development

Requires Node.js 22.13 or newer.

Run the storefront:

```bash
npm install
npm run dev
```

Run the editor in another terminal:

```bash
cd studio
npm install
npm run dev
```

The storefront opens at `http://localhost:3000`; Sanity normally opens at `http://localhost:3333`. Sign in with a Sanity account that belongs to the project. If Sanity asks to add the local address as a CORS origin, approve it with credentials enabled.

## First deployment and client handoff

1. In `studio/`, run `npm run deploy` while signed in to the correct Sanity project.
2. Copy the resulting `https://...sanity.studio` URL into the Cloudflare `SANITY_STUDIO_URL` environment variable and redeploy the storefront.
3. Add the production Studio URL to the Sanity project's allowed CORS origins if the deploy command does not do so automatically. Allow credentials for the Studio origin.
4. Invite the owner to the Sanity project with a role that can create, update, publish, and delete documents.
5. Bookmark `https://ouoops.com/admin` for the owner. It opens **OUOOPS Admin → Listings → Add New Listing / Existing Listings**.
6. Create and publish the first real listing. The storefront intentionally shows an empty-collection message until published Sanity content exists.

The owner never needs the Cloudflare dashboard, GitHub, or source files for normal inventory work.

## Production commands

```bash
npm run lint
npm test
cd studio && npm run build
```

Cloudflare continues to use the repository's existing vinext/Vite Worker build. Keep `ouoops.com` attached to that deployment; the Studio remains separately hosted by Sanity.
