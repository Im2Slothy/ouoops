import assert from "node:assert/strict";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

async function render(pathname = "/", env = {}) {
  const worker = await loadWorker();
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) }, ...env },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders published Sanity listings", async (context) => {
  const previousProjectId = process.env.SANITY_PROJECT_ID;
  const originalFetch = globalThis.fetch;
  process.env.SANITY_PROJECT_ID = "test-project";
  globalThis.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url.startsWith("https://test-project.api.sanity.io/")) {
      return Response.json({
        result: [
          {
            _id: "listing-1",
            _createdAt: "2026-08-01T12:00:00Z",
            _updatedAt: "2026-08-27T12:00:00Z",
            slug: "brass-library-globe",
            title: "Brass Library Globe",
            description: "A handsome old globe with a warm brass stand.",
            category: "OUOOPS & Related Items",
            price: 125,
            status: "available",
            featured: true,
            primaryImage: {
              alt: "An old globe on a brass stand",
              asset: { url: "https://cdn.sanity.io/images/test-project/production/globe.jpg" },
            },
            additionalImages: [],
            images: [],
          },
          {
            _id: "legacy-listing",
            _createdAt: "2026-07-01T12:00:00Z",
            _updatedAt: "2026-08-01T12:00:00Z",
            title: "Folded Road Map Set",
            description: "A listing saved with the original photo field.",
            category: "Computers",
            price: 28,
            status: "on-hold",
            featured: false,
            additionalImages: [],
            images: [{
              alt: "A colorful folded road map",
              asset: { url: "https://cdn.sanity.io/images/test-project/production/map.jpg" },
            }],
          },
        ],
      });
    }
    return originalFetch(input, init);
  };
  context.after(() => {
    globalThis.fetch = originalFetch;
    if (previousProjectId === undefined) delete process.env.SANITY_PROJECT_ID;
    else process.env.SANITY_PROJECT_ID = previousProjectId;
  });

  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Ou Ooops \| Unique Old Stuff<\/title>/i);
  assert.match(html, /Old things/);
  assert.match(html, /Browse the collection/);
  assert.match(html, /Brass Library Globe/);
  assert.match(html, /Folded Road Map Set/);
  assert.match(html, /cdn\.sanity\.io\/images\/test-project/);
  assert.doesNotMatch(html, /Pair of Library Globes|images\.unsplash\.com/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("shows a neutral empty state instead of mock inventory", async () => {
  const previousProjectId = process.env.SANITY_PROJECT_ID;
  delete process.env.SANITY_PROJECT_ID;
  try {
    const response = await render();
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /New old treasures are coming soon/);
    assert.doesNotMatch(html, /Pair of Library Globes|images\.unsplash\.com/);
  } finally {
    if (previousProjectId !== undefined) process.env.SANITY_PROJECT_ID = previousProjectId;
  }
});

test("redirects /admin to the configured Sanity Studio", async () => {
  const response = await render("/admin", {
    SANITY_STUDIO_URL: "https://ouoops-admin.sanity.studio/",
  });
  assert.equal(response.status, 302);
  assert.equal(response.headers.get("location"), "https://ouoops-admin.sanity.studio/");
});
