/* eslint-disable @next/next/no-img-element -- Sanity provides responsive CDN URLs at runtime. */
import { CollectionExplorer } from "./components/CollectionExplorer";
import { getCollectibles } from "./lib/collectibles";
import { siteConfig } from "./site-config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const collectibles = await getCollectibles();
  const featured = collectibles.filter((item) => item.featured).slice(0, 3);
  const previewItems = featured.length >= 3 ? featured : collectibles.slice(0, 3);

  return (
    <main>
      <a className="skip-link" href="#collection">Skip to the collection</a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={`${siteConfig.name} home`}>
          <span className="wordmark-mark" aria-hidden="true">Ou!</span>
          <span>{siteConfig.name}</span>
        </a>
        <nav className="header-actions" aria-label="Primary navigation">
          <a className="button button-small" href={`tel:${siteConfig.contact.phoneHref}`}>Call us</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Collected over 50+ years</p>
          <h1>Old things.<br />Good stories.<br /><em>One more home.</em></h1>
          <p className="hero-intro">{siteConfig.intro}</p>
          <p className="name-meaning">
            <strong>OUOOPS</strong> stands for {siteConfig.nameMeaning}.
          </p>
          <div className="hero-actions">
            <a className="button" href="#collection">See what we found</a>
            <a className="button button-ghost" href={`mailto:${siteConfig.contact.email}`}>Ask a question</a>
          </div>
          <p className="shipping-note">Local pickup welcome · Shipping can be arranged</p>
        </div>

        <div className="hero-collage" aria-label="A preview of the collection">
          {previewItems.map((item, index) => (
            <figure className={`collage-card collage-card-${index + 1}`} key={item.id}>
              <img src={item.images[0]?.url} alt={item.images[0]?.alt || item.title} />
              <figcaption>{item.category}</figcaption>
            </figure>
          ))}
          <div className="roundel" aria-hidden="true">
            <span>OU</span>
            <small>unique old stuff</small>
          </div>
        </div>
      </section>

      <section className="story-strip" aria-label="About OUOOPS">
        <p>Our children don’t want this stuff, so the price is right to share with old friends and new folks.</p>
      </section>

      <CollectionExplorer items={collectibles} />

      <section className="contact-section" id="contact">
        <div>
          <p className="eyebrow">See something you like?</p>
          <h2>Let’s talk about it.</h2>
          <p>Questions, offers, and friendly conversations are all welcome. We’ll also help arrange shipping.</p>
        </div>
        <div className="contact-card">
          <a href={`tel:${siteConfig.contact.phoneHref}`}><span>Call</span><strong>{siteConfig.contact.phoneDisplay}</strong></a>
          <a href={`mailto:${siteConfig.contact.email}`}><span>Email</span><strong>{siteConfig.contact.email}</strong></a>
        </div>
      </section>

      <footer>
        <div>
          <a className="wordmark wordmark-footer" href="#top">
            <span className="wordmark-mark" aria-hidden="true">Ou!</span>
            <span>{siteConfig.name}</span>
          </a>
          <p>{siteConfig.footerNote}</p>
        </div>
        <div className="footer-links">
          <a href={`mailto:${siteConfig.contact.email}`}>Contact</a>
          <a href={siteConfig.ownerPortalUrl} rel="noreferrer">Manage listings</a>
        </div>
      </footer>
    </main>
  );
}
