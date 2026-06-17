# Amgen.com Page & Layout Discovery Plan

## Goal
Discover **all pages** of `https://www.amgen.com` and identify the distinct **layouts (page templates)** by collecting URLs, analyzing representative pages, grouping structurally similar pages, and producing a complete site catalog.

## Source
- **Website:** `https://www.amgen.com`
- **Scope:** Full site catalog (URL discovery + page analysis + template grouping + catalog)

## Approach
1. **URL Discovery** — fetch every page URL from `www.amgen.com`, preferring the sitemap (`https://www.amgen.com/sitemap.xml`) and falling back to recursive crawling if needed.
2. **Page Analysis** — analyze a representative sample of pages to capture content structure, sections, and block usage.
3. **Template Grouping** — cluster structurally similar pages into distinct layouts/templates.
4. **Site Catalog** — produce the catalog artifact listing each template, its member URLs, and a description.

## What You'll Get
- A complete list of discovered URLs for `www.amgen.com`.
- A set of distinct page layouts (templates), each with a name, description, and member URLs.
- A count of how many page types/layouts exist across the site.
- Supporting analysis artifacts (structure JSON, screenshots, cleaned HTML) for representative pages.

## Checklist
- [ ] Run URL discovery against `https://www.amgen.com` (sitemap first, fall back to crawl)
- [ ] Review the discovered URL list for coverage and noise (redirects, assets, non-HTML)
- [ ] Analyze representative pages to capture content/section/block structure
- [ ] Group structurally similar pages into distinct layouts/templates
- [ ] Generate the full site catalog (templates + member URLs + descriptions)
- [ ] Summarize: total pages discovered and number of distinct layouts

## Notes
- Execution requires **Execute mode** — this plan is read-only and no work has been performed yet.
- On approval, I'll begin with URL discovery and proceed through to the finished site catalog.
