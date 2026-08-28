# OUOOPS

A mobile-friendly catalog for a lifetime collection of unusual old things. Visitors can search, filter by category, see availability and prices, and contact the owner. Sanity is the only inventory source; routine listing changes do not require GitHub or source-code edits.

## Architecture

- The storefront is a React/Next App Router application built by vinext and served by the existing Cloudflare Worker.
- `app/lib/collectibles.ts` makes a read-only, server-side GROQ request for published Sanity listings. It does not contain demo inventory and it does not use a write token.
- `app/components/CollectionExplorer.tsx` keeps the existing search, category filters, cards, statuses, and photo modal.
- `studio/` is a separate, client-friendly Sanity Studio source package.
- The production build places that Studio at `/admin` inside the existing Cloudflare deployment.
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
```

The dataset must allow public reads for this token-free storefront setup. Project IDs and dataset names are identifiers, not write credentials. Never add a Sanity write token to the public application.

Copy `studio/.env.example` to `studio/.env`:

```text
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

The checked-in Studio configuration uses the OUOOPS project as a safe fallback. Project IDs and dataset names are public identifiers, not credentials.

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

1. Add `https://ouoops.com` to the Sanity project's allowed CORS origins with credentials enabled.
2. Invite the owner to the Sanity project with a role that can create, update, publish, and delete documents.
3. Bookmark `https://ouoops.com/admin` for the owner. It opens **OUOOPS Admin → Listings → Add New Listing / Existing Listings**.
4. Sign in there with a Sanity project member account, create the first real listing, and press **Publish**. The storefront intentionally shows an empty-collection message until published Sanity content exists.

The owner never needs the Cloudflare dashboard, GitHub, or source files for normal inventory work.

## Production commands

```bash
npm run lint
npm test
```

Cloudflare continues to use the repository's existing vinext/Vite Worker build. The root build command installs the Studio dependencies, builds it into the site's public assets, and then builds the storefront. Keep `ouoops.com` attached to that deployment.
