/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Amgen section boundaries.
 *
 * The press-release-page template defines 2 sections:
 *   1. section-breadcrumb-banner  -> .breadcrumbContainer.blue-background (the blue title banner)
 *   2. section-article-body       -> .news-articles-container (headline + rich-text body)
 *
 * Inserts a section break (<hr>) before each non-first section and a
 * Section Metadata block for each section that defines a `style`.
 * (Both sections have style: null here, so no Section Metadata is created.)
 *
 * Section selectors are taken from page-templates.json `template.sections[].selector`,
 * all verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = (payload && payload.template && payload.template.sections) || [];
    if (sections.length < 2) return;

    const { document } = element.ownerDocument
      ? { document: element.ownerDocument }
      : { document: element };

    // Resolve each section's first element using the template selectors.
    // Process in reverse order so inserted nodes don't shift earlier matches.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const selectors = Array.isArray(section.selector)
        ? section.selector
        : [section.selector];

      let sectionEl = null;
      for (const sel of selectors) {
        if (!sel) continue;
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;

      // Section Metadata block for sections that declare a style.
      if (section.style) {
        const meta = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(meta);
      }

      // Section break before every non-first section that has content before it.
      if (i > 0 && sectionEl.previousElementSibling) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
