/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-press-release-page.js
  var import_press_release_page_exports = {};
  __export(import_press_release_page_exports, {
    default: () => import_press_release_page_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const heading = element.querySelector(
      ".banner-content h1, .banner-content h2, .field-banner-title h1, .field-banner-title h2, h1, h2"
    );
    const subheading = element.querySelector(".banner-content p, .field-banner-title p, p");
    const ctaLinks = Array.from(
      element.querySelectorAll(".banner-content a, .field-banner-title a, a.button, a.cta")
    );
    const bgImage = element.querySelector(
      'img[class*="background"], img[class*="banner"], img[class*="hero"], picture img'
    );
    if (!heading && !subheading && ctaLinks.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/amgen-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#fb-root"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.component.plain-html",
        "#wrapper",
        "header.header-nav",
        "footer#footer",
        "div.hero-div",
        "div.banner-div",
        ".breadcrumbContainer .component.breadcrumb.navigation-title"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "script",
        "noscript",
        "iframe",
        "link",
        "style"
      ]);
    }
  }

  // tools/importer/transformers/amgen-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections || [];
      if (sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          if (!sel) continue;
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const meta = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(meta);
        }
        if (i > 0 && sectionEl.previousElementSibling) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-press-release-page.js
  var PAGE_TEMPLATE = {
    name: "press-release-page",
    description: "Newsroom press release / company statement article: breadcrumb navigation header over a blue banner, followed by an article body with a headline and long-form rich-text paragraphs (dateline, body copy, About Amgen, forward-looking statements, contacts, source).",
    urls: [
      "https://www.amgen.com/newsroom/press-releases/2021/01/amgen-to-achieve-carbon-neutrality-by-2027"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [
          "body > div.component.container.breadcrumbContainer.blue-background.background-image > div.component-content > div.component.rich-text",
          ".breadcrumbContainer .component.rich-text"
        ]
      }
    ],
    sections: [
      {
        id: "rc8",
        name: "section-breadcrumb-banner",
        selector: [
          "body > div.component.container.breadcrumbContainer.blue-background.background-image",
          ".breadcrumbContainer.blue-background"
        ],
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "rc9",
        name: "section-article-body",
        selector: [
          "body > div.news-articles-container",
          ".news-articles-container"
        ],
        style: null,
        blocks: [],
        defaultContent: [
          "body > div.news-articles-container > section.m-article > h1",
          "body > div.news-articles-container > section.m-article > div.xn-content"
        ]
      }
    ]
  };
  var parsers = {
    "hero-banner": parse
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
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
  var import_press_release_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_press_release_page_exports);
})();
