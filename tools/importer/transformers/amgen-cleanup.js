/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Amgen site-wide cleanup.
 *
 * Removes non-authorable global chrome and layout noise from the Amgen
 * press-release pages so the import contains only page-level authorable
 * content (the blue title banner + the article body).
 *
 * All selectors below were verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / consent / SDK roots that can interfere with parsing.
    // cleaned.html: <div id="onetrust-consent-sdk"> (line 1214),
    //               <div id="fb-root"> (line 16)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#fb-root',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome and empty layout artifacts.
    // cleaned.html references:
    //   body > div.component.plain-html (lines 2, 8) - empty font/preload script comments
    //   #wrapper (line 18) - empty layout div
    //   header.header-nav (line 20) - global site header / nav
    //   footer#footer (line 1163) - global site footer
    //   div.hero-div (line 1071), div.banner-div (line 1073) - empty layout divs
    //   .breadcrumbContainer .component.breadcrumb.navigation-title (line 1077)
    //     - auto-generated breadcrumb trail inside the blue banner (NOT authored content)
    WebImporter.DOMUtils.remove(element, [
      'div.component.plain-html',
      '#wrapper',
      'header.header-nav',
      'footer#footer',
      'div.hero-div',
      'div.banner-div',
      '.breadcrumbContainer .component.breadcrumb.navigation-title',
    ]);

    // Drop leftover non-renderable / safe-to-remove elements.
    WebImporter.DOMUtils.remove(element, [
      'script',
      'noscript',
      'iframe',
      'link',
      'style',
    ]);
  }
}
