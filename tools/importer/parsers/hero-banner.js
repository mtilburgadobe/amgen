/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-banner
 * Base block: hero
 * Source: https://www.amgen.com/newsroom/press-releases/2021/01/amgen-to-achieve-carbon-neutrality-by-2027
 * Generated: 2026-06-17
 *
 * The hero-banner is a slim blue page-title banner. The block instance element is the
 * `.breadcrumbContainer .component.rich-text` container. On press-release pages this holds
 * only a heading (e.g. "Press Releases") inside
 * `.field-banner-title > .banner-content > h1`. No background image, subheading, or CTA is
 * authored here, so the produced hero table has the block-name row plus a single title row.
 *
 * Defensive fallbacks are included so the parser tolerates variation across pages:
 *  - optional background image (row 2 of the hero block)
 *  - optional heading / subheading / CTA links (row 3 of the hero block)
 */
export default function parse(element, { document }) {
  // Row 3 content: heading (title). Primary selector matches the banner-content heading;
  // fallbacks cover other heading levels or generic title-classed nodes.
  const heading = element.querySelector(
    '.banner-content h1, .banner-content h2, .field-banner-title h1, .field-banner-title h2, h1, h2',
  );

  // Optional subheading / body paragraph (kept if present on other pages).
  const subheading = element.querySelector('.banner-content p, .field-banner-title p, p');

  // Optional CTA links (kept if present on other pages).
  const ctaLinks = Array.from(
    element.querySelectorAll('.banner-content a, .field-banner-title a, a.button, a.cta'),
  );

  // Optional background image (row 2 of the hero block) — only added if present.
  const bgImage = element.querySelector(
    'img[class*="background"], img[class*="banner"], img[class*="hero"], picture img',
  );

  // Empty-block guard: bail gracefully if no meaningful content was found.
  if (!heading && !subheading && ctaLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2 (optional): background image.
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: title + optional subheading + optional CTAs in a single cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
