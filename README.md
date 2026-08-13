# Ou Ooops

A mobile-friendly catalog for a lifetime collection of unusual old things. Visitors can search, filter by category, see availability and prices, and contact the owner. The owner manages listings in a simple Sanity Studio form—GitHub is never needed for day-to-day updates.

## Where to make changes

- `app/site-config.ts` — site name, introduction, email, phone, categories, and owner portal link.
- `app/lib/collectibles.ts` — temporary sample items shown until Sanity is connected.
- `studio/schemaTypes/collectible.ts` — fields shown in the owner’s listing form.
- `.env.example` — the two values that connect the public website to Sanity.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The site opens at `http://localhost:3000`.

## Connect the owner’s editing screen

1. Create a free project at [Sanity](https://www.sanity.io/get-started).
2. Copy `.env.example` to `.env.local` and add the project ID.
3. Copy `studio/.env.example` to `studio/.env` and add the same project ID.
4. Install and open the editor:

```bash
cd studio
npm install
npm run dev
```

5. When ready, run `npm run deploy` inside `studio`. Sanity will provide a private editor address such as `ou-ooops.sanity.studio`. Put that address in `ownerPortalUrl` in `app/site-config.ts`.
6. Invite the owner from [Sanity Manage](https://www.sanity.io/manage). Publishing, hiding, marking sold, and deleting items all happen there.

Sanity’s free plan details are at [sanity.io/pricing](https://www.sanity.io/pricing).

## Hosting and the GoDaddy domain

The source can stay in the existing private GitHub repository. The current build is Cloudflare-compatible.

- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Connect a GitHub repository](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Manage GoDaddy DNS records](https://www.godaddy.com/help/manage-dns-records-680)

Keep the domain registered at GoDaddy. After the site host provides its DNS target, add that record in GoDaddy’s DNS screen. Use `www.ouooops.com` as the primary address and forward `ouooops.com` to it, or connect both if the host provides apex records.

## Production settings

Add these environment variables to the host:

```text
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
```

Then build with:

```bash
npm run build
```

Until the Sanity project ID is present, the site intentionally shows six sample listings so the finished layout is easy to review.
