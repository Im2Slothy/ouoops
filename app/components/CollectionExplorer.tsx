"use client";

/* eslint-disable @next/next/no-img-element -- Listing photos come from the owner's Sanity library. */

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../site-config";
import type { Collectible } from "../types";

const statusLabels = { available: "Available", sold: "Sold", "on-hold": "On hold" };

function priceFor(item: Collectible) {
  if (item.priceLabel) return item.priceLabel;
  if (item.price === null) return "Ask for price";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(item.price);
}

export function CollectionExplorer({ items }: { items: Collectible[] }) {
  const [selected, setSelected] = useState<Collectible | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  function openItem(item: Collectible) {
    setSelectedImage(0);
    setSelected(item);
  }

  useEffect(() => {
    if (!selected) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [selected]);

  return (
    <section className="collection-section" id="collection">
      <div className="section-heading">
        <div><p className="eyebrow">This week’s best deals</p><h2>Browse the collection</h2></div>
        <p>{items.length} curious {items.length === 1 ? "find" : "finds"}, each with a story.</p>
      </div>

      {items.length ? (
        <div className="item-grid">
          {items.map((item) => (
            <article className={`item-card ${item.status === "sold" ? "item-sold" : ""}`} key={item.id}>
              <button className="item-image-button" type="button" onClick={() => openItem(item)} aria-label={`View ${item.title}`}>
                <img src={item.images[0]?.url} alt={item.images[0]?.alt || item.title} loading="lazy" />
                <span className={`status status-${item.status}`}>{statusLabels[item.status]}</span>
                <span className="view-cue">View item</span>
              </button>
              <div className="item-body">
                <p className="item-category">{item.category}</p>
                <h3>{item.title}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-bottom">
                  <strong className="price">{priceFor(item)}</strong>
                  <button type="button" onClick={() => openItem(item)}>Details <span aria-hidden="true">→</span></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>New old treasures are coming soon.</h3>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop">
          <button className="modal-dismiss-layer" type="button" onClick={() => setSelected(null)} aria-label="Close item details" />
          <section className="item-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
            <button ref={closeButtonRef} className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="Close details">×</button>
            <div className="modal-image">
              <img src={selected.images[selectedImage]?.url} alt={selected.images[selectedImage]?.alt || selected.title} />
              <span className={`status status-${selected.status}`}>{statusLabels[selected.status]}</span>
              {selected.images.length > 1 && (
                <div className="modal-thumbnails" aria-label="Choose a photo">
                  {selected.images.map((image, index) => (
                    <button
                      className={index === selectedImage ? "active" : ""}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View photo ${index + 1}`}
                      aria-pressed={index === selectedImage}
                      key={`${image.url}-${index}`}
                    ><img src={image.url} alt="" /></button>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-copy">
              <p className="item-category">{selected.category}</p>
              <h2 id="modal-title">{selected.title}</h2>
              <strong className="modal-price">{priceFor(selected)}</strong>
              <p id="modal-description">
                {selected.description}
                {selected.details && <><br /><br />{selected.details}</>}
              </p>
              <a className="button" href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(`OUOOPS: ${selected.title}`)}`}>I’m interested</a>
              <a className="modal-phone" href={`tel:${siteConfig.contact.phoneHref}`}>or call {siteConfig.contact.phoneDisplay}</a>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
