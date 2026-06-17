function titleCase(segment) {
  return segment
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getPageTitle() {
  // Prefer the article headline (the page's own H1 outside this banner),
  // falling back to the document title.
  const headings = [...document.querySelectorAll('main h1')]
    .filter((h) => !h.closest('.hero-banner'));
  if (headings.length) return headings[0].textContent.trim();
  return document.title.split('|')[0].trim();
}

function buildBreadcrumb() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  // Strip an AEM authoring path prefix (e.g. /content) that is absent on live.
  if (segments[0] === 'content') segments.shift();
  // Drop a trailing file extension on the last segment (e.g. .html)
  if (segments.length) {
    segments[segments.length - 1] = segments[segments.length - 1].replace(/\.[^.]+$/, '');
  }

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const ol = document.createElement('ol');

  // Home crumb
  const crumbs = [{ label: 'Home', href: '/' }];

  // Section crumbs: skip purely-numeric segments (dates/ids).
  let path = '';
  segments.forEach((seg, i) => {
    path += `/${seg}`;
    if (/^\d+$/.test(seg)) return;
    const isLast = i === segments.length - 1;
    const label = isLast ? getPageTitle() : titleCase(seg);
    crumbs.push({ label, href: path, current: isLast });
  });

  crumbs.forEach((crumb, i) => {
    const li = document.createElement('li');
    if (crumb.current) {
      const span = document.createElement('span');
      span.setAttribute('aria-current', 'page');
      span.textContent = crumb.label;
      li.append(span);
    } else {
      const a = document.createElement('a');
      a.href = crumb.href;
      a.textContent = crumb.label;
      li.append(a);
      const sep = document.createElement('span');
      sep.className = 'separator';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '>';
      li.append(sep);
    }
    ol.append(li);
  });

  nav.append(ol);
  return nav;
}

export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Prepend the auto-generated, path-driven breadcrumb above the title,
  // inside the centered content column so it aligns with the title.
  const breadcrumb = document.createElement('div');
  breadcrumb.className = 'hero-banner-breadcrumb';
  breadcrumb.append(buildBreadcrumb());
  const column = block.querySelector(':scope > div') || block;
  column.prepend(breadcrumb);
}
