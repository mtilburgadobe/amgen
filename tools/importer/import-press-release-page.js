/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS
import amgenCleanupTransformer from './transformers/amgen-cleanup.js';
import amgenSectionsTransformer from './transformers/amgen-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'press-release-page',
  description: 'Newsroom press release / company statement article: breadcrumb navigation header over a blue banner, followed by an article body with a headline and long-form rich-text paragraphs (dateline, body copy, About Amgen, forward-looking statements, contacts, source).',
  urls: [
    'https://www.amgen.com/newsroom/press-releases/2021/01/amgen-to-achieve-carbon-neutrality-by-2027',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: [
        'body > div.component.container.breadcrumbContainer.blue-background.background-image > div.component-content > div.component.rich-text',
        '.breadcrumbContainer .component.rich-text',
      ],
    },
  ],
  sections: [
    {
      id: 'rc8',
      name: 'section-breadcrumb-banner',
      selector: [
        'body > div.component.container.breadcrumbContainer.blue-background.background-image',
        '.breadcrumbContainer.blue-background',
      ],
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'rc9',
      name: 'section-article-body',
      selector: [
        'body > div.news-articles-container',
        '.news-articles-container',
      ],
      style: null,
      blocks: [],
      defaultContent: [
        'body > div.news-articles-container > section.m-article > h1',
        'body > div.news-articles-container > section.m-article > div.xn-content',
      ],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
};

// TRANSFORMER REGISTRY - cleanup first, sections after
const transformers = [
  amgenCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [amgenSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    let found = false;
    blockDef.instances.forEach((selector) => {
      if (found) return;
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) return;
      found = true;
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
    if (!found) {
      console.warn(`Block "${blockDef.name}" not found with any selector`);
    }
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
